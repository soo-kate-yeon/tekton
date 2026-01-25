/**
 * Basic Usage Examples for Tekton
 * TASK-025: Example code writing
 */

import { TokenGenerator, generateComponentThemes, oklchToHex, hexToOklch } from '../src';

// Example 1: Generate design tokens from OKLCH colors
function example1_basicTokenGeneration() {
  const generator = new TokenGenerator();

  const tokens = generator.generateTokens({
    primary: { l: 0.5, c: 0.15, h: 220 }, // Blue
    secondary: { l: 0.6, c: 0.12, h: 180 }, // Cyan
    accent: { l: 0.55, c: 0.14, h: 340 }, // Pink
  });

  console.log('Generated tokens:', tokens.length);
  tokens.forEach(token => {
    console.log(`${token.name}: ${oklchToHex(token.value)}`);
  });
}

// Example 2: Export tokens to CSS
function example2_exportToCSS() {
  const generator = new TokenGenerator();

  const css = generator.exportTokens(
    {
      primary: { l: 0.5, c: 0.15, h: 220 },
      secondary: { l: 0.6, c: 0.12, h: 180 },
    },
    'css'
  );

  console.log('CSS Output:');
  console.log(css);
}

// Example 3: Generate component themes
function example3_componentThemes() {
  const baseColor = { l: 0.5, c: 0.15, h: 220 };
  const themes = generateComponentThemes(baseColor);

  console.log('Component themes:', themes.length);
  themes.forEach(theme => {
    console.log(`${theme.name}:`, Object.keys(theme.states));
  });
}

// Example 4: Dark mode generation
function example4_darkMode() {
  const generator = new TokenGenerator({ generateDarkMode: true });

  const tokens = generator.generateTokens({
    primary: { l: 0.5, c: 0.15, h: 220 },
  });

  console.log('Generated tokens with dark mode:', tokens.length);
  tokens.forEach(token => {
    console.log(`${token.name}: L=${token.value.l.toFixed(2)}`);
  });
}

// Example 5: Convert hex to OKLCH and back
function example5_hexConversion() {
  const hex = '#3B82F6'; // Tailwind blue-500

  const oklch = hexToOklch(hex);
  console.log('OKLCH:', oklch);

  const hexBack = oklchToHex(oklch);
  console.log('Hex back:', hexBack);
}

// Example 6: Export to multiple formats
function example6_multipleFormats() {
  const generator = new TokenGenerator();
  const palette = { primary: { l: 0.5, c: 0.15, h: 220 } };

  const css = generator.exportTokens(palette, 'css');
  const json = generator.exportTokens(palette, 'json');
  const js = generator.exportTokens(palette, 'js');

  console.log('CSS length:', css.length);
  console.log('JSON length:', json.length);
  console.log('JS length:', js.length);
}

// Run examples
if (require.main === module) {
  console.log('\n=== Example 1: Basic Token Generation ===');
  example1_basicTokenGeneration();

  console.log('\n=== Example 2: Export to CSS ===');
  example2_exportToCSS();

  console.log('\n=== Example 3: Component Themes ===');
  example3_componentThemes();

  console.log('\n=== Example 4: Dark Mode ===');
  example4_darkMode();

  console.log('\n=== Example 5: Hex Conversion ===');
  example5_hexConversion();

  console.log('\n=== Example 6: Multiple Formats ===');
  example6_multipleFormats();
}
