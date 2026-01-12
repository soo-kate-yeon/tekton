/**
 * Token generation wrapper
 * Simplified integration with @tekton/token-generator for M2
 * Full integration will be completed in future iterations
 */

export interface TokenGenerationOptions {
  primaryColor: string;
  preset: string;
}

export interface TokenGenerationResult {
  cssVariables: string;
  tailwindConfig: string;
  warnings?: string[];
}

/**
 * Generate design tokens (simplified wrapper for M2)
 * @param options - Generation options
 * @returns Token generation result
 */
export async function generateTokensWrapper(
  options: TokenGenerationOptions
): Promise<TokenGenerationResult> {
  const { primaryColor, preset } = options;

  // Generate CSS variables
  const cssVariables = generateCSSVariables(primaryColor, preset);

  // Generate Tailwind config
  const tailwindConfig = generateTailwindConfig(primaryColor, preset);

  return {
    cssVariables,
    tailwindConfig,
    warnings: [],
  };
}

/**
 * Generate CSS variables
 */
function generateCSSVariables(primaryColor: string, preset: string): string {
  return `:root {
  /* Primary Colors */
  --primary: ${primaryColor};
  --primary-foreground: #ffffff;

  /* Background */
  --background: #ffffff;
  --foreground: #000000;

  /* Card */
  --card: #ffffff;
  --card-foreground: #000000;

  /* Popover */
  --popover: #ffffff;
  --popover-foreground: #000000;

  /* Secondary */
  --secondary: #f1f5f9;
  --secondary-foreground: #0f172a;

  /* Muted */
  --muted: #f1f5f9;
  --muted-foreground: #64748b;

  /* Accent */
  --accent: #f1f5f9;
  --accent-foreground: #0f172a;

  /* Destructive */
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;

  /* Border */
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: ${primaryColor};

  /* Radius */
  --radius: 0.5rem;
}

/* Preset: ${preset} */
`;
}

/**
 * Generate Tailwind config
 */
function generateTailwindConfig(primaryColor: string, preset: string): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "${primaryColor}",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

// Generated with preset: ${preset}
`;
}
