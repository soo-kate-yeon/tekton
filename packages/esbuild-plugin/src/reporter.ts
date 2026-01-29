/**
 * @tekton/esbuild-plugin - Violation Reporter
 * [SPEC-STYLED-001] [TAG-008]
 * Build reporting system with violation details
 */

import type { Violation } from './analyzer.js';

/**
 * Generate human-readable violation report
 * REQ-STY-008: Report file location, line number, and violation type
 */
export function generateReport(violations: Violation[]): string {
  if (violations.length === 0) {
    return '\n✅ [Tekton] Token compliance: 100% - No violations found\n';
  }

  const grouped = violations.reduce(
    (acc, v) => {
      acc[v.file] = acc[v.file] || [];
      acc[v.file].push(v);
      return acc;
    },
    {} as Record<string, Violation[]>
  );

  let report = '\n❌ [Tekton] Token Compliance Violations\n\n';

  for (const [file, fileViolations] of Object.entries(grouped)) {
    report += `📄 ${file}:\n`;
    for (const v of fileViolations) {
      report += `  Line ${v.line}: ${v.type} violation - "${v.value}"\n`;
      if (v.suggestion) {
        report += `    💡 Suggestion: ${v.suggestion}\n`;
      }
    }
    report += '\n';
  }

  report += `Total: ${violations.length} violation(s)\n`;
  report += `REQ-STY-009: Build will fail (compliance < 100%)\n`;

  return report;
}

/**
 * Calculate compliance percentage
 * REQ-STY-009: Fail build when compliance < 100%
 */
export function calculateCompliance(violations: Violation[]): number {
  // For now, simple binary: 0 violations = 100%, any violations = 0%
  // Could be enhanced with total CSS properties count
  return violations.length === 0 ? 100 : 0;
}

/**
 * Write report to file
 * REQ-STY-009: Generate report file
 */
export function writeReport(_report: string, path: string): void {
  // Implementation would write to filesystem
  // Simplified for now
  console.log(`[Tekton] Report would be written to: ${path}`);
}
