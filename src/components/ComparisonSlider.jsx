import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto ${({ theme }) => theme.spacing.xxl};
  padding: 0 ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  cursor: ew-resize;
  user-select: none;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const ImageAfter = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

const ImageBeforeWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ $position }) => $position}%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
  transition: ${({ $isDragging }) => ($isDragging ? 'none' : 'width 0.1s ease')};
`;

const ImageBefore = styled.img`
  display: block;
  width: ${({ $containerWidth }) => $containerWidth}px;
  height: auto;
  max-width: none;
`;

const Handle = styled.div`
  position: absolute;
  top: 0;
  left: ${({ $position }) => $position}%;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.accent} 0%, #0077ed 100%);
  z-index: 3;
  transform: translateX(-50%);
  cursor: ew-resize;
  box-shadow: 0 0 20px rgba(0, 113, 227, 0.5);

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
  }

  &::before {
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

const HandleButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background-color: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  cursor: ew-resize;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }

  svg {
    width: 24px;
    height: 24px;
    stroke: white;
    stroke-width: 2;
  }
`;

const Label = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  z-index: 4;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  ${({ $position }) => ($position === 'left' ? 'left' : 'right')}: ${({ theme }) =>
    theme.spacing.md};
`;

const ComparisonSlider = ({ originalImage, editedImage }) => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (sliderRef.current) {
      setContainerWidth(sliderRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (sliderRef.current) {
        setContainerWidth(sliderRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updatePosition = (clientX) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width));
    const percentage = (offsetX / rect.width) * 100;
    setPosition(percentage);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      updatePosition(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging]);

  return (
    <Container
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SliderWrapper ref={sliderRef}>
        {/* Imagem editada (background) */}
        <ImageAfter src={editedImage} alt="Imagem editada" />

        {/* Imagem original (foreground com clip) */}
        <ImageBeforeWrapper $position={position} $isDragging={isDragging}>
          <ImageBefore
            src={originalImage}
            alt="Imagem original"
            $containerWidth={containerWidth}
          />
        </ImageBeforeWrapper>

        {/* Handle arrastável */}
        <Handle $position={position} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
          <HandleButton>
            <svg fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19l7-7-7-7" />
            </svg>
          </HandleButton>
        </Handle>

        {/* Labels */}
        <Label $position="left">Original</Label>
        <Label $position="right">Editada</Label>
      </SliderWrapper>
    </Container>
  );
};

export default ComparisonSlider;
