import fs from 'fs-extra';
import * as path from 'path';
import type { CompleteArchetype } from '../clients/mcp-client.js';
import type { ExtendedTokenPreset } from '@tekton/theme';
import { generateCompleteTokensCSS } from './token-injector.js';
import { generateComponentFiles } from './component-generator.js';

/**
 * Screen generation options
 */
export interface ScreenGenerationOptions {
  name: string;
  environment: string;
  skeleton: string;
  intent: string;
  components: string[];
  outputDir: string;
  overwrite?: boolean;
  rename?: string;
  archetypes?: Map<string, CompleteArchetype>;
  tokens?: ExtendedTokenPreset;
}

/**
 * Screen generation result
 */
export interface ScreenGenerationResult {
  success: boolean;
  message?: string;
  files?: {
    page: string;
    layout: string;
    components: string;
    tokens?: string;
  };
  stats?: {
    componentsGenerated: number;
    archetypesApplied: number;
    tokenVariables: number;
  };
  error?: string;
}

/**
 * Check if screen already exists
 */
export async function checkDuplicateScreen(
  screenName: string,
  outputDir: string
): Promise<boolean> {
  const screenDir = path.join(outputDir, 'src', 'screens', screenName);
  return await fs.pathExists(screenDir);
}

/**
 * Layout templates based on skeleton type
 */
const SKELETON_LAYOUTS: Record<string, {
  header: boolean;
  sidebar: boolean;
  footer: boolean;
  contentClass: string;
}> = {
  'full-screen': { header: false, sidebar: false, footer: false, contentClass: 'full-screen' },
  'with-header': { header: true, sidebar: false, footer: false, contentClass: 'with-header' },
  'with-sidebar': { header: false, sidebar: true, footer: false, contentClass: 'with-sidebar' },
  'dashboard': { header: true, sidebar: true, footer: false, contentClass: 'dashboard' },
  'with-footer': { header: true, sidebar: false, footer: true, contentClass: 'with-footer' },
  'complete': { header: true, sidebar: true, footer: true, contentClass: 'complete' },
};

/**
 * Intent-based content patterns
 */
const INTENT_CONTENT_PATTERNS: Record<string, {
  layout: string;
  primaryAreas: string[];
}> = {
  'data-list': {
    layout: 'list',
    primaryAreas: ['filters', 'table', 'pagination'],
  },
  'form': {
    layout: 'form',
    primaryAreas: ['form-fields', 'actions'],
  },
  'dashboard': {
    layout: 'grid',
    primaryAreas: ['stats', 'charts', 'tables'],
  },
  'detail': {
    layout: 'detail',
    primaryAreas: ['header', 'content', 'sidebar'],
  },
  'settings': {
    layout: 'settings',
    primaryAreas: ['navigation', 'content'],
  },
  'landing': {
    layout: 'landing',
    primaryAreas: ['hero', 'features', 'cta'],
  },
  'auth': {
    layout: 'centered',
    primaryAreas: ['form'],
  },
  'error': {
    layout: 'centered',
    primaryAreas: ['message', 'actions'],
  },
  'empty': {
    layout: 'centered',
    primaryAreas: ['illustration', 'message', 'action'],
  },
};

/**
 * Generate page.tsx template
 */
function generatePageTemplate(options: ScreenGenerationOptions): string {
  const { name, environment, intent, components } = options;

  const componentImports = components.length > 0
    ? `import { ${components.join(', ')} } from './components';\n`
    : '';

  const intentPattern = INTENT_CONTENT_PATTERNS[intent] || INTENT_CONTENT_PATTERNS['dashboard'];
  const layoutClass = `${name.toLowerCase()}-screen ${name.toLowerCase()}-screen--${intentPattern.layout}`;

  // Generate intent-specific content structure
  const contentStructure = generateIntentContent(name, intent, components);

  return `import './tokens.css';
${componentImports}
/**
 * ${name} Screen
 * Environment: ${environment}
 * Intent: ${intent}
 */
export default function ${name}() {
  return (
    <main className="${layoutClass}">
      <h1 className="${name.toLowerCase()}-screen__title">${formatTitle(name)}</h1>
      ${contentStructure}
    </main>
  );
}
`;
}

/**
 * Generate intent-specific content structure
 */
function generateIntentContent(name: string, intent: string, components: string[]): string {
  const baseClass = name.toLowerCase();

  switch (intent) {
    case 'dashboard':
      return `
      {/* Stats Section */}
      <section className="${baseClass}__stats">
        {${components.includes('Stat') ? '/* <Stat label="Users" value={1234} /> */' : '/* Stats go here */'}}
      </section>

      {/* Charts Section */}
      <section className="${baseClass}__charts">
        {${components.includes('Chart') ? '/* <Chart data={chartData} /> */' : '/* Charts go here */'}}
      </section>

      {/* Data Table Section */}
      <section className="${baseClass}__data">
        {${components.includes('Table') ? '/* <Table data={tableData} /> */' : '/* Data table goes here */'}}
      </section>`;

    case 'data-list':
      return `
      {/* Filters */}
      <section className="${baseClass}__filters">
        {/* Filter controls */}
      </section>

      {/* Data Table */}
      <section className="${baseClass}__table">
        {${components.includes('Table') ? '/* <Table data={data} /> */' : '/* Table goes here */'}}
      </section>

      {/* Pagination */}
      <section className="${baseClass}__pagination">
        {/* Pagination controls */}
      </section>`;

    case 'form':
      return `
      {/* Form */}
      <form className="${baseClass}__form">
        {/* Form fields */}
        <div className="${baseClass}__actions">
          {${components.includes('Button') ? '/* <Button type="submit">Submit</Button> */' : '/* Submit button */'}}
        </div>
      </form>`;

    case 'detail':
      return `
      {/* Detail Header */}
      <header className="${baseClass}__header">
        {/* Title and metadata */}
      </header>

      {/* Main Content */}
      <article className="${baseClass}__content">
        {${components.includes('Card') ? '/* <Card>Content</Card> */' : '/* Content goes here */'}}
      </article>`;

    case 'settings':
      return `
      {/* Settings Navigation */}
      <nav className="${baseClass}__nav">
        {/* Settings menu */}
      </nav>

      {/* Settings Content */}
      <section className="${baseClass}__content">
        {/* Settings forms */}
      </section>`;

    default:
      return `
      {/* Main Content */}
      <section className="${baseClass}__content">
        {/* Screen content */}
      </section>`;
  }
}

/**
 * Format component name to title
 */
function formatTitle(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').trim();
}

/**
 * Generate layout.tsx template
 */
function generateLayoutTemplate(options: ScreenGenerationOptions): string {
  const { skeleton, environment } = options;
  const layout = SKELETON_LAYOUTS[skeleton] || SKELETON_LAYOUTS['dashboard'];

  // Determine grid columns based on environment
  const gridColumns = environment === 'mobile' ? 4 : 12;

  // Generate layout structure based on skeleton
  const layoutStructure = generateLayoutStructure(skeleton, layout);

  return `import { ReactNode } from 'react';
import './tokens.css';

/**
 * Layout Component
 * Skeleton: ${skeleton}
 * Environment: ${environment}
 */
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout layout--${skeleton}" style={{ '--grid-columns': ${gridColumns} } as React.CSSProperties}>
      ${layoutStructure}
    </div>
  );
}
`;
}

/**
 * Generate layout structure based on skeleton type
 */
function generateLayoutStructure(_skeleton: string, layout: typeof SKELETON_LAYOUTS[string]): string {
  const parts: string[] = [];

  if (layout.header) {
    parts.push(`{/* Header */}
      <header className="layout__header">
        <nav className="layout__nav">
          {/* Navigation */}
        </nav>
      </header>`);
  }

  if (layout.sidebar) {
    parts.push(`{/* Sidebar */}
      <aside className="layout__sidebar">
        {/* Sidebar content */}
      </aside>`);
  }

  parts.push(`{/* Main Content */}
      <main className="layout__main">
        {children}
      </main>`);

  if (layout.footer) {
    parts.push(`{/* Footer */}
      <footer className="layout__footer">
        {/* Footer content */}
      </footer>`);
  }

  return parts.join('\n\n      ');
}

/**
 * Generate components/index.ts template
 */
function generateComponentsIndex(components: string[]): string {
  if (components.length === 0) {
    return '// Component exports will be added here\nexport {};\n';
  }

  const exports = components
    .map((component) => `export { ${component} } from './${component}';`)
    .join('\n');

  return `${exports}\n`;
}

/**
 * Count CSS variables in tokens content
 */
function countTokenVariables(tokensContent: string): number {
  const matches = tokensContent.match(/--tekton-/g);
  return matches ? matches.length : 0;
}

/**
 * Generate screen files
 */
export async function generateScreenFiles(
  options: ScreenGenerationOptions
): Promise<ScreenGenerationResult> {
  try {
    // Use renamed screen name if provided
    const actualName = options.rename || options.name;

    // Check for duplicates (unless overwrite is true)
    const isDuplicate = await checkDuplicateScreen(actualName, options.outputDir);

    if (isDuplicate && options.overwrite === false) {
      return {
        success: false,
        error: 'Screen generation cancelled by user',
      };
    }

    // Create screen directory structure
    const screenDir = path.join(options.outputDir, 'src', 'screens', actualName);
    const componentsDir = path.join(screenDir, 'components');

    // Remove existing directory if overwriting
    if (isDuplicate && options.overwrite === true) {
      await fs.remove(screenDir);
    }

    await fs.ensureDir(componentsDir);

    const pagePath = path.join(screenDir, 'page.tsx');
    const layoutPath = path.join(screenDir, 'layout.tsx');
    const tokensPath = path.join(screenDir, 'tokens.css');
    const componentsIndexPath = path.join(componentsDir, 'index.ts');

    // Stats tracking
    let componentsGenerated = 0;
    let archetypesApplied = 0;
    let tokenVariables = 0;

    try {
      // Generate tokens.css
      const tokensContent = generateCompleteTokensCSS(options.tokens);
      tokenVariables = countTokenVariables(tokensContent);
      await fs.writeFile(tokensPath, tokensContent, 'utf-8');

      // Generate component files if components are specified
      if (options.components.length > 0) {
        const componentResult = await generateComponentFiles({
          outputDir: componentsDir,
          archetypes: options.archetypes,
          components: options.components,
          prefix: 'tekton',
          overwrite: options.overwrite,
        });

        componentsGenerated = componentResult.generated.length;

        // Count archetypes applied
        if (options.archetypes) {
          for (const component of options.components) {
            const hookName = `use${component}`;
            if (options.archetypes.has(hookName)) {
              archetypesApplied++;
            }
          }
        }
      } else {
        // Generate empty components index if no components
        const componentsIndexContent = generateComponentsIndex(options.components);
        await fs.writeFile(componentsIndexPath, componentsIndexContent, 'utf-8');
      }

      // Generate page and layout
      const pageContent = generatePageTemplate({ ...options, name: actualName });
      const layoutContent = generateLayoutTemplate({ ...options, name: actualName });

      await fs.writeFile(pagePath, pageContent, 'utf-8');
      await fs.writeFile(layoutPath, layoutContent, 'utf-8');

      return {
        success: true,
        message: `Screen "${actualName}" generated successfully`,
        files: {
          page: pagePath,
          layout: layoutPath,
          components: componentsIndexPath,
          tokens: tokensPath,
        },
        stats: {
          componentsGenerated,
          archetypesApplied,
          tokenVariables,
        },
      };
    } catch (error) {
      // Rollback on error
      await fs.remove(screenDir);
      throw error;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Screen generation failed',
    };
  }
}
