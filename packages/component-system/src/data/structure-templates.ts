/**
 * Structure Templates Data
 * HTML/JSX templates and accessibility rules for all 20 headless hooks
 *
 * @module data/structure-templates
 */

import type { StructureTemplate } from '../schemas/structure-template.js';
import structureTemplatesRaw from './structure-templates.json' with { type: 'json' };

/**
 * Structure templates data for all 20 hooks
 * Defines HTML/JSX patterns and accessibility requirements for each hook
 */
export const structureTemplatesData: StructureTemplate[] =
  structureTemplatesRaw.templates as StructureTemplate[];

/**
 * Get structure template by hook name
 */
export function getStructureTemplateByHook(hookName: string): StructureTemplate | undefined {
  return structureTemplatesData.find((template) => template.hookName === hookName);
}

/**
 * Get all templates with nested structures (complex components)
 */
export function getComplexTemplates(): StructureTemplate[] {
  return structureTemplatesData.filter((template) => template.nestedStructure !== undefined);
}

/**
 * Get all templates with specific WCAG level
 */
export function getTemplatesByWCAGLevel(level: 'A' | 'AA' | 'AAA'): StructureTemplate[] {
  return structureTemplatesData.filter((template) => template.accessibility.wcagLevel === level);
}

/**
 * Get all templates that require specific keyboard navigation
 */
export function getTemplatesWithKeyboardNav(key: string): StructureTemplate[] {
  return structureTemplatesData.filter((template) =>
    template.accessibility.keyboardNavigation.some((nav) => nav.key === key)
  );
}
