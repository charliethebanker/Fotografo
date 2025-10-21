// Tema inspirado no design da Apple
export const theme = {
  colors: {
    // Cores principais
    background: '#FFFFFF',
    surface: '#F5F5F7',
    text: {
      primary: '#1d1d1f',
      secondary: '#6e6e73',
      tertiary: '#86868b',
    },
    accent: '#0071e3',
    accentHover: '#0077ed',

    // Estados
    success: '#34c759',
    error: '#ff3b30',
    warning: '#ff9500',

    // Glassmorphism
    glass: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.18)',
  },

  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    xxl: '64px',
    xxxl: '80px',
    section: '120px', // Espaçamento generoso entre seções
  },

  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '17px',
      lg: '21px',
      xl: '28px',
      xxl: '40px',
      xxxl: '56px',
      hero: '80px', // Títulos hero grandes
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.1,
      normal: 1.47,
      relaxed: 1.6,
    },
  },

  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '18px',
    xl: '24px',
    full: '9999px',
  },

  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
    md: '0 4px 16px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.16)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.20)',
  },

  transitions: {
    fast: '150ms ease',
    normal: '300ms ease',
    slow: '500ms ease',
  },

  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
};
