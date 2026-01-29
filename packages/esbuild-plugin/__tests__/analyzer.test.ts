/**
 * @tekton/esbuild-plugin - Analyzer Tests
 * [SPEC-STYLED-001] Tests for TAG-007: AST Analysis Logic
 * REQ-STY-007: Scan all .tsx/.ts files for hardcoded style values
 */

import { describe, it, expect } from 'vitest';
import { analyzeCode } from '../src/analyzer.js';

// ============================================================================
// Styled-Components Pattern Detection
// ============================================================================

describe('Analyzer - styled.div Pattern Detection', () => {
  it('should detect styled.div templates', () => {
    const code = `
      const Card = styled.div\`
        background: #ffffff;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations.length).toBeGreaterThan(0);
  });

  it('should detect styled.button templates', () => {
    const code = `
      const Button = styled.button\`
        color: rgb(255, 0, 0);
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations.length).toBeGreaterThan(0);
  });

  it('should detect styled(Component) patterns', () => {
    const code = `
      const StyledComponent = styled(BaseComponent)\`
        padding: 16px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations.length).toBeGreaterThan(0);
  });

  it('should detect css`` templates', () => {
    const code = `
      const styles = css\`
        background: #fff;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations.length).toBeGreaterThan(0);
  });

  it('should ignore non-styled templates', () => {
    const code = `
      const template = someOtherFunction\`
        background: #ffffff;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(0);
  });
});

// ============================================================================
// REQ-STY-015: Color Violation Detection
// ============================================================================

describe('Analyzer - Hex Color Detection', () => {
  it('should detect 6-digit hex colors', () => {
    const code = `
      const Card = styled.div\`
        background: #ffffff;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
    expect(violations[0].type).toBe('color');
    expect(violations[0].value).toBe('#ffffff');
  });

  it('should detect 3-digit hex colors', () => {
    const code = `
      const Card = styled.div\`
        color: #fff;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
    expect(violations[0].value).toBe('#fff');
  });

  it('should detect 8-digit hex colors with alpha', () => {
    const code = `
      const Card = styled.div\`
        background: #ffffff80;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
    expect(violations[0].value).toBe('#ffffff80');
  });

  it('should detect uppercase hex colors', () => {
    const code = `
      const Card = styled.div\`
        color: #FFFFFF;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
    expect(violations[0].value).toBe('#FFFFFF');
  });

  it('should detect mixed case hex colors', () => {
    const code = `
      const Card = styled.div\`
        color: #FfFfFf;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
  });
});

describe('Analyzer - RGB/RGBA Color Detection', () => {
  it('should detect rgb() colors', () => {
    const code = `
      const Card = styled.div\`
        background: rgb(255, 255, 255);
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
    expect(violations[0].type).toBe('color');
    expect(violations[0].value).toContain('rgb');
  });

  it('should detect rgba() colors', () => {
    const code = `
      const Card = styled.div\`
        background: rgba(255, 255, 255, 0.5);
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
    expect(violations[0].value).toContain('rgba');
  });

  it('should detect rgb with spaces', () => {
    const code = `
      const Card = styled.div\`
        color: rgb( 255 , 255 , 255 );
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
  });
});

describe('Analyzer - HSL/HSLA Color Detection', () => {
  it('should detect hsl() colors', () => {
    const code = `
      const Card = styled.div\`
        background: hsl(0, 100%, 50%);
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
    expect(violations[0].type).toBe('color');
    expect(violations[0].value).toContain('hsl');
  });

  it('should detect hsla() colors', () => {
    const code = `
      const Card = styled.div\`
        background: hsla(0, 100%, 50%, 0.5);
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
    expect(violations[0].value).toContain('hsla');
  });
});

// ============================================================================
// REQ-STY-016: Spacing Violation Detection
// ============================================================================

describe('Analyzer - Padding Spacing Detection', () => {
  it('should detect padding in pixels', () => {
    const code = `
      const Card = styled.div\`
        padding: 16px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
    expect(violations[0].type).toBe('spacing');
    expect(violations[0].value).toBe('16px');
  });

  it('should detect padding-top', () => {
    const code = `
      const Card = styled.div\`
        padding-top: 8px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
  });

  it('should detect multiple spacing values', () => {
    const code = `
      const Card = styled.div\`
        padding: 16px;
        margin: 8px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(2);
  });
});

describe('Analyzer - Margin Spacing Detection', () => {
  it('should detect margin in pixels', () => {
    const code = `
      const Card = styled.div\`
        margin: 24px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
    expect(violations[0].type).toBe('spacing');
  });

  it('should detect margin-bottom', () => {
    const code = `
      const Card = styled.div\`
        margin-bottom: 12px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
  });
});

describe('Analyzer - Other Spacing Properties', () => {
  it('should detect gap property', () => {
    const code = `
      const Container = styled.div\`
        gap: 16px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
  });

  it('should detect width in pixels', () => {
    const code = `
      const Box = styled.div\`
        width: 200px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
  });

  it('should detect height in pixels', () => {
    const code = `
      const Box = styled.div\`
        height: 100px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
  });

  it('should detect positioning properties', () => {
    const code = `
      const Box = styled.div\`
        top: 10px;
        right: 20px;
        bottom: 30px;
        left: 40px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(4);
  });
});

// ============================================================================
// REQ-STY-019: Suggestion Generation
// ============================================================================

describe('Analyzer - Suggestion Generation', () => {
  it('should provide suggestions for color violations', () => {
    const code = `
      const Card = styled.div\`
        background: #ffffff;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations[0].suggestion).toBeDefined();
    expect(violations[0].suggestion).toContain('tokens');
  });

  it('should provide spacing token suggestions', () => {
    const code = `
      const Card = styled.div\`
        padding: 16px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations[0].suggestion).toBeDefined();
    expect(violations[0].suggestion).toContain('tokens.spacing[4]');
  });

  it('should suggest appropriate spacing tokens for common values', () => {
    const testCases = [
      { px: 4, expected: 'tokens.spacing[1]' },
      { px: 8, expected: 'tokens.spacing[2]' },
      { px: 16, expected: 'tokens.spacing[4]' },
      { px: 24, expected: 'tokens.spacing[6]' },
      { px: 32, expected: 'tokens.spacing[8]' },
    ];

    testCases.forEach(({ px, expected }) => {
      const code = `
        const Card = styled.div\`
          padding: ${px}px;
        \`;
      `;
      const violations = analyzeCode(code, 'test.tsx');
      expect(violations[0].suggestion).toContain(expected);
    });
  });

  it('should handle non-standard spacing values', () => {
    const code = `
      const Card = styled.div\`
        padding: 13px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations[0].suggestion).toContain('not in scale');
  });
});

// ============================================================================
// Mixed Violations
// ============================================================================

describe('Analyzer - Mixed Violations', () => {
  it('should detect multiple color violations', () => {
    const code = `
      const Card = styled.div\`
        background: #ffffff;
        color: rgb(0, 0, 0);
        border-color: hsl(0, 0%, 50%);
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(3);
    expect(violations.every(v => v.type === 'color')).toBe(true);
  });

  it('should detect mixed color and spacing violations', () => {
    const code = `
      const Card = styled.div\`
        background: #ffffff;
        padding: 16px;
        color: rgb(0, 0, 0);
        margin: 8px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(4);
    const colorViolations = violations.filter(v => v.type === 'color');
    const spacingViolations = violations.filter(v => v.type === 'spacing');
    expect(colorViolations).toHaveLength(2);
    expect(spacingViolations).toHaveLength(2);
  });
});

// ============================================================================
// REQ-STY-013: Allow Non-Token Properties
// ============================================================================

describe('Analyzer - Allow Non-Token Properties', () => {
  it('should allow display property', () => {
    const code = `
      const Container = styled.div\`
        display: flex;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(0);
  });

  it('should allow position property', () => {
    const code = `
      const Box = styled.div\`
        position: absolute;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(0);
  });

  it('should allow flex properties', () => {
    const code = `
      const Container = styled.div\`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(0);
  });

  it('should allow grid properties', () => {
    const code = `
      const Grid = styled.div\`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(0);
  });

  it('should allow cursor property', () => {
    const code = `
      const Button = styled.button\`
        cursor: pointer;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(0);
  });
});

// ============================================================================
// REQ-STY-008: File Location Reporting
// ============================================================================

describe('Analyzer - Violation Metadata', () => {
  it('should include filename in violations', () => {
    const code = `
      const Card = styled.div\`
        background: #ffffff;
      \`;
    `;
    const violations = analyzeCode(code, 'src/components/Card.tsx');
    expect(violations[0].file).toBe('src/components/Card.tsx');
  });

  it('should include line numbers', () => {
    const code = `
      const Card = styled.div\`
        background: #ffffff;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations[0].line).toBeGreaterThan(0);
  });

  it('should include column numbers', () => {
    const code = `
      const Card = styled.div\`
        background: #ffffff;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations[0].column).toBeGreaterThanOrEqual(0);
  });

  it('should include violation type', () => {
    const code = `
      const Card = styled.div\`
        background: #ffffff;
        padding: 16px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations[0].type).toMatch(/color|spacing/);
    expect(violations[1].type).toMatch(/color|spacing/);
  });
});

// ============================================================================
// Edge Cases and Error Handling
// ============================================================================

describe('Analyzer - Edge Cases', () => {
  it('should handle empty code', () => {
    const code = '';
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(0);
  });

  it('should handle invalid syntax gracefully', () => {
    const code = `
      const Card = styled.div\`
        background: #ffffff
      \`; // Missing semicolon
    `;
    // Should not throw, just return empty or partial results
    expect(() => analyzeCode(code, 'test.tsx')).not.toThrow();
  });

  it('should handle nested template literals', () => {
    const code = `
      const Card = styled.div\`
        background: \${props => props.primary ? '#ffffff' : '#000000'};
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    // Note: AST analysis doesn't detect hardcoded values inside function bodies
    // This is expected - runtime validation and build-time type checking handle this
    expect(violations).toHaveLength(0);
  });

  it('should handle multiple styled components in one file', () => {
    const code = `
      const Card = styled.div\`
        background: #ffffff;
      \`;

      const Button = styled.button\`
        padding: 16px;
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(2);
  });

  it('should handle comments in styled templates', () => {
    const code = `
      const Card = styled.div\`
        /* This is a comment */
        background: #ffffff; // Hardcoded color
      \`;
    `;
    const violations = analyzeCode(code, 'test.tsx');
    expect(violations).toHaveLength(1);
  });
});
