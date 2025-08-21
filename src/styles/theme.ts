export interface ThemeColors {
  primary: string;
  primaryHover: string;
  success: string;
  error: string;
  warning: string;
  accent: string;
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  shadow: string;
  shadowLight: string;
  overlay: string;
}

export interface ThemeTypography {
  fontFamily: string;
  h1: {
    fontSize: string;
    lineHeight: string;
    fontWeight: number;
  };
  h2: {
    fontSize: string;
    lineHeight: string;
    fontWeight: number;
  };
  h3: {
    fontSize: string;
    lineHeight: string;
    fontWeight: number;
  };
  base: {
    fontSize: string;
    lineHeight: string;
  };
  small: {
    fontSize: string;
    lineHeight: string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
  section: string;
  element: string;
  mobilePadding: string;
}

export interface ThemeBorderRadius {
  small: string;
  medium: string;
  large: string;
  xlarge: string;
}

export interface ThemeBreakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
  wide: string;
}

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  breakpoints: ThemeBreakpoints;
  shadows: {
    sm: string;
    md: string;
    lg: string;
    elevated: string;
  };
}

const typography: ThemeTypography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  h1: {
    fontSize: '38px',
    lineHeight: '1.2',
    fontWeight: 600,
  },
  h2: {
    fontSize: '30px',
    lineHeight: '1.3',
    fontWeight: 600,
  },
  h3: {
    fontSize: '24px',
    lineHeight: '1.4',
    fontWeight: 500,
  },
  base: {
    fontSize: '14px',
    lineHeight: '1.5',
  },
  small: {
    fontSize: '12px',
    lineHeight: '1.5',
  },
};

const spacing: ThemeSpacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  section: '24px',
  element: '16px',
  mobilePadding: '8px',
};

const borderRadius: ThemeBorderRadius = {
  small: '8px',
  medium: '12px',
  large: '16px',
  xlarge: '24px',
};

const breakpoints: ThemeBreakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1400px',
};

export const lightTheme: Theme = {
  colors: {
    primary: '#1677ff',
    primaryHover: '#4096ff',
    success: '#52c41a',
    error: '#ff4d4f',
    warning: '#faad14',
    accent: '#13c2c2',
    background: '#ffffff',
    backgroundSecondary: '#fafafa',
    backgroundTertiary: '#f5f5f5',
    surface: '#ffffff',
    surfaceHover: '#f0f0f0',
    text: '#000000',
    textSecondary: '#595959',
    textTertiary: '#8c8c8c',
    border: '#d9d9d9',
    borderLight: '#f0f0f0',
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowLight: 'rgba(0, 0, 0, 0.04)',
    overlay: 'rgba(0, 0, 0, 0.45)',
  },
  typography,
  spacing,
  borderRadius,
  breakpoints,
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
    md: '0 2px 8px rgba(0, 0, 0, 0.04)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.08)',
    elevated: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#1677ff',
    primaryHover: '#4096ff',
    success: '#52c41a',
    error: '#ff4d4f',
    warning: '#faad14',
    accent: '#13c2c2',
    background: '#141414',
    backgroundSecondary: '#1f1f1f',
    backgroundTertiary: '#262626',
    surface: '#1f1f1f',
    surfaceHover: '#2a2a2a',
    text: '#ffffff',
    textSecondary: '#bfbfbf',
    textTertiary: '#8c8c8c',
    border: '#434343',
    borderLight: '#303030',
    shadow: 'rgba(0, 0, 0, 0.32)',
    shadowLight: 'rgba(0, 0, 0, 0.16)',
    overlay: 'rgba(0, 0, 0, 0.75)',
  },
  typography,
  spacing,
  borderRadius,
  breakpoints,
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.12)',
    md: '0 2px 8px rgba(0, 0, 0, 0.16)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.24)',
    elevated: '0 2px 8px rgba(0, 0, 0, 0.16)',
  },
};

// Re-export the Theme type explicitly
export type { Theme };