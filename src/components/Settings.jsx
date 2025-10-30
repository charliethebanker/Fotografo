import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ApiTutorial from './ApiTutorial';
import {
  getApiKey,
  saveApiKey,
  clearApiKey,
  validateApiKeyFormat,
  testApiKey,
  hasApiKey,
} from '../services/apiKeyStorage';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const Modal = styled(motion.div)`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: ${({ theme }) => theme.borderRadius.xl} ${({ theme }) => theme.borderRadius.xl} 0 0;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  padding: ${({ theme }) => theme.spacing.xs};
  transition: all ${({ theme }) => theme.transitions.fast};
  line-height: 1;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  padding-right: 50px;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  border: 2px solid ${({ theme, error }) => (error ? '#ef4444' : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  letter-spacing: 0.5px;

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => (error ? '#ef4444' : theme.colors.accent)};
    box-shadow: 0 0 0 3px ${({ theme, error }) => (error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)')};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
    opacity: 0.6;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    letter-spacing: normal;
  }
`;

const ToggleVisibilityButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  padding: ${({ theme }) => theme.spacing.xs};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ErrorMessage = styled(motion.p)`
  color: #ef4444;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SuccessMessage = styled(motion.p)`
  color: #10b981;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ connected }) => (connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)')};
  color: ${({ connected }) => (connected ? '#10b981' : '#6b7280')};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.accent};
  color: white;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: ${({ theme }) => theme.colors.text.primary};
  border: 2px solid ${({ theme }) => theme.colors.border};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const DangerButton = styled(Button)`
  background: white;
  color: #ef4444;
  border: 2px solid #ef4444;

  &:hover:not(:disabled) {
    background: #ef4444;
    color: white;
  }
`;

const Settings = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedKey = getApiKey();
      if (savedKey) {
        setApiKey(savedKey);
        setIsConnected(true);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    setError('');
    setSuccess('');

    // Validar formato
    const validation = validateApiKeyFormat(apiKey);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Guardar
    try {
      saveApiKey(apiKey);
      setSuccess('✅ API key guardada com sucesso!');
      setIsConnected(true);

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTest = async () => {
    setError('');
    setSuccess('');

    if (!apiKey) {
      setError('Por favor, insira uma API key primeiro');
      return;
    }

    setIsTesting(true);

    try {
      const result = await testApiKey(apiKey);

      if (result.success) {
        setSuccess('✅ Conexão bem-sucedida! API key válida.');
        setIsConnected(true);

        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError(result.error);
        setIsConnected(false);
      }
    } catch (err) {
      setError('Erro ao testar conexão');
      setIsConnected(false);
    } finally {
      setIsTesting(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Tem certeza que deseja remover a API key?')) {
      clearApiKey();
      setApiKey('');
      setIsConnected(false);
      setSuccess('🗑️ API key removida');

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
        >
          <Modal
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25 }}
          >
            <Header>
              <Title>⚙️ Configurações</Title>
              <CloseButton onClick={onClose}>×</CloseButton>
            </Header>

            <Content>
              <Section>
                <Label htmlFor="api-key">Google AI Studio API Key</Label>
                <InputWrapper>
                  <Input
                    id="api-key"
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    error={error}
                  />
                  <ToggleVisibilityButton
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    title={showApiKey ? 'Ocultar API key' : 'Mostrar API key'}
                  >
                    {showApiKey ? '👁️' : '🔒'}
                  </ToggleVisibilityButton>
                </InputWrapper>

                {error && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ⚠️ {error}
                  </ErrorMessage>
                )}

                {success && (
                  <SuccessMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {success}
                  </SuccessMessage>
                )}

                <StatusBadge connected={isConnected}>
                  {isConnected ? '✅ Conectado' : '⚪ Não conectado'}
                </StatusBadge>

                <ButtonGroup>
                  <PrimaryButton onClick={handleSave} disabled={!apiKey}>
                    💾 Guardar
                  </PrimaryButton>
                  <SecondaryButton onClick={handleTest} disabled={!apiKey || isTesting}>
                    {isTesting ? '⏳ A testar...' : '🔍 Testar Conexão'}
                  </SecondaryButton>
                  {hasApiKey() && (
                    <DangerButton onClick={handleClear}>
                      🗑️ Remover
                    </DangerButton>
                  )}
                </ButtonGroup>
              </Section>

              <Section>
                <ApiTutorial />
              </Section>
            </Content>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default Settings;
