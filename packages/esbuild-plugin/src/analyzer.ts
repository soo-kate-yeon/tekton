/**
 * @tekton/esbuild-plugin - Code Analyzer
 * [SPEC-STYLED-001] [TAG-007]
 * AST analysis for hardcoded value detection
 */

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export interface Violation {
  file: string;
  line: number;
  column: number;
  type: 'color' | 'spacing' | 'radius' | 'other';
  value: string;
  suggestion?: string;
}

/**
 * Analyze code for hardcoded CSS values
 * REQ-STY-007: Scan all .tsx/.ts files for hardcoded style values
 */
export function analyzeCode(code: string, filename: string): Violation[] {
  const violations: Violation[] = [];

  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    traverse(ast, {
      TaggedTemplateExpression(path) {
        // Check if this is a styled-components template
        const tag = path.node.tag;
        let isStyledCall = false;

        // Check for styled.div`...` or styled(Component)`...`
        if (tag.type === 'MemberExpression' && tag.object.type === 'Identifier') {
          isStyledCall = tag.object.name === 'styled';
        } else if (tag.type === 'CallExpression') {
          const callee = tag.callee;
          if (callee.type === 'Identifier' && callee.name === 'styled') {
            isStyledCall = true;
          } else if (callee.type === 'MemberExpression' && callee.object.type === 'Identifier') {
            isStyledCall = callee.object.name === 'styled';
          }
        } else if (tag.type === 'Identifier' && (tag.name === 'css' || tag.name === 'styled')) {
          isStyledCall = true;
        }

        if (isStyledCall) {
          const quasis = path.node.quasi.quasis;

          for (const quasi of quasis) {
            const value = quasi.value.raw;
            const lineStart = quasi.loc?.start.line || 0;
            const columnStart = quasi.loc?.start.column || 0;

            // Find violations in this template string
            const colorViolations = findColorViolations(value, filename, lineStart, columnStart);
            const spacingViolations = findSpacingViolations(
              value,
              filename,
              lineStart,
              columnStart
            );

            violations.push(...colorViolations, ...spacingViolations);
          }
        }
      },
    });
  } catch (error) {
    console.warn(`[Tekton] Failed to parse ${filename}:`, (error as Error).message);
  }

  return violations;
}

/**
 * Find hardcoded color values
 * REQ-STY-015: Reject hex colors, rgb(), rgba(), hsl(), hsla()
 */
function findColorViolations(
  css: string,
  file: string,
  baseLine: number,
  baseColumn: number
): Violation[] {
  const violations: Violation[] = [];
  const patterns = [
    {
      regex: /#[0-9a-fA-F]{3,8}\b/g,
      type: 'color' as const,
      suggestion: 'tokens.bg.* or tokens.fg.*',
    },
    {
      regex: /\brgb\s*\([^)]+\)/gi,
      type: 'color' as const,
      suggestion: 'tokens.bg.* or tokens.fg.*',
    },
    {
      regex: /\brgba\s*\([^)]+\)/gi,
      type: 'color' as const,
      suggestion: 'tokens.bg.* or tokens.fg.*',
    },
    {
      regex: /\bhsl\s*\([^)]+\)/gi,
      type: 'color' as const,
      suggestion: 'tokens.bg.* or tokens.fg.*',
    },
    {
      regex: /\bhsla\s*\([^)]+\)/gi,
      type: 'color' as const,
      suggestion: 'tokens.bg.* or tokens.fg.*',
    },
  ];

  for (const { regex, type, suggestion } of patterns) {
    let match;
    while ((match = regex.exec(css)) !== null) {
      violations.push({
        file,
        line: baseLine,
        column: baseColumn + match.index,
        type,
        value: match[0],
        suggestion,
      });
    }
  }

  return violations;
}

/**
 * Find hardcoded spacing values
 * REQ-STY-016: Reject pixel values for spacing properties
 */
function findSpacingViolations(
  css: string,
  file: string,
  baseLine: number,
  baseColumn: number
): Violation[] {
  const violations: Violation[] = [];
  const spacingProps = [
    'padding',
    'margin',
    'gap',
    'width',
    'height',
    'top',
    'right',
    'bottom',
    'left',
  ];

  for (const prop of spacingProps) {
    const regex = new RegExp(`${prop}\\s*:\\s*(\\d+)px`, 'gi');
    let match;
    while ((match = regex.exec(css)) !== null) {
      const pxValue = parseInt(match[1], 10);
      violations.push({
        file,
        line: baseLine,
        column: baseColumn + match.index,
        type: 'spacing',
        value: `${pxValue}px`,
        suggestion: suggestSpacingToken(pxValue),
      });
    }
  }

  return violations;
}

/**
 * Suggest appropriate spacing token
 * REQ-STY-019: Provide auto-fix suggestions
 */
function suggestSpacingToken(px: number): string {
  const scale: Record<number, string> = {
    0: 'tokens.spacing[0]',
    4: 'tokens.spacing[1]',
    8: 'tokens.spacing[2]',
    12: 'tokens.spacing[3]',
    16: 'tokens.spacing[4]',
    20: 'tokens.spacing[5]',
    24: 'tokens.spacing[6]',
    32: 'tokens.spacing[8]',
    40: 'tokens.spacing[10]',
    48: 'tokens.spacing[12]',
    64: 'tokens.spacing[16]',
    80: 'tokens.spacing[20]',
    96: 'tokens.spacing[24]',
  };

  return scale[px] || `tokens.spacing[?] (${px}px not in scale)`;
}
