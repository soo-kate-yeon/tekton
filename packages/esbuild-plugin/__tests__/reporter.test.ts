/**
 * @tekton/esbuild-plugin - Reporter Tests
 * [SPEC-STYLED-001] Tests for TAG-008: Build Reporting System
 * REQ-STY-008: Report file location, line number, and violation type
 * REQ-STY-009: Fail build when compliance < 100%
 */

import { describe, it, expect } from 'vitest';
import { generateReport, calculateCompliance } from '../src/reporter.js';
import type { Violation } from '../src/analyzer.js';

// ============================================================================
// Report Generation
// ============================================================================

describe('Reporter - Generate Report', () => {
  it('should generate report for single violation', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 15,
        type: 'color',
        value: '#ffffff',
        suggestion: 'tokens.bg.*',
      },
    ];

    const report = generateReport(violations);
    expect(report).toContain('src/Card.tsx');
    expect(report).toContain('Line 10');
    expect(report).toContain('color violation');
    expect(report).toContain('#ffffff');
  });

  it('should generate report for multiple violations', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 15,
        type: 'color',
        value: '#ffffff',
        suggestion: 'tokens.bg.*',
      },
      {
        file: 'src/Button.tsx',
        line: 20,
        column: 10,
        type: 'spacing',
        value: '16px',
        suggestion: 'tokens.spacing[4]',
      },
    ];

    const report = generateReport(violations);
    expect(report).toContain('src/Card.tsx');
    expect(report).toContain('src/Button.tsx');
    expect(report).toContain('Total: 2 violation(s)');
  });

  it('should generate success message for zero violations', () => {
    const violations: Violation[] = [];
    const report = generateReport(violations);
    expect(report).toContain('✅');
    expect(report).toContain('100%');
    expect(report).toContain('No violations found');
  });

  it('should group violations by file', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: '#ffffff',
      },
      {
        file: 'src/Card.tsx',
        line: 15,
        column: 0,
        type: 'spacing',
        value: '16px',
      },
      {
        file: 'src/Button.tsx',
        line: 20,
        column: 0,
        type: 'color',
        value: 'rgb(255, 0, 0)',
      },
    ];

    const report = generateReport(violations);

    // Should have file headers
    expect(report).toContain('📄 src/Card.tsx');
    expect(report).toContain('📄 src/Button.tsx');

    // Card.tsx should have 2 violations listed together
    const cardSection = report.split('📄 src/Button.tsx')[0];
    expect(cardSection).toContain('Line 10');
    expect(cardSection).toContain('Line 15');
  });
});

// ============================================================================
// REQ-STY-019: Suggestion Display
// ============================================================================

describe('Reporter - Suggestion Display', () => {
  it('should display suggestions when provided', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 0,
        type: 'spacing',
        value: '16px',
        suggestion: 'tokens.spacing[4]',
      },
    ];

    const report = generateReport(violations);
    expect(report).toContain('💡');
    expect(report).toContain('Suggestion');
    expect(report).toContain('tokens.spacing[4]');
  });

  it('should handle violations without suggestions', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: '#ffffff',
        // No suggestion provided
      },
    ];

    const report = generateReport(violations);
    expect(report).toContain('color violation');
    // Should not crash, just not show suggestion line
  });

  it('should display correct spacing suggestions', () => {
    const spacingTests = [
      { value: '4px', suggestion: 'tokens.spacing[1]' },
      { value: '8px', suggestion: 'tokens.spacing[2]' },
      { value: '16px', suggestion: 'tokens.spacing[4]' },
      { value: '24px', suggestion: 'tokens.spacing[6]' },
    ];

    spacingTests.forEach(({ value, suggestion }) => {
      const violations: Violation[] = [
        {
          file: 'test.tsx',
          line: 1,
          column: 0,
          type: 'spacing',
          value,
          suggestion,
        },
      ];

      const report = generateReport(violations);
      expect(report).toContain(suggestion);
    });
  });
});

// ============================================================================
// REQ-STY-009: Compliance Calculation
// ============================================================================

describe('Reporter - Compliance Calculation', () => {
  it('should return 100% for zero violations', () => {
    const violations: Violation[] = [];
    const compliance = calculateCompliance(violations);
    expect(compliance).toBe(100);
  });

  it('should return 0% for any violations', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: '#ffffff',
      },
    ];
    const compliance = calculateCompliance(violations);
    expect(compliance).toBe(0);
  });

  it('should return 0% for multiple violations', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: '#ffffff',
      },
      {
        file: 'src/Button.tsx',
        line: 20,
        column: 0,
        type: 'spacing',
        value: '16px',
      },
    ];
    const compliance = calculateCompliance(violations);
    expect(compliance).toBe(0);
  });
});

// ============================================================================
// REQ-STY-008: Violation Details
// ============================================================================

describe('Reporter - Violation Details', () => {
  it('should include file path in report', () => {
    const violations: Violation[] = [
      {
        file: 'src/components/nested/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: '#ffffff',
      },
    ];

    const report = generateReport(violations);
    expect(report).toContain('src/components/nested/Card.tsx');
  });

  it('should include line numbers in report', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 42,
        column: 0,
        type: 'color',
        value: '#ffffff',
      },
    ];

    const report = generateReport(violations);
    expect(report).toContain('Line 42');
  });

  it('should include violation type in report', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: '#ffffff',
      },
      {
        file: 'src/Button.tsx',
        line: 20,
        column: 0,
        type: 'spacing',
        value: '16px',
      },
    ];

    const report = generateReport(violations);
    expect(report).toContain('color violation');
    expect(report).toContain('spacing violation');
  });

  it('should include violation value in report', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: '#ffffff',
      },
    ];

    const report = generateReport(violations);
    expect(report).toContain('"#ffffff"');
  });

  it('should display total violation count', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: '#ffffff',
      },
      {
        file: 'src/Button.tsx',
        line: 20,
        column: 0,
        type: 'spacing',
        value: '16px',
      },
      {
        file: 'src/Input.tsx',
        line: 30,
        column: 0,
        type: 'color',
        value: 'rgb(0, 0, 0)',
      },
    ];

    const report = generateReport(violations);
    expect(report).toContain('Total: 3 violation(s)');
  });
});

// ============================================================================
// Report Format and Readability
// ============================================================================

describe('Reporter - Report Format', () => {
  it('should include REQ-STY-009 reference when violations exist', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: '#ffffff',
      },
    ];

    const report = generateReport(violations);
    expect(report).toContain('REQ-STY-009');
    expect(report).toContain('Build will fail');
  });

  it('should use emoji indicators', () => {
    const violationsEmpty: Violation[] = [];
    const violationsPresent: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: '#ffffff',
      },
    ];

    const successReport = generateReport(violationsEmpty);
    const errorReport = generateReport(violationsPresent);

    expect(successReport).toContain('✅');
    expect(errorReport).toContain('❌');
    expect(errorReport).toContain('📄');
  });

  it('should format multi-file reports correctly', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: '#ffffff',
      },
      {
        file: 'src/Card.tsx',
        line: 15,
        column: 0,
        type: 'spacing',
        value: '16px',
      },
      {
        file: 'src/Button.tsx',
        line: 20,
        column: 0,
        type: 'color',
        value: 'rgb(255, 0, 0)',
      },
      {
        file: 'src/Input.tsx',
        line: 30,
        column: 0,
        type: 'spacing',
        value: '8px',
      },
    ];

    const report = generateReport(violations);

    // Should have clear section breaks
    expect(report.split('📄').length).toBeGreaterThan(1);

    // Should list all files
    expect(report).toContain('src/Card.tsx');
    expect(report).toContain('src/Button.tsx');
    expect(report).toContain('src/Input.tsx');
  });

  it('should create readable indented format', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: '#ffffff',
        suggestion: 'tokens.bg.*',
      },
    ];

    const report = generateReport(violations);

    // Check for proper indentation (at least 2 spaces for violations)
    const lines = report.split('\n');
    const violationLine = lines.find(line => line.includes('Line 10'));
    const suggestionLine = lines.find(line => line.includes('💡'));

    expect(violationLine).toBeDefined();
    expect(violationLine).toMatch(/^\s{2,}/); // At least 2 spaces

    if (suggestionLine) {
      expect(suggestionLine).toMatch(/^\s{4,}/); // More indentation for suggestions
    }
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe('Reporter - Edge Cases', () => {
  it('should handle violations with special characters in values', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: 'rgba(255, 255, 255, 0.5)',
      },
    ];

    const report = generateReport(violations);
    expect(report).toContain('rgba(255, 255, 255, 0.5)');
  });

  it('should handle very long file paths', () => {
    const violations: Violation[] = [
      {
        file: 'src/components/deeply/nested/directory/structure/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: '#ffffff',
      },
    ];

    const report = generateReport(violations);
    expect(report).toContain('src/components/deeply/nested/directory/structure/Card.tsx');
  });

  it('should handle many violations in single file', () => {
    const violations: Violation[] = Array.from({ length: 10 }, (_, i) => ({
      file: 'src/Card.tsx',
      line: (i + 1) * 10,
      column: 0,
      type: 'color' as const,
      value: '#ffffff',
    }));

    const report = generateReport(violations);
    expect(report).toContain('Total: 10 violation(s)');
    // Should group all under same file
    expect((report.match(/📄 src\/Card\.tsx/g) || []).length).toBe(1);
  });

  it('should handle violations with missing optional fields', () => {
    const violations: Violation[] = [
      {
        file: 'src/Card.tsx',
        line: 10,
        column: 0,
        type: 'color',
        value: '#ffffff',
        // No suggestion
      },
    ];

    expect(() => generateReport(violations)).not.toThrow();
    const report = generateReport(violations);
    expect(report).toContain('color violation');
  });
});
