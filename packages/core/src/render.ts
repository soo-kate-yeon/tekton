/**
 * @tekton/core - Render Module
 * Template-based JSX generation (no AST dependencies)
 * Target: 300 LOC
 */

import type { Blueprint, ComponentNode, RenderResult, RenderOptions } from './types.js';
import { loadTheme, generateCSSVariables } from './theme.js';

// ============================================================================
// Default Options
// ============================================================================

const DEFAULT_OPTIONS: Required<RenderOptions> = {
  typescript: true,
  indent: 2,
  semicolons: true,
};

// ============================================================================
// Component Templates
// ============================================================================

type ComponentRenderer = (node: ComponentNode, indent: string) => string;

const COMPONENT_RENDERERS: Record<string, ComponentRenderer> = {
  Button: (node, indent) => {
    const variant = node.props?.variant || 'default';
    const children = renderChildren(node.children, indent);
    return `${indent}<Button variant="${variant}">${children}</Button>`;
  },

  Input: (node, indent) => {
    const placeholder = node.props?.placeholder || '';
    const type = node.props?.type || 'text';
    return `${indent}<Input type="${type}" placeholder="${placeholder}" />`;
  },

  Card: (node, indent) => {
    const children = renderChildren(node.children, indent + '  ');
    return `${indent}<Card>\n${children}\n${indent}</Card>`;
  },

  Text: (node, indent) => {
    const children = renderChildren(node.children, indent);
    return `${indent}<Text>${children}</Text>`;
  },

  Heading: (node, indent) => {
    const level = node.props?.level || 1;
    const children = renderChildren(node.children, indent);
    return `${indent}<Heading level={${level}}>${children}</Heading>`;
  },

  Image: (node, indent) => {
    const src = node.props?.src || '';
    const alt = node.props?.alt || '';
    return `${indent}<Image src="${src}" alt="${alt}" />`;
  },

  Link: (node, indent) => {
    const href = node.props?.href || '#';
    const children = renderChildren(node.children, indent);
    return `${indent}<Link href="${href}">${children}</Link>`;
  },

  List: (node, indent) => {
    const children = renderChildren(node.children, indent + '  ');
    return `${indent}<List>\n${children}\n${indent}</List>`;
  },

  Form: (node, indent) => {
    const children = renderChildren(node.children, indent + '  ');
    return `${indent}<Form>\n${children}\n${indent}</Form>`;
  },

  Modal: (node, indent) => {
    const title = node.props?.title || '';
    const children = renderChildren(node.children, indent + '  ');
    return `${indent}<Modal title="${title}">\n${children}\n${indent}</Modal>`;
  },

  // Default fallback for unknown components
  Default: (node, indent) => {
    const props = renderProps(node.props);
    const children = node.children ? renderChildren(node.children, indent + '  ') : '';
    const hasChildren = children.trim().length > 0;

    if (hasChildren) {
      return `${indent}<${node.type}${props}>\n${children}\n${indent}</${node.type}>`;
    }
    return `${indent}<${node.type}${props} />`;
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

function renderProps(props?: Record<string, unknown>): string {
  if (!props || Object.keys(props).length === 0) {
    return '';
  }

  const parts: string[] = [];
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'string') {
      parts.push(`${key}="${value}"`);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      parts.push(`${key}={${value}}`);
    } else if (value !== undefined && value !== null) {
      parts.push(`${key}={${JSON.stringify(value)}}`);
    }
  }

  return parts.length > 0 ? ' ' + parts.join(' ') : '';
}

function renderChildren(children: (ComponentNode | string)[] | undefined, indent: string): string {
  if (!children || children.length === 0) {
    return '';
  }

  return children
    .map(child => {
      if (typeof child === 'string') {
        return `${indent}${child}`;
      }
      return renderNode(child, indent);
    })
    .join('\n');
}

function renderNode(node: ComponentNode, indent: string = ''): string {
  const renderer = COMPONENT_RENDERERS[node.type] || COMPONENT_RENDERERS.Default;
  return renderer(node, indent);
}

// ============================================================================
// Layout Templates
// ============================================================================

function renderLayout(blueprint: Blueprint, components: string, indent: string): string {
  const layout = blueprint.layout;
  const i = indent;
  const i2 = indent + '  ';

  switch (layout) {
    case 'single-column':
      return `${i}<main className="container mx-auto px-4">\n${components}\n${i}</main>`;

    case 'two-column':
      return `${i}<div className="grid grid-cols-2 gap-4">\n${i2}<div className="col-span-1">\n${components}\n${i2}</div>\n${i2}<div className="col-span-1">\n${i2}</div>\n${i}</div>`;

    case 'sidebar-left':
      return `${i}<div className="flex">\n${i2}<aside className="w-64 shrink-0">\n${i2}</aside>\n${i2}<main className="flex-1">\n${components}\n${i2}</main>\n${i}</div>`;

    case 'sidebar-right':
      return `${i}<div className="flex">\n${i2}<main className="flex-1">\n${components}\n${i2}</main>\n${i2}<aside className="w-64 shrink-0">\n${i2}</aside>\n${i}</div>`;

    case 'dashboard':
      return `${i}<div className="flex h-screen">\n${i2}<aside className="w-64 shrink-0 border-r">\n${i2}</aside>\n${i2}<div className="flex-1 flex flex-col">\n${i2}  <header className="h-16 border-b">\n${i2}  </header>\n${i2}  <main className="flex-1 p-4">\n${components}\n${i2}  </main>\n${i2}</div>\n${i}</div>`;

    case 'landing':
      return `${i}<div className="min-h-screen">\n${i2}<section className="hero py-20">\n${components}\n${i2}</section>\n${i}</div>`;

    default:
      return `${i}<div>\n${components}\n${i}</div>`;
  }
}

// ============================================================================
// Main Render Functions
// ============================================================================

/**
 * Render blueprint to JSX code
 */
export function render(blueprint: Blueprint, options?: RenderOptions): RenderResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const indent = ' '.repeat(opts.indent);

  try {
    // Render components
    const componentsJsx = blueprint.components
      .map(comp => renderNode(comp, indent + indent))
      .join('\n');

    // Wrap in layout
    const layoutJsx = renderLayout(blueprint, componentsJsx, indent);

    // Generate imports
    const componentTypes = extractComponentTypes(blueprint.components);
    const imports = generateImports(componentTypes, opts.typescript);

    // Generate component function
    const componentName = toPascalCase(blueprint.name);
    const semi = opts.semicolons ? ';' : '';

    const code = `${imports}

export default function ${componentName}() {
  return (
${layoutJsx}
  )${semi}
}
`;

    return { success: true, code };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown render error',
    };
  }
}

/**
 * Render blueprint with theme applied
 */
export function renderWithTheme(blueprint: Blueprint, options?: RenderOptions): RenderResult {
  const theme = loadTheme(blueprint.themeId);
  if (!theme) {
    return { success: false, error: `Theme not found: ${blueprint.themeId}` };
  }

  // Generate CSS variables comment
  const cssVars = generateCSSVariables(theme);
  const cssComment = `/* Theme: ${theme.name} */\n/* CSS Variables:\n${Object.entries(cssVars)
    .map(([k, v]) => `   ${k}: ${v};`)
    .join('\n')}\n*/\n`;

  const result = render(blueprint, options);
  if (!result.success) {
    return result;
  }

  return {
    success: true,
    code: cssComment + result.code,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

function extractComponentTypes(nodes: ComponentNode[]): string[] {
  const types = new Set<string>();

  function traverse(node: ComponentNode) {
    types.add(node.type);
    if (node.children) {
      for (const child of node.children) {
        if (typeof child !== 'string') {
          traverse(child);
        }
      }
    }
  }

  for (const node of nodes) {
    traverse(node);
  }

  return Array.from(types).sort();
}

function generateImports(componentTypes: string[], typescript: boolean): string {
  if (componentTypes.length === 0) {
    return '';
  }

  const ext = typescript ? '' : '';
  return `import { ${componentTypes.join(', ')} } from '@/components/ui'${ext};`;
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// ============================================================================
// Quick Render API
// ============================================================================

/**
 * Quick render a single component
 */
export function renderSingleComponent(node: ComponentNode): string {
  return renderNode(node, '');
}

/**
 * Render multiple components without layout wrapper
 */
export function renderComponents(nodes: ComponentNode[], indent: string = ''): string {
  return nodes.map(n => renderNode(n, indent)).join('\n');
}
