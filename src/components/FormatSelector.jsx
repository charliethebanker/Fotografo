import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  max-width: 1100px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  padding: 0 ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FormatButton = styled(motion.button)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, $isLoading }) =>
    $isLoading ? theme.colors.text.tertiary : theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(10px);
  border: 2px solid ${({ theme }) => theme.colors.glassBorder};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover:not(:disabled) {
    background: white;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    width: 32px;
    height: 32px;
  }
`;

const FormatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const FormatDimensions = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NewBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, #34c759 0%, #30d158 100%);
  color: white;
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="url(#instagram-gradient)">
    <defs>
      <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#833ab4' }} />
        <stop offset="50%" style={{ stopColor: '#fd1d1d' }} />
        <stop offset="100%" style={{ stopColor: '#fcb045' }} />
      </linearGradient>
    </defs>
    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
  </svg>
);

const StoriesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="stories-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#833ab4' }} />
        <stop offset="50%" style={{ stopColor: '#fd1d1d' }} />
        <stop offset="100%" style={{ stopColor: '#fcb045' }} />
      </linearGradient>
    </defs>
    <rect x="7" y="2" width="10" height="20" rx="2" stroke="url(#stories-gradient)" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="3" fill="url(#stories-gradient)" />
  </svg>
);

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid ${({ theme }) => theme.colors.text.tertiary};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const FormatSelector = ({ onFormatSelect, isLoading }) => {
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Title>Otimizar para Redes Sociais</Title>
      <ButtonGroup>
        {/* Instagram Portrait 3:4 - NOVO */}
        <FormatButton
          onClick={() => onFormatSelect('instagram-3-4')}
          disabled={isLoading}
          $isLoading={isLoading}
          whileTap={{ scale: 0.95 }}
        >
          <NewBadge>NOVO</NewBadge>
          {isLoading ? <LoadingSpinner /> : <InstagramIcon />}
          <FormatLabel>Instagram Portrait</FormatLabel>
          <FormatDimensions>3:4 (1080×1440)</FormatDimensions>
        </FormatButton>

        {/* Instagram Portrait 4:5 - Popular */}
        <FormatButton
          onClick={() => onFormatSelect('instagram-4-5')}
          disabled={isLoading}
          $isLoading={isLoading}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? <LoadingSpinner /> : <InstagramIcon />}
          <FormatLabel>Instagram Portrait</FormatLabel>
          <FormatDimensions>4:5 (1080×1350)</FormatDimensions>
        </FormatButton>

        {/* Instagram Square */}
        <FormatButton
          onClick={() => onFormatSelect('instagram-square')}
          disabled={isLoading}
          $isLoading={isLoading}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? <LoadingSpinner /> : <InstagramIcon />}
          <FormatLabel>Instagram Square</FormatLabel>
          <FormatDimensions>1:1 (1080×1080)</FormatDimensions>
        </FormatButton>

        {/* Instagram Landscape */}
        <FormatButton
          onClick={() => onFormatSelect('instagram-landscape')}
          disabled={isLoading}
          $isLoading={isLoading}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? <LoadingSpinner /> : <InstagramIcon />}
          <FormatLabel>Instagram Landscape</FormatLabel>
          <FormatDimensions>1.91:1 (1080×566)</FormatDimensions>
        </FormatButton>

        {/* Stories/Reels */}
        <FormatButton
          onClick={() => onFormatSelect('stories')}
          disabled={isLoading}
          $isLoading={isLoading}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? <LoadingSpinner /> : <StoriesIcon />}
          <FormatLabel>Stories/Reels</FormatLabel>
          <FormatDimensions>9:16 (1080×1920)</FormatDimensions>
        </FormatButton>
      </ButtonGroup>
    </Container>
  );
};

export default FormatSelector;
