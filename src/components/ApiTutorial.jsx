import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const TutorialContainer = styled(motion.div)`
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const TutorialHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  user-select: none;
`;

const TutorialTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ToggleIcon = styled(motion.span)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.accent};
`;

const TutorialContent = styled(motion.div)`
  overflow: hidden;
`;

const Step = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.md};
  border-left: 3px solid ${({ theme }) => theme.colors.accent};

  &:last-child {
    margin-bottom: 0;
  }
`;

const StepNumber = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

const StepText = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

const StepLink = styled.a`
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.accentHover};
    text-decoration: underline;
  }
`;

const InfoBox = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const InfoTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.accent};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: ${({ theme }) => theme.spacing.xs} 0;

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
`;

const WarningBox = styled(InfoBox)`
  background: rgba(245, 158, 11, 0.1);
  border-left-color: #f59e0b;
`;

const WarningTitle = styled(InfoTitle)`
  color: #f59e0b;
`;

const ApiTutorial = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TutorialContainer
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TutorialHeader onClick={() => setIsOpen(!isOpen)}>
        <TutorialTitle>
          📚 Como obter sua API Key do Google AI Studio
        </TutorialTitle>
        <ToggleIcon
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </ToggleIcon>
      </TutorialHeader>

      <AnimatePresence>
        {isOpen && (
          <TutorialContent
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Step>
              <StepNumber>1</StepNumber>
              <StepText>
                Aceda ao{' '}
                <StepLink href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">
                  Google AI Studio
                </StepLink>
              </StepText>
            </Step>

            <Step>
              <StepNumber>2</StepNumber>
              <StepText>
                Faça login com sua conta Google
              </StepText>
            </Step>

            <Step>
              <StepNumber>3</StepNumber>
              <StepText>
                No menu lateral esquerdo, clique em <strong>"Get API key"</strong>
              </StepText>
            </Step>

            <Step>
              <StepNumber>4</StepNumber>
              <StepText>
                Clique em <strong>"Create API key"</strong>
              </StepText>
            </Step>

            <Step>
              <StepNumber>5</StepNumber>
              <StepText>
                Escolha um projeto existente ou clique em <strong>"Create API key in new project"</strong>
              </StepText>
            </Step>

            <Step>
              <StepNumber>6</StepNumber>
              <StepText>
                A sua API key será gerada. Clique em <strong>"Copy"</strong> para copiar
              </StepText>
            </Step>

            <Step>
              <StepNumber>7</StepNumber>
              <StepText>
                Cole a API key no campo acima e clique em <strong>"Guardar"</strong>
              </StepText>
            </Step>

            <Step>
              <StepNumber>8</StepNumber>
              <StepText>
                Clique em <strong>"Testar Conexão"</strong> para verificar se está tudo correto
              </StepText>
            </Step>

            <InfoBox>
              <InfoTitle>📊 Quota Gratuita do Google AI Studio</InfoTitle>
              <InfoText>
                <strong>Gemini 1.5 Flash (Recomendado):</strong><br />
                • 15 requests por minuto<br />
                • 1.500 requests por dia<br />
                • Totalmente gratuito
              </InfoText>
              <InfoText>
                <strong>Gemini 1.5 Pro:</strong><br />
                • 2 requests por minuto<br />
                • 50 requests por dia<br />
                • Gratuito com limites
              </InfoText>
            </InfoBox>

            <WarningBox>
              <WarningTitle>⚠️ Importante - Segurança</WarningTitle>
              <InfoText>
                • <strong>Mantenha sua API key em segredo</strong> - não compartilhe com ninguém<br />
                • A key fica armazenada apenas no seu navegador (localStorage)<br />
                • Não a publique em sites públicos ou repositórios Git<br />
                • Pode revogá-la a qualquer momento no Google AI Studio<br />
                • Se suspeitar que foi comprometida, revogue e crie uma nova
              </InfoText>
            </WarningBox>
          </TutorialContent>
        )}
      </AnimatePresence>
    </TutorialContainer>
  );
};

export default ApiTutorial;
