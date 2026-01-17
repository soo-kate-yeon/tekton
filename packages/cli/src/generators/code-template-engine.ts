/**
 * Code Template Engine
 *
 * Transforms archetype data + preset tokens into actual React component code.
 * Processes the 4-layer archetype structure:
 * - Layer 1: Prop Rules → Base CSS styles
 * - Layer 2: State Mappings → Hover/active/disabled CSS
 * - Layer 3: Variant Branching → Variant classes
 * - Layer 4: Structure Template → JSX code
 */

import type {
  CompleteArchetype,
  HookPropRule,
  StateStyleMapping,
  VariantBranching,
  StructureTemplate,
} from '../clients/mcp-client.js';

/**
 * Generated component output
 */
export interface GeneratedComponent {
  name: string;
  tsx: string;
  css: string;
  hookName: string;
}

/**
 * Component transformation options
 */
export interface TransformOptions {
  prefix?: string;
  includeComments?: boolean;
  useTypeScript?: boolean;
}

/**
 * Default styles for components when MCP is unavailable
 */
export const DEFAULT_COMPONENT_STYLES: Record<string, Record<string, string>> = {
  Card: {
    background: 'var(--tekton-neutral-50)',
    borderRadius: 'var(--tekton-border-radius)',
    padding: 'var(--tekton-spacing-lg)',
    boxShadow: 'var(--tekton-shadow)',
  },
  Button: {
    background: 'var(--tekton-primary-base)',
    color: 'var(--tekton-primary-contrast)',
    borderRadius: 'var(--tekton-border-radius)',
    padding: 'var(--tekton-spacing-sm) var(--tekton-spacing-md)',
    fontWeight: 'var(--tekton-font-medium)',
    cursor: 'pointer',
    border: 'none',
  },
  Input: {
    background: 'var(--tekton-neutral-50)',
    border: '1px solid var(--tekton-neutral-300)',
    borderRadius: 'var(--tekton-border-radius)',
    padding: 'var(--tekton-spacing-sm) var(--tekton-spacing-md)',
    fontSize: 'var(--tekton-text-base)',
    width: '100%',
  },
  Badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 'var(--tekton-spacing-xs) var(--tekton-spacing-sm)',
    borderRadius: 'var(--tekton-border-radius-full)',
    fontSize: 'var(--tekton-text-xs)',
    fontWeight: 'var(--tekton-font-medium)',
    background: 'var(--tekton-neutral-200)',
    color: 'var(--tekton-neutral-800)',
  },
  Avatar: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: 'var(--tekton-border-radius-full)',
    background: 'var(--tekton-neutral-200)',
    color: 'var(--tekton-neutral-700)',
    fontWeight: 'var(--tekton-font-medium)',
    overflow: 'hidden',
  },
  Table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 'var(--tekton-text-sm)',
  },
  Stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--tekton-spacing-xs)',
  },
  Chart: {
    width: '100%',
    minHeight: '200px',
    background: 'var(--tekton-neutral-50)',
    borderRadius: 'var(--tekton-border-radius)',
    padding: 'var(--tekton-spacing-md)',
  },
  Dialog: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'var(--tekton-neutral-50)',
    borderRadius: 'var(--tekton-border-radius-lg)',
    padding: 'var(--tekton-spacing-xl)',
    boxShadow: 'var(--tekton-shadow-xl)',
    maxWidth: '500px',
    width: '90%',
  },
  Alert: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--tekton-spacing-sm)',
    padding: 'var(--tekton-spacing-md)',
    borderRadius: 'var(--tekton-border-radius)',
    background: 'var(--tekton-info)',
    color: 'var(--tekton-neutral-50)',
  },
  Progress: {
    width: '100%',
    height: '8px',
    background: 'var(--tekton-neutral-200)',
    borderRadius: 'var(--tekton-border-radius-full)',
    overflow: 'hidden',
  },
  Tooltip: {
    position: 'absolute',
    padding: 'var(--tekton-spacing-xs) var(--tekton-spacing-sm)',
    background: 'var(--tekton-neutral-900)',
    color: 'var(--tekton-neutral-50)',
    borderRadius: 'var(--tekton-border-radius-sm)',
    fontSize: 'var(--tekton-text-xs)',
    whiteSpace: 'nowrap',
    zIndex: '1000',
  },
};

/**
 * Default state styles for hover/focus/disabled states
 */
export const DEFAULT_STATE_STYLES: Record<string, Record<string, Record<string, string>>> = {
  Button: {
    hover: {
      background: 'var(--tekton-primary-dark)',
      transform: 'translateY(-1px)',
    },
    active: {
      background: 'var(--tekton-primary-dark)',
      transform: 'translateY(0)',
    },
    disabled: {
      background: 'var(--tekton-neutral-300)',
      color: 'var(--tekton-neutral-500)',
      cursor: 'not-allowed',
    },
    focus: {
      outline: '2px solid var(--tekton-primary-light)',
      outlineOffset: '2px',
    },
  },
  Input: {
    hover: {
      borderColor: 'var(--tekton-neutral-400)',
    },
    focus: {
      borderColor: 'var(--tekton-primary-base)',
      outline: '2px solid var(--tekton-primary-light)',
      outlineOffset: '0',
    },
    disabled: {
      background: 'var(--tekton-neutral-100)',
      cursor: 'not-allowed',
    },
  },
  Card: {
    hover: {
      boxShadow: 'var(--tekton-shadow-md)',
    },
  },
};

/**
 * Default variant styles
 */
export const DEFAULT_VARIANT_STYLES: Record<string, Record<string, Record<string, string>>> = {
  Card: {
    elevated: {
      boxShadow: 'var(--tekton-shadow-lg)',
    },
    outlined: {
      boxShadow: 'none',
      border: '1px solid var(--tekton-neutral-300)',
    },
    flat: {
      boxShadow: 'none',
      background: 'var(--tekton-neutral-100)',
    },
  },
  Button: {
    primary: {
      background: 'var(--tekton-primary-base)',
      color: 'var(--tekton-primary-contrast)',
    },
    secondary: {
      background: 'var(--tekton-secondary-base)',
      color: 'var(--tekton-secondary-contrast)',
    },
    outline: {
      background: 'transparent',
      border: '1px solid var(--tekton-primary-base)',
      color: 'var(--tekton-primary-base)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--tekton-primary-base)',
    },
  },
  Badge: {
    success: {
      background: 'var(--tekton-success)',
      color: 'var(--tekton-neutral-50)',
    },
    warning: {
      background: 'var(--tekton-warning)',
      color: 'var(--tekton-neutral-900)',
    },
    error: {
      background: 'var(--tekton-error)',
      color: 'var(--tekton-neutral-50)',
    },
    info: {
      background: 'var(--tekton-info)',
      color: 'var(--tekton-neutral-50)',
    },
  },
  Alert: {
    success: {
      background: 'var(--tekton-success)',
    },
    warning: {
      background: 'var(--tekton-warning)',
      color: 'var(--tekton-neutral-900)',
    },
    error: {
      background: 'var(--tekton-error)',
    },
    info: {
      background: 'var(--tekton-info)',
    },
  },
};

/**
 * Default JSX structure patterns
 */
export const DEFAULT_JSX_PATTERNS: Record<string, {
  element: string;
  role?: string;
  children: string;
}> = {
  Card: {
    element: 'article',
    role: 'article',
    children: '{children}',
  },
  Button: {
    element: 'button',
    role: 'button',
    children: '{children}',
  },
  Input: {
    element: 'input',
    children: '',
  },
  Badge: {
    element: 'span',
    children: '{children}',
  },
  Avatar: {
    element: 'div',
    role: 'img',
    children: '{initials || children}',
  },
  Table: {
    element: 'table',
    role: 'table',
    children: '{children}',
  },
  Stat: {
    element: 'div',
    children: `<span className="stat__label">{label}</span>
      <span className="stat__value">{value}</span>
      {trend && <span className="stat__trend">{trend}</span>}`,
  },
  Chart: {
    element: 'div',
    role: 'img',
    children: '{children}',
  },
  Dialog: {
    element: 'dialog',
    role: 'dialog',
    children: '{children}',
  },
  Alert: {
    element: 'div',
    role: 'alert',
    children: `{icon && <span className="alert__icon">{icon}</span>}
      <span className="alert__message">{children}</span>`,
  },
  Progress: {
    element: 'div',
    role: 'progressbar',
    children: '<div className="progress__bar" style={{ width: `${value}%` }} />',
  },
  Tooltip: {
    element: 'div',
    role: 'tooltip',
    children: '{content}',
  },
};

/**
 * Convert CSS property name to kebab-case
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert component name to kebab-case for CSS class
 */
function toComponentClass(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generate base CSS styles from archetype prop rules (Layer 1)
 */
export function generateBaseStyles(
  componentName: string,
  propRules: HookPropRule | null,
  options: TransformOptions = {}
): string {
  const prefix = options.prefix || 'tekton';
  const className = toComponentClass(componentName);
  const lines: string[] = [];

  if (propRules && propRules.baseStyles.length > 0) {
    // Use archetype-defined styles
    lines.push(`.${className} {`);
    for (const baseStyle of propRules.baseStyles) {
      for (const [prop, value] of Object.entries(baseStyle.cssProperties)) {
        // Replace token references with CSS variables
        const cssValue = value.replace(/\{(\w+)\}/g, `var(--${prefix}-$1)`);
        lines.push(`  ${toKebabCase(prop)}: ${cssValue};`);
      }
    }
    lines.push('}');
  } else {
    // Use default styles
    const defaultStyles = DEFAULT_COMPONENT_STYLES[componentName];
    if (defaultStyles) {
      lines.push(`.${className} {`);
      for (const [prop, value] of Object.entries(defaultStyles)) {
        lines.push(`  ${toKebabCase(prop)}: ${value};`);
      }
      lines.push('}');
    }
  }

  return lines.join('\n');
}

/**
 * Generate state CSS styles from archetype state mappings (Layer 2)
 */
export function generateStateStyles(
  componentName: string,
  stateMappings: StateStyleMapping | null,
  _options: TransformOptions = {}
): string {
  const className = toComponentClass(componentName);
  const lines: string[] = [];

  if (stateMappings && stateMappings.states.length > 0) {
    // Use archetype-defined state styles
    for (const state of stateMappings.states) {
      const pseudoClass = mapStateToPseudoClass(state.stateName);
      if (pseudoClass) {
        lines.push(`.${className}${pseudoClass} {`);
        for (const [prop, value] of Object.entries(state.visualFeedback.cssProperties)) {
          lines.push(`  ${toKebabCase(prop)}: ${value};`);
        }
        lines.push('}');
      }
    }

    // Add transition if defined
    if (stateMappings.transitions) {
      lines.unshift(`.${className} {`);
      lines.splice(1, 0, `  transition: all ${stateMappings.transitions.duration} ${stateMappings.transitions.easing};`);
      lines.splice(2, 0, '}');
      lines.splice(3, 0, '');
    }
  } else {
    // Use default state styles
    const defaultStates = DEFAULT_STATE_STYLES[componentName];
    if (defaultStates) {
      // Add transition
      lines.push(`.${className} {`);
      lines.push('  transition: all 0.15s ease-in-out;');
      lines.push('}');
      lines.push('');

      for (const [stateName, styles] of Object.entries(defaultStates)) {
        const pseudoClass = mapStateToPseudoClass(stateName);
        if (pseudoClass) {
          lines.push(`.${className}${pseudoClass} {`);
          for (const [prop, value] of Object.entries(styles)) {
            lines.push(`  ${toKebabCase(prop)}: ${value};`);
          }
          lines.push('}');
        }
      }
    }
  }

  return lines.join('\n');
}

/**
 * Map state name to CSS pseudo-class
 */
function mapStateToPseudoClass(stateName: string): string | null {
  const mapping: Record<string, string> = {
    hover: ':hover',
    focus: ':focus',
    active: ':active',
    disabled: ':disabled',
    checked: ':checked',
    selected: '[aria-selected="true"]',
    expanded: '[aria-expanded="true"]',
    pressed: '[aria-pressed="true"]',
  };
  return mapping[stateName.toLowerCase()] || null;
}

/**
 * Generate variant CSS styles from archetype variants (Layer 3)
 */
export function generateVariantStyles(
  componentName: string,
  variants: VariantBranching | null,
  _options: TransformOptions = {}
): string {
  const className = toComponentClass(componentName);
  const lines: string[] = [];

  if (variants && variants.configurationOptions.length > 0) {
    // Use archetype-defined variants
    for (const option of variants.configurationOptions) {
      for (const rule of option.styleRules) {
        const variantClass = `${className}--${rule.condition.replace(/['"=]/g, '')}`;
        lines.push(`.${variantClass} {`);
        for (const [prop, value] of Object.entries(rule.cssProperties)) {
          lines.push(`  ${toKebabCase(prop)}: ${value};`);
        }
        lines.push('}');
      }
    }
  } else {
    // Use default variant styles
    const defaultVariants = DEFAULT_VARIANT_STYLES[componentName];
    if (defaultVariants) {
      for (const [variantName, styles] of Object.entries(defaultVariants)) {
        lines.push(`.${className}--${variantName} {`);
        for (const [prop, value] of Object.entries(styles)) {
          lines.push(`  ${toKebabCase(prop)}: ${value};`);
        }
        lines.push('}');
      }
    }
  }

  return lines.join('\n');
}

/**
 * Default JSX pattern type
 */
interface DefaultJSXPattern {
  element: string;
  role?: string;
  children: string;
}

/**
 * Generate JSX code from archetype structure (Layer 4)
 */
export function generateJSXFromStructure(
  componentName: string,
  structure: StructureTemplate | null,
  variants: VariantBranching | null,
  _options: TransformOptions = {}
): string {
  const className = toComponentClass(componentName);
  const lines: string[] = [];

  // Generate imports
  lines.push(`import './${componentName}.css';`);
  lines.push('');

  // Generate props interface
  const variantOptions = getVariantOptions(componentName, variants);
  lines.push(generatePropsInterface(componentName, structure, variantOptions));
  lines.push('');

  // Generate component function
  lines.push(`export function ${componentName}({`);
  lines.push('  children,');
  if (variantOptions.length > 0) {
    lines.push(`  variant = '${variantOptions[0]}',`);
  }

  // Add specific props based on component type
  const specificProps = getComponentSpecificProps(componentName);
  for (const prop of specificProps) {
    lines.push(`  ${prop},`);
  }

  lines.push(`}: ${componentName}Props) {`);

  // Generate JSX
  const defaultPattern = DEFAULT_JSX_PATTERNS[componentName] as DefaultJSXPattern | undefined;
  const element = structure?.htmlElement || defaultPattern?.element || 'div';
  const role = structure?.accessibility?.role || defaultPattern?.role;
  const childrenContent = defaultPattern?.children || '{children}';

  // Build className string
  let classNameExpr = `\`${className}`;
  if (variantOptions.length > 0) {
    classNameExpr += ` \${variant ? \`${className}--\${variant}\` : ''}`;
  }
  classNameExpr += '`';

  // Build attributes
  const attrs: string[] = [];
  attrs.push(`className={${classNameExpr}}`);

  if (role) {
    attrs.push(`role="${role}"`);
  }

  // Add ARIA attributes
  if (structure?.accessibility?.ariaAttributes) {
    for (const aria of structure.accessibility.ariaAttributes) {
      if (aria.required) {
        attrs.push(`aria-${aria.name.replace('aria-', '')}={/* TODO: implement */}`);
      }
    }
  }

  // Add specific attributes based on component type
  const specificAttrs = getComponentSpecificAttributes(componentName);
  attrs.push(...specificAttrs);

  // Determine if self-closing
  const isSelfClosing = element === 'input' || element === 'img' || !childrenContent;

  lines.push('  return (');
  if (isSelfClosing) {
    lines.push(`    <${element}`);
    for (const attr of attrs) {
      lines.push(`      ${attr}`);
    }
    lines.push('    />');
  } else {
    lines.push(`    <${element}`);
    for (const attr of attrs) {
      lines.push(`      ${attr}`);
    }
    lines.push('    >');
    lines.push(`      ${childrenContent}`);
    lines.push(`    </${element}>`);
  }
  lines.push('  );');
  lines.push('}');

  return lines.join('\n');
}

/**
 * Get variant options for a component
 */
function getVariantOptions(
  componentName: string,
  variants: VariantBranching | null
): string[] {
  if (variants && variants.configurationOptions.length > 0) {
    const variantOption = variants.configurationOptions.find(
      (opt) => opt.optionName === 'variant'
    );
    if (variantOption && Array.isArray(variantOption.possibleValues)) {
      return variantOption.possibleValues as string[];
    }
  }

  // Use defaults
  const defaultVariants = DEFAULT_VARIANT_STYLES[componentName];
  if (defaultVariants) {
    return ['default', ...Object.keys(defaultVariants)];
  }

  return [];
}

/**
 * Generate TypeScript props interface
 */
function generatePropsInterface(
  componentName: string,
  _structure: StructureTemplate | null,
  variantOptions: string[]
): string {
  const lines: string[] = [];
  lines.push(`interface ${componentName}Props {`);
  lines.push('  children?: React.ReactNode;');

  if (variantOptions.length > 0) {
    const variantType = variantOptions.map((v) => `'${v}'`).join(' | ');
    lines.push(`  variant?: ${variantType};`);
  }

  // Add component-specific props
  const specificPropTypes = getComponentSpecificPropTypes(componentName);
  for (const [prop, type] of Object.entries(specificPropTypes)) {
    lines.push(`  ${prop}?: ${type};`);
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Get component-specific props for destructuring
 */
function getComponentSpecificProps(componentName: string): string[] {
  const propMap: Record<string, string[]> = {
    Stat: ['label', 'value', 'trend'],
    Alert: ['icon'],
    Progress: ['value'],
    Tooltip: ['content'],
    Avatar: ['initials', 'src', 'alt'],
    Input: ['type = "text"', 'placeholder', '...props'],
    Button: ['type = "button"', 'disabled', '...props'],
  };
  return propMap[componentName] || [];
}

/**
 * Get component-specific prop types
 */
function getComponentSpecificPropTypes(componentName: string): Record<string, string> {
  const typeMap: Record<string, Record<string, string>> = {
    Stat: {
      label: 'string',
      value: 'string | number',
      trend: 'React.ReactNode',
    },
    Alert: {
      icon: 'React.ReactNode',
    },
    Progress: {
      value: 'number',
    },
    Tooltip: {
      content: 'React.ReactNode',
    },
    Avatar: {
      initials: 'string',
      src: 'string',
      alt: 'string',
    },
    Input: {
      type: 'string',
      placeholder: 'string',
    },
    Button: {
      type: "'button' | 'submit' | 'reset'",
      disabled: 'boolean',
    },
  };
  return typeMap[componentName] || {};
}

/**
 * Get component-specific JSX attributes
 */
function getComponentSpecificAttributes(componentName: string): string[] {
  const attrMap: Record<string, string[]> = {
    Input: ['type={type}', 'placeholder={placeholder}', '{...props}'],
    Button: ['type={type}', 'disabled={disabled}', '{...props}'],
    Avatar: ['aria-label={alt}'],
    Progress: ['aria-valuenow={value}', 'aria-valuemin={0}', 'aria-valuemax={100}'],
  };
  return attrMap[componentName] || [];
}

/**
 * Main transformer: Convert archetype to complete component
 */
export function transformArchetypeToComponent(
  componentName: string,
  archetype: CompleteArchetype | null,
  options: TransformOptions = {}
): GeneratedComponent {
  const hookName = archetype?.hookName || `use${componentName}`;

  // Generate CSS
  const baseStyles = generateBaseStyles(
    componentName,
    archetype?.propRules || null,
    options
  );
  const stateStyles = generateStateStyles(
    componentName,
    archetype?.stateMappings || null,
    options
  );
  const variantStyles = generateVariantStyles(
    componentName,
    archetype?.variants || null,
    options
  );

  const css = [
    `/* ${componentName} Component Styles */`,
    `/* Generated from archetype: ${hookName} */`,
    '',
    '/* Base Styles */',
    baseStyles,
    '',
    '/* State Styles */',
    stateStyles,
    '',
    '/* Variant Styles */',
    variantStyles,
  ].join('\n');

  // Generate TSX
  const tsx = generateJSXFromStructure(
    componentName,
    archetype?.structure || null,
    archetype?.variants || null,
    options
  );

  return {
    name: componentName,
    tsx,
    css,
    hookName,
  };
}

/**
 * Transform multiple archetypes to components
 */
export function transformArchetypesToComponents(
  archetypes: Map<string, CompleteArchetype>,
  componentNames: string[],
  options: TransformOptions = {}
): GeneratedComponent[] {
  const components: GeneratedComponent[] = [];

  for (const componentName of componentNames) {
    // Find matching archetype
    const hookName = `use${componentName}`;
    const archetype = archetypes.get(hookName) || null;

    const component = transformArchetypeToComponent(componentName, archetype, options);
    components.push(component);
  }

  return components;
}
