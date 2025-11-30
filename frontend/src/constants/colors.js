/**
 * Raskala Color Palette
 * Brand colors from Figma design system
 */

export const COLORS = {
    // Primary Brand Colors
    primary: {
      yellow: '#FFEA00',    // Main yellow for buttons, highlights
      pink: '#FF66CC',      // Primary CTA, accents
      lime: '#BBFF00',      // Secondary accent
      orange: '#FF7700', // Tertiary accent
        blue: '#00D4FF',  
    },
  
    // Neutral Colors
    neutral: {
      black: '#000000',     // Text, borders
      white: '#FFFFFF',     // Backgrounds, text on dark
      gray: '#ECEBEB',      // Subtle backgrounds, dividers
    },
  
    // Semantic Colors (optional, for consistency)
    background: {
      main: '#FFFFFF',
      secondary: '#ECEBEB',
      accent: '#FFEA00',
    },
  
    text: {
      primary: '#000000',
      secondary: '#666666',
      onDark: '#FFFFFF',
    },
  
    button: {
      primary: '#FFEA00',
      secondary: '#FF66CC',
      accent: '#BBFF00',
    },
  };
  
  // Export individual colors for convenience
  export const PRIMARY_YELLOW = COLORS.primary.yellow;
  export const PRIMARY_PINK = COLORS.primary.pink;
  export const PRIMARY_LIME = COLORS.primary.lime;
  export const PRIMARY_ORANGE = COLORS.primary.orange;
  
  export const BLACK = COLORS.neutral.black;
  export const WHITE = COLORS.neutral.white;
  export const GRAY = COLORS.neutral.gray;
  
  export default COLORS;