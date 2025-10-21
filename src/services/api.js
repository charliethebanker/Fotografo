// Configuração da API n8n
const CONFIG = {
  webhookUrl: 'https://olancador.pt/webhook/fotografo',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  requestTimeout: 120000, // 120 segundos
  useFormData: true, // Usar FormData em vez de JSON
};

/**
 * Valida o tipo MIME real de um ficheiro
 * @param {File} file - Ficheiro a validar
 * @returns {Promise<string|null>} - Tipo MIME real ou null se inválido
 */
async function validateRealMimeType(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const arr = new Uint8Array(e.target.result).subarray(0, 4);
      let header = '';
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16).padStart(2, '0');
      }

      // Verificar assinaturas de ficheiro
      let mimeType = null;
      switch (header.substring(0, 8)) {
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          mimeType = 'image/jpeg';
          break;
        case '89504e47':
          mimeType = 'image/png';
          break;
        default:
          if (header.substring(0, 12) === '524946462a' || header.substring(0, 8) === '52494646') {
            mimeType = 'image/webp';
          }
          break;
      }

      resolve(mimeType);
    };
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
}

/**
 * Valida um ficheiro antes do upload
 * @param {File} file - Ficheiro a validar
 * @returns {Object} - { valid: boolean, error?: string }
 */
export async function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'Nenhum ficheiro selecionado.' };
  }

  // Validar tamanho
  if (file.size > CONFIG.maxFileSize) {
    const maxSizeMB = CONFIG.maxFileSize / 1024 / 1024;
    return { valid: false, error: `Ficheiro muito grande. Máximo: ${maxSizeMB}MB.` };
  }

  // Validar tipo MIME declarado
  if (!CONFIG.acceptedFormats.includes(file.type)) {
    return { valid: false, error: 'Formato inválido. Use JPG, PNG ou WEBP.' };
  }

  // Validar tipo MIME real (verificar magic bytes)
  const realMimeType = await validateRealMimeType(file);
  if (!realMimeType || !CONFIG.acceptedFormats.includes(realMimeType)) {
    return { valid: false, error: 'Tipo de ficheiro inválido. Use apenas imagens reais.' };
  }

  return { valid: true };
}

/**
 * Envia imagem para o webhook n8n
 * @param {File} file - Ficheiro de imagem
 * @param {Function} onProgress - Callback opcional para progresso
 * @returns {Promise<Object>} - { success: boolean, editedImage: string, originalImage: string }
 */
export async function uploadImage(file, onProgress) {
  try {
    console.log('📤 A enviar para webhook:', CONFIG.webhookUrl);
    console.log('📁 Ficheiro:', file.name, '|', (file.size / 1024).toFixed(2), 'KB');

    let response;

    if (CONFIG.useFormData) {
      // Enviar via FormData (preferido)
      const formData = new FormData();
      formData.append('file', file);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.requestTimeout);

      response = await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } else {
      // Enviar via JSON/base64 (fallback)
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.requestTimeout);

      response = await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          filename: file.name,
          mimeType: file.type,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    // Processar resposta
    const contentType = response.headers.get('content-type');
    let result;

    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
      console.log('📦 Resposta (JSON):', result);
    } else {
      const text = await response.text();
      console.log('📝 Resposta (texto):', text.substring(0, 200));
      result = { editedImage: text };
    }

    console.log('✅ Resposta do webhook:', result);

    if (!result.editedImage && !result.image) {
      throw new Error('Resposta inválida do servidor.');
    }

    return {
      success: true,
      editedImage: result.editedImage || result.image,
      originalImage: result.originalImage || URL.createObjectURL(file),
    };
  } catch (error) {
    console.error('❌ Erro na comunicação com webhook:', error);

    if (error.name === 'AbortError') {
      throw new Error('Tempo limite excedido. A imagem pode ser muito grande.');
    }

    if (error.message.includes('Failed to fetch')) {
      throw new Error('Erro de conexão. Verifique:\n• Webhook está ativo?\n• CORS configurado?\n• Internet funcional?');
    }

    throw error;
  }
}

/**
 * Cria um canvas com formato específico (Instagram/TikTok)
 * @param {string} imageUrl - URL da imagem
 * @param {string} format - 'instagram' ou 'tiktok'
 * @returns {Promise<string>} - Data URL da imagem formatada
 */
export async function formatImage(imageUrl, format) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Definir dimensões
      if (format === 'instagram') {
        canvas.width = 1080;
        canvas.height = 1350; // 4:5 ratio
      } else if (format === 'tiktok') {
        canvas.width = 1080;
        canvas.height = 1920; // 9:16 ratio
      }

      // Calcular escala para cover
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Centralizar imagem
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;

      // Desenhar
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };

    img.onerror = () => reject(new Error('Erro ao carregar imagem para formatar'));
    img.src = imageUrl;
  });
}

/**
 * Download de imagem
 * @param {string} imageUrl - URL da imagem
 * @param {string} filename - Nome do ficheiro
 */
export function downloadImage(imageUrl, filename = 'foto-editada.jpg') {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
