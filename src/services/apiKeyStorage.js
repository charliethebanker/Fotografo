/**
 * Serviço para gestão da API Key do Google AI Studio
 * Armazena a key de forma segura no localStorage do navegador
 */

const STORAGE_KEY = 'google_ai_api_key';

/**
 * Guardar API key no localStorage
 * @param {string} apiKey - API key do Google AI Studio
 */
export function saveApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error('API key inválida');
  }

  const trimmedKey = apiKey.trim();
  localStorage.setItem(STORAGE_KEY, trimmedKey);
  console.log('✅ API key guardada com sucesso');
}

/**
 * Obter API key do localStorage
 * @returns {string|null} - API key ou null se não existir
 */
export function getApiKey() {
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * Verificar se existe uma API key guardada
 * @returns {boolean}
 */
export function hasApiKey() {
  const key = getApiKey();
  return key !== null && key.trim().length > 0;
}

/**
 * Remover API key do localStorage
 */
export function clearApiKey() {
  localStorage.removeItem(STORAGE_KEY);
  console.log('🗑️ API key removida');
}

/**
 * Validar formato da API key do Google AI Studio
 * @param {string} apiKey - API key a validar
 * @returns {Object} - { valid: boolean, error?: string }
 */
export function validateApiKeyFormat(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    return { valid: false, error: 'API key não pode estar vazia' };
  }

  const trimmedKey = apiKey.trim();

  // Google AI Studio keys geralmente começam com "AIza"
  if (!trimmedKey.startsWith('AIza')) {
    return {
      valid: false,
      error: 'Formato inválido. API keys do Google AI Studio geralmente começam com "AIza"'
    };
  }

  // Comprimento típico: 39 caracteres
  if (trimmedKey.length < 30) {
    return {
      valid: false,
      error: 'API key muito curta. Verifique se copiou a key completa.'
    };
  }

  // Verificar se contém apenas caracteres alfanuméricos e _ -
  const validChars = /^[A-Za-z0-9_-]+$/;
  if (!validChars.test(trimmedKey)) {
    return {
      valid: false,
      error: 'API key contém caracteres inválidos'
    };
  }

  return { valid: true };
}

/**
 * Testar conexão com Google AI Studio usando a API key
 * @param {string} apiKey - API key a testar
 * @returns {Promise<Object>} - { success: boolean, error?: string }
 */
export async function testApiKey(apiKey) {
  try {
    // Testar com uma chamada simples à API do Google Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: 'test' }]
            }
          ]
        })
      }
    );

    if (response.status === 200) {
      return { success: true };
    } else if (response.status === 403) {
      return {
        success: false,
        error: 'API key inválida ou sem permissões. Verifique no Google AI Studio.'
      };
    } else if (response.status === 429) {
      return {
        success: false,
        error: 'Quota excedida. Aguarde alguns minutos e tente novamente.'
      };
    } else {
      return {
        success: false,
        error: `Erro ao testar: ${response.status}`
      };
    }
  } catch (error) {
    console.error('Erro ao testar API key:', error);
    return {
      success: false,
      error: 'Erro de conexão. Verifique sua internet.'
    };
  }
}
