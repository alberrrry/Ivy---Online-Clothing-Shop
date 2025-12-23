export const theme = {
  colors: {
    background: '#FAF9F6',
    surface: '#FFFFFF',
    beige: '#E8E4D9',
    primary: '#1A1A1A',
    secondary: '#A8A8A8',
    
    text: {
      primary: '#1A1A1A',
      secondary: '#6B6B6B',
      tertiary: '#A8A8A8',
      inverse: '#FFFFFF',
    },
    
    success: '#2D5F3F',
    error: '#8B3A3A',
    warning: '#8B7355',
    
    border: '#E8E4D9',
    divider: '#F0EDE5',
    shadow: 'rgba(26, 26, 26, 0.1)',
    
    hover: 'rgba(26, 26, 26, 0.05)',
    pressed: 'rgba(26, 26, 26, 0.1)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },
  
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
      xxxl: 40,
    },
    
    weights: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#1A1A1A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#1A1A1A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
  },
};

export default theme;