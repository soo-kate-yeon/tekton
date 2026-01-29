/**
 * @tekton/styled - Runtime Validation
 * [SPEC-STYLED-001] [TAG-005]
 * Runtime validation for hardcoded values
 * REQ-STY-001, REQ-STY-002, REQ-STY-015, REQ-STY-016, REQ-STY-017
 */

/**
 * Runtime validation for hardcoded values
 * REQ-STY-017: Error messages provide context
 */
export function validateNoHardcodedValues(strings: TemplateStringsArray, values: any[]): void {
  // Reconstruct the full template string for analysis
  let fullTemplate = '';
  for (let i = 0; i < strings.length; i++) {
    fullTemplate += strings[i];
    if (i < values.length) {
      // Check if the value is a function (prop-based styling)
      if (typeof values[i] === 'function') {
        fullTemplate += '${...}';
      } else {
        fullTemplate += String(values[i]);
      }
    }
  }

  // REQ-STY-001, REQ-STY-015: Check for hardcoded colors
  const colorPatterns = [
    {
      regex: /#[0-9a-fA-F]{3,8}\b/g,
      type: 'hex color',
      example: 'tokens.bg.primary.default',
    },
    {
      regex: /rgb\s*\([^)]+\)/gi,
      type: 'rgb() color',
      example: 'tokens.bg.primary.default',
    },
    {
      regex: /rgba\s*\([^)]+\)/gi,
      type: 'rgba() color',
      example: 'tokens.bg.primary.default',
    },
    {
      regex: /hsl\s*\([^)]+\)/gi,
      type: 'hsl() color',
      example: 'tokens.fg.primary',
    },
    {
      regex: /hsla\s*\([^)]+\)/gi,
      type: 'hsla() color',
      example: 'tokens.fg.primary',
    },
  ];

  // Check for color violations
  for (const { regex, type, example } of colorPatterns) {
    const match = regex.exec(fullTemplate);
    if (match) {
      throw new Error(
        `[Tekton] Hardcoded value detected: ${type} "${match[0]}"\n` +
          `Use tokens instead. Example: ${example}\n` +
          `Template snippet: ${fullTemplate.substring(Math.max(0, match.index - 20), match.index + 40)}...`
      );
    }
  }

  // REQ-STY-002, REQ-STY-016: Check for hardcoded spacing
  const spacingPatterns = [
    {
      regex: /(?:padding|margin|gap|top|right|bottom|left|width|height)\s*:\s*\d+px/gi,
      type: 'pixel spacing',
      example: 'tokens.spacing[4]',
    },
  ];

  for (const { regex, type, example } of spacingPatterns) {
    const match = regex.exec(fullTemplate);
    if (match) {
      throw new Error(
        `[Tekton] Hardcoded value detected: ${type} "${match[0]}"\n` +
          `Use tokens instead. Example: ${example}\n` +
          `Template snippet: ${fullTemplate.substring(Math.max(0, match.index - 20), match.index + 40)}...`
      );
    }
  }
}
