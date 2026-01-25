import { oklchToHex } from '../color-conversion';
/**
 * Format OKLCH color as CSS oklch() function
 */
function formatOKLCH(color) {
    return `oklch(${(color.l * 100).toFixed(2)}% ${color.c.toFixed(3)} ${color.h.toFixed(0)})`;
}
/**
 * Export semantic tokens to CSS variables
 * TASK-005: CSS Variables Output (EDR-002)
 */
export function exportToCSS(config) {
    const { semanticTokens, darkTokens, colorScales = {}, minify = false, prefix = '' } = config;
    const lines = [];
    const indent = minify ? '' : '  ';
    const newline = minify ? '' : '\n';
    const space = minify ? '' : ' ';
    const prefixStr = prefix ? `${prefix}-` : '';
    // Light mode (default)
    lines.push(`:root${space}{${newline}`);
    // Semantic tokens
    Object.entries(semanticTokens).forEach(([name, color]) => {
        lines.push(`${indent}--${prefixStr}${name}:${space}${formatOKLCH(color)};${newline}`);
    });
    // Color scales
    Object.entries(colorScales).forEach(([scaleName, scale]) => {
        Object.entries(scale).forEach(([step, color]) => {
            lines.push(`${indent}--${prefixStr}${scaleName}-${step}:${space}${formatOKLCH(color)};${newline}`);
        });
    });
    lines.push(`}${newline}`);
    // Dark mode
    if (darkTokens) {
        lines.push(`${newline}.dark${space}{${newline}`);
        Object.entries(darkTokens).forEach(([name, color]) => {
            lines.push(`${indent}--${prefixStr}${name}:${space}${formatOKLCH(color)};${newline}`);
        });
        lines.push(`}${newline}`);
    }
    return lines.join('');
}
/**
 * Export to Design Token Community Group (DTCG) format
 * TASK-006: DTCG JSON Output (EDR-002)
 */
export function exportToDTCG(config) {
    const { semanticTokens, darkTokens, colorScales = {} } = config;
    const output = {};
    // Semantic tokens
    Object.entries(semanticTokens).forEach(([name, color]) => {
        output[name] = {
            $type: 'color',
            $value: formatOKLCH(color),
        };
    });
    // Color scales
    Object.entries(colorScales).forEach(([scaleName, scale]) => {
        if (!output[scaleName]) {
            output[scaleName] = {};
        }
        Object.entries(scale).forEach(([step, color]) => {
            output[scaleName][step] = {
                $type: 'color',
                $value: formatOKLCH(color),
            };
        });
    });
    // Dark mode
    if (darkTokens) {
        output.dark = {};
        Object.entries(darkTokens).forEach(([name, color]) => {
            output.dark[name] = {
                $type: 'color',
                $value: formatOKLCH(color),
            };
        });
    }
    return JSON.stringify(output, null, 2);
}
/**
 * Export to Tailwind CSS configuration
 * TASK-007: Tailwind Config Output (EDR-002)
 */
export function exportToTailwind(config) {
    const { semanticTokens, colorScales = {}, format = 'js' } = config;
    const lines = [];
    // TypeScript format
    if (format === 'ts') {
        lines.push("import type { Config } from 'tailwindcss';");
        lines.push('');
        lines.push('const config = {');
    }
    else {
        // JavaScript format
        lines.push('module.exports = {');
    }
    lines.push('  content: [],');
    lines.push('  theme: {');
    lines.push('    extend: {');
    lines.push('      colors: {');
    // Semantic tokens as flat colors
    Object.entries(semanticTokens).forEach(([name, color]) => {
        lines.push(`        ${name}: '${oklchToHex(color)}',`);
    });
    // Color scales
    Object.entries(colorScales).forEach(([scaleName, scale]) => {
        lines.push(`        ${scaleName}: {`);
        Object.entries(scale).forEach(([step, color]) => {
            lines.push(`          '${step}': '${oklchToHex(color)}',`);
        });
        lines.push('        },');
    });
    lines.push('      },');
    lines.push('    },');
    lines.push('  },');
    lines.push('  plugins: [],');
    if (format === 'ts') {
        lines.push('} satisfies Config;');
        lines.push('');
        lines.push('export default config;');
    }
    else {
        lines.push('};');
    }
    return lines.join('\n');
}
//# sourceMappingURL=output.js.map