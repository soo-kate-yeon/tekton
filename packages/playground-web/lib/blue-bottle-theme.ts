export const BLUE_BOTTLE_THEME = {
  id: 'blue-bottle-v2',
  name: 'Blue Bottle v2 Design System',
  schemaVersion: '2.1',
  brandTone: 'professional',
  designDNA: {
    moodKeywords: ['clean', 'modern', 'minimalist', 'efficient', 'precise'],
    targetEmotion: '신뢰',
    visualAtmosphere: '세련된 카페',
  },
  tokens: {
    atomic: {
      color: {
        brand: {
          '500': {
            l: 0.6,
            c: 0.16,
            h: 260,
          },
        },
        neutral: {
          '50': {
            l: 0.98,
            c: 0.005,
            h: 150,
          },
          '100': {
            l: 0.95,
            c: 0.005,
            h: 150,
          },
          '200': {
            l: 0.89,
            c: 0.005,
            h: 150,
          },
          '300': {
            l: 0.75,
            c: 0.005,
            h: 150,
          },
          '500': {
            l: 0.5,
            c: 0.005,
            h: 150,
          },
          '900': {
            l: 0.2,
            c: 0.005,
            h: 150,
          },
        },
        white: {
          l: 1,
          c: 0,
          h: 0,
        },
      },
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      radius: {
        md: '8px',
        full: '9999px',
        none: '0',
        xs: '2px',
        sm: '4px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
    semantic: {
      background: {
        canvas: 'atomic.color.neutral.50',
        surface: {
          subtle: 'atomic.color.neutral.50',
          default: 'atomic.color.white',
          emphasis: 'atomic.color.neutral.900',
        },
      },
      border: {
        default: {
          subtle: 'atomic.color.neutral.100',
          default: 'atomic.color.neutral.200',
          emphasis: 'atomic.color.neutral.300',
        },
      },
      text: {
        primary: 'atomic.color.neutral.900',
        secondary: 'atomic.color.neutral.500',
        brand: 'atomic.color.brand.500',
      },
      icon: {
        default: 'atomic.color.neutral.900',
        secondary: 'atomic.color.neutral.500',
        brand: 'atomic.color.brand.500',
      },
      action: {
        primary: 'atomic.color.neutral.900',
        'primary-text': 'atomic.color.white',
        disabled: 'atomic.color.neutral.300',
        'disabled-text': 'atomic.color.neutral.500',
      },
    },
  },
  stateLayer: {
    hover: {
      opacity: 0.08,
    },
    disabled: {
      opacity: 0.38,
      contentOpacity: 0.38,
    },
  },
  elevation: {
    level: {
      '0': 'none',
      '1': '0 2px 8px rgba(0,0,0,0.04)',
      '2': '0 4px 16px rgba(0,0,0,0.08)',
      '3': '0 8px 32px rgba(0,0,0,0.12)',
    },
    context: {
      modal: 'elevation.level.2',
      popover: 'elevation.level.1',
    },
  },
  typography: {
    fontFamily: {
      sans: 'Inter, sans-serif',
      serif: 'Georgia, Times, serif',
      mono: 'JetBrains Mono, monospace',
      display: 'Inter Display, sans-serif',
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      bold: '700',
      thin: '100',
      light: '300',
      semibold: '600',
      extrabold: '800',
      black: '900',
    },
  },
  motion: {
    duration: {
      short: '150ms',
      medium: '300ms',
      long: '450ms',
      instant: '0ms',
      micro: '50ms',
      quick: '100ms',
      standard: '150ms',
      moderate: '200ms',
      deliberate: '300ms',
      slow: '400ms',
      complex: '500ms',
    },
    easing: {
      standard: 'cubic-bezier(0.2, 0, 0, 1)',
      decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
      accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
      linear: 'linear',
      emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
  border: {
    width: {
      thin: '1px',
      medium: '2px',
      none: '0',
      thick: '3px',
      heavy: '4px',
    },
    radius: {
      md: 'atomic.radius.md',
      full: 'atomic.radius.full',
      none: '0',
      xs: '2px',
      sm: '4px',
      lg: '8px',
      xl: '12px',
      '2xl': '16px',
      '3xl': '24px',
      circle: '50%',
    },
  },
  density: {
    mode: 'comfortable',
  },
} as const;
