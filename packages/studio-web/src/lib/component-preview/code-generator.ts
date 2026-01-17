/**
 * Code Generator
 * Generate HTML/JSX code from component preview state
 */

import type { ComponentState } from './style-generator';
import { styleObjectToCSS } from './style-generator';

export interface CodeGeneratorOptions {
  hookName: string;
  htmlElement: string;
  state: ComponentState;
  styles: Record<string, string>;
  children?: string;
}

/**
 * Generate HTML code for preview
 */
export function generateHTMLCode({
  htmlElement,
  state,
  styles,
  children = 'Button',
}: CodeGeneratorOptions): string {
  const styleString = styleObjectToCSS(styles);
  const attributes = generateAttributes(state);

  const selfClosing = ['input', 'img', 'br', 'hr'].includes(htmlElement);

  if (selfClosing) {
    return `<${htmlElement}${attributes} style="${styleString}" />`;
  }

  return `<${htmlElement}${attributes} style="${styleString}">\n  ${children}\n</${htmlElement}>`;
}

/**
 * Generate React/JSX code for preview
 */
export function generateJSXCode({
  hookName,
  htmlElement,
  state,
  styles,
  children = 'Button',
}: CodeGeneratorOptions): string {
  const styleObject = formatStyleObject(styles);
  const selfClosing = ['input', 'img', 'br', 'hr'].includes(htmlElement.toLowerCase());

  const lines = [
    `import { ${hookName} } from '@tekton/hooks';`,
    '',
    `function MyComponent() {`,
    `  const { buttonProps } = ${hookName}({`,
  ];

  // Add state props
  for (const [key, value] of Object.entries(state)) {
    lines.push(`    ${key}: ${formatValue(value)},`);
  }

  lines.push(`  });`);
  lines.push('');
  lines.push(`  return (`);

  if (selfClosing) {
    lines.push(`    <${htmlElement.toLowerCase()}`);
    lines.push(`      {...buttonProps}`);
    lines.push(`      style={${styleObject}}`);
    lines.push(`    />`);
  } else {
    lines.push(`    <${htmlElement.toLowerCase()}`);
    lines.push(`      {...buttonProps}`);
    lines.push(`      style={${styleObject}}`);
    lines.push(`    >`);
    lines.push(`      ${children}`);
    lines.push(`    </${htmlElement.toLowerCase()}>`);
  }

  lines.push(`  );`);
  lines.push(`}`);

  return lines.join('\n');
}

/**
 * Generate CSS code for styling
 */
export function generateCSSCode(
  className: string,
  styles: Record<string, string>
): string {
  const cssLines = Object.entries(styles)
    .map(([key, value]) => `  ${camelToKebab(key)}: ${value};`)
    .join('\n');

  return `.${className} {\n${cssLines}\n}`;
}

/**
 * Generate HTML attributes from state
 */
function generateAttributes(state: ComponentState): string {
  const attrs: string[] = [];

  for (const [key, value] of Object.entries(state)) {
    if (key === 'disabled' && value) {
      attrs.push(' disabled');
    } else if (typeof value === 'boolean') {
      if (value) {
        attrs.push(` ${key}`);
      }
    } else if (typeof value === 'string') {
      attrs.push(` data-${key}="${value}"`);
    }
  }

  return attrs.join('');
}

/**
 * Generate React props string from state
 */
function _generateReactProps(state: ComponentState): string {
  const props: string[] = [];

  for (const [key, value] of Object.entries(state)) {
    if (typeof value === 'boolean') {
      if (value) {
        props.push(`${key}={${value}}`);
      }
    } else if (typeof value === 'string') {
      props.push(`${key}="${value}"`);
    } else {
      props.push(`${key}={${JSON.stringify(value)}}`);
    }
  }

  return props.join(' ');
}

/**
 * Format style object for JSX
 */
function formatStyleObject(styles: Record<string, string>): string {
  if (Object.keys(styles).length === 0) {
    return '{}';
  }

  const entries = Object.entries(styles)
    .map(([key, value]) => `${key}: '${value}'`)
    .join(', ');

  return `{ ${entries} }`;
}

/**
 * Format a value for JS code
 */
function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  if (typeof value === 'boolean') {
    return value.toString();
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  return JSON.stringify(value);
}

/**
 * Capitalize first letter
 */
function _capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
