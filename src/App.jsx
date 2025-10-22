import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import Hero from './components/Hero';
import UploadZone from './components/UploadZone';
import Loading from './components/Loading';
import ComparisonSlider from './components/ComparisonSlider';
import FormatSelector from './components/FormatSelector';
import DownloadSection from './components/DownloadSection';
import { validateFile, uploadImage, formatImage, downloadImage } from './services/api';

function App() {
  const [currentState, setCurrentState] = useState('upload'); // 'upload', 'processing', 'result'
  const [error, setError] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [isFormatting, setIsFormatting] = useState(false);

  // Handler para seleção de ficheiro
  const handleFileSelect = async (file) => {
    setError(null);

    // Validar ficheiro
    const validation = await validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Mudar para estado de processamento
    setCurrentState('processing');

    try {
      // Enviar para webhook
      const result = await uploadImage(file);

      // Guardar resultados
      setOriginalImage(result.originalImage);
      setEditedImage(result.editedImage);

      // Mudar para estado de resultado
      setCurrentState('result');

      // Scroll suave para os resultados
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 300);
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      setError(err.message || 'Erro ao processar imagem. Tenta novamente.');
      setCurrentState('upload');
    }
  };

  // Handler para formatar imagem (Instagram/TikTok)
  const handleFormatSelect = async (format) => {
    if (!editedImage) return;

    setIsFormatting(true);

    try {
      const formattedImage = await formatImage(editedImage, format);
      setEditedImage(formattedImage);

      // Scroll suave para ver a imagem formatada
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 300);
    } catch (err) {
      console.error('Erro ao formatar imagem:', err);
      setError('Erro ao formatar imagem. Tenta novamente.');
    } finally {
      setIsFormatting(false);
    }
  };

  // Handler para download
  const handleDownload = () => {
    if (editedImage) {
      downloadImage(editedImage, 'fotografia-editada.jpg');
    }
  };

  // Handler para nova foto
  const handleNewPhoto = () => {
    setCurrentState('upload');
    setOriginalImage(null);
    setEditedImage(null);
    setError(null);
    setIsFormatting(false);

    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />

      {/* Hero Section */}
      <Hero />

      {/* Upload Zone */}
      {currentState === 'upload' && (
        <UploadZone onFileSelect={handleFileSelect} error={error} />
      )}

      {/* Loading State */}
      <AnimatePresence>
        {currentState === 'processing' && (
          <Loading
            message="A processar fotografia..."
            subMessage="Isto pode demorar alguns segundos. Por favor aguarda."
          />
        )}
      </AnimatePresence>

      {/* Result State */}
      {currentState === 'result' && originalImage && editedImage && (
        <>
          {/* Comparison Slider */}
          <ComparisonSlider originalImage={originalImage} editedImage={editedImage} />

          {/* Format Selector */}
          <FormatSelector onFormatSelect={handleFormatSelect} isLoading={isFormatting} />

          {/* Download Section */}
          <DownloadSection onDownload={handleDownload} onNewPhoto={handleNewPhoto} />
        </>
      )}
    </ThemeProvider>
  );
}

export default App;
