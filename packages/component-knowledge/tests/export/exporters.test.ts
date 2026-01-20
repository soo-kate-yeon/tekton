import { describe, it, expect } from 'vitest';
import { JSONExporter } from '../../src/export/json-exporter';
import { MarkdownExporter } from '../../src/export/markdown-exporter';
import { Layer3RegistryBuilder } from '../../src/export/registry-builder';
import { getAllComponents } from '../../src/catalog/component-catalog';

describe('JSONExporter', () => {
  const exporter = new JSONExporter();

  it('should export component catalog as JSON', () => {
    const components = getAllComponents();
    const json = exporter.exportCatalog(components);

    expect(json.schemaVersion).toBe('2.0.0');
    expect(json.generatedAt).toBeDefined();
    expect(Object.keys(json.components)).toHaveLength(20);
  });

  it('should include all component metadata', () => {
    const components = getAllComponents();
    const json = exporter.exportCatalog(components);

    const button = json.components['Button'];
    expect(button.name).toBe('Button');
    expect(button.type).toBe('atom');
    expect(button.category).toBe('action');
    expect(button.slotAffinity).toBeDefined();
    expect(button.semanticDescription).toBeDefined();
  });

  it('should be valid JSON', () => {
    const components = getAllComponents();
    const json = exporter.exportCatalog(components);
    const jsonString = JSON.stringify(json);

    expect(() => JSON.parse(jsonString)).not.toThrow();
  });
});

describe('MarkdownExporter', () => {
  const exporter = new MarkdownExporter();

  it('should export component catalog as Markdown', () => {
    const components = getAllComponents();
    const markdown = exporter.exportCatalog(components);

    expect(markdown).toContain('# Component Knowledge Catalog');
    expect(markdown).toContain('## Button');
    expect(markdown).toContain('## Input');
  });

  it('should include slot affinity tables', () => {
    const components = getAllComponents();
    const markdown = exporter.exportCatalog(components);

    expect(markdown).toContain('### Slot Affinity');
    expect(markdown).toContain('| Slot | Affinity |');
  });

  it('should include semantic descriptions', () => {
    const components = getAllComponents();
    const markdown = exporter.exportCatalog(components);

    expect(markdown).toContain('**Purpose:**');
    expect(markdown).toContain('**Visual Impact:**');
    expect(markdown).toContain('**Complexity:**');
  });

  it('should include constraints', () => {
    const components = getAllComponents();
    const markdown = exporter.exportCatalog(components);

    expect(markdown).toContain('### Constraints');
  });

  it('should format affinity recommendations', () => {
    const components = getAllComponents();
    const markdown = exporter.exportCatalog(components);

    // Check for recommendation levels based on affinity scores
    expect(markdown).toMatch(/Highly Recommended|Recommended|Suitable|Not Recommended/);
  });
});

describe('Layer3RegistryBuilder', () => {
  const builder = new Layer3RegistryBuilder();

  it('should build Layer 3 registry with schema version 2.0.0', () => {
    const components = getAllComponents();
    const registry = builder.buildRegistry(components);

    expect(registry.schemaVersion).toBe('2.0.0');
    expect(registry.generatedAt).toBeDefined();
  });

  it('should include component metadata for all 20 components', () => {
    const components = getAllComponents();
    const registry = builder.buildRegistry(components);

    expect(Object.keys(registry.components)).toHaveLength(20);
  });

  it('should include Zod schemas for each component', () => {
    const components = getAllComponents();
    const registry = builder.buildRegistry(components);

    const button = registry.components['Button'];
    expect(button.zodSchema).toBeDefined();
    expect(button.propsType).toBe('ButtonProps');
  });

  it('should include CSS bindings for each component', () => {
    const components = getAllComponents();
    const registry = builder.buildRegistry(components);

    const button = registry.components['Button'];
    expect(button.cssBindings).toBeDefined();
    expect(button.cssBindings.vanillaExtract).toBeDefined();
  });

  it('should include all states for each component', () => {
    const components = getAllComponents();
    const registry = builder.buildRegistry(components);

    const button = registry.components['Button'];
    expect(button.states).toContain('default');
    expect(button.states).toContain('hover');
    expect(button.states).toContain('focus');
    expect(button.states).toContain('active');
    expect(button.states).toContain('disabled');
  });

  it('should include token references for each component', () => {
    const components = getAllComponents();
    const registry = builder.buildRegistry(components);

    const button = registry.components['Button'];
    expect(button.tokenReferences).toBeDefined();
    expect(Array.isArray(button.tokenReferences)).toBe(true);
    expect(button.tokenReferences.length).toBeGreaterThan(0);
  });

  it('should include standard slots definition', () => {
    const components = getAllComponents();
    const registry = builder.buildRegistry(components);

    expect(registry.standardSlots).toBeDefined();
    expect(Array.isArray(registry.standardSlots)).toBe(true);
    expect(registry.standardSlots.length).toBeGreaterThan(0);
  });
});
