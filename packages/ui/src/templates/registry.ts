/**
 * @tekton/ui - Template Registry
 * SPEC-UI-001 Phase 3: Screen Template System Foundation
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: Singleton 패턴이 템플릿 레지스트리의 일관성을 보장
 * IMPACT: 레지스트리 중복 생성 시 템플릿 충돌 발생
 *
 * Singleton pattern for managing screen templates
 */

import type { ScreenTemplate, ScreenCategory, TemplateRegistryEntry } from './types';

/**
 * Template Registry (Singleton)
 *
 * Manages all screen templates in the application
 * Provides methods for registration, lookup, and search
 */
export class TemplateRegistry {
  private static instance: TemplateRegistry;
  private templates: Map<string, TemplateRegistryEntry>;

  private constructor() {
    this.templates = new Map();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): TemplateRegistry {
    if (!TemplateRegistry.instance) {
      TemplateRegistry.instance = new TemplateRegistry();
    }
    return TemplateRegistry.instance;
  }

  /**
   * Register a template
   */
  public register(template: ScreenTemplate): void {
    if (this.templates.has(template.id)) {
      console.warn(`Template "${template.id}" is already registered. Overwriting.`);
    }

    this.templates.set(template.id, {
      template,
      metadata: {
        usageCount: 0,
      },
    });
  }

  /**
   * Register multiple templates
   */
  public registerMany(templates: ScreenTemplate[]): void {
    templates.forEach(template => this.register(template));
  }

  /**
   * Get template by ID
   */
  public get(id: string): ScreenTemplate | undefined {
    const entry = this.templates.get(id);
    if (entry) {
      entry.metadata.usageCount++;
      entry.metadata.lastUsed = new Date().toISOString();
      return entry.template;
    }
    return undefined;
  }

  /**
   * Get all templates
   */
  public getAll(): ScreenTemplate[] {
    return Array.from(this.templates.values()).map(entry => entry.template);
  }

  /**
   * Get templates by category
   */
  public getByCategory(category: ScreenCategory): ScreenTemplate[] {
    return this.getAll().filter(template => template.category === category);
  }

  /**
   * Find templates by required components
   * Returns templates that include ALL specified components
   */
  public findByRequiredComponents(components: string[]): ScreenTemplate[] {
    return this.getAll().filter(template => {
      return components.every(component => template.requiredComponents.includes(component));
    });
  }

  /**
   * Search templates by keyword
   * Searches in: id, name, description, tags
   */
  public search(keyword: string): ScreenTemplate[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.getAll().filter(template => {
      return (
        template.id.toLowerCase().includes(lowerKeyword) ||
        template.name.toLowerCase().includes(lowerKeyword) ||
        template.description.toLowerCase().includes(lowerKeyword) ||
        template.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword))
      );
    });
  }

  /**
   * Get template metadata
   */
  public getMetadata(id: string): TemplateRegistryEntry['metadata'] | undefined {
    return this.templates.get(id)?.metadata;
  }

  /**
   * Get most used templates
   */
  public getMostUsed(limit: number = 10): ScreenTemplate[] {
    return Array.from(this.templates.values())
      .sort((a, b) => b.metadata.usageCount - a.metadata.usageCount)
      .slice(0, limit)
      .map(entry => entry.template);
  }

  /**
   * Get recently used templates
   */
  public getRecentlyUsed(limit: number = 10): ScreenTemplate[] {
    return Array.from(this.templates.values())
      .filter(entry => entry.metadata.lastUsed)
      .sort((a, b) => {
        const dateA = new Date(a.metadata.lastUsed!).getTime();
        const dateB = new Date(b.metadata.lastUsed!).getTime();
        return dateB - dateA;
      })
      .slice(0, limit)
      .map(entry => entry.template);
  }

  /**
   * Clear all templates
   */
  public clear(): void {
    this.templates.clear();
  }

  /**
   * Get template count
   */
  public count(): number {
    return this.templates.size;
  }

  /**
   * Check if template exists
   */
  public has(id: string): boolean {
    return this.templates.has(id);
  }

  /**
   * Remove template
   */
  public remove(id: string): boolean {
    return this.templates.delete(id);
  }
}

/**
 * Export singleton instance
 */
export const templateRegistry = TemplateRegistry.getInstance();
