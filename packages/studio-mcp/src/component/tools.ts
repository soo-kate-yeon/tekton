/**
 * Archetype MCP Tools
 * Tool handlers that wrap archetype-system data for MCP exposure
 *
 * @module archetype/tools
 */

import type {
  HookPropRule,
  StateStyleMapping,
  VariantBranching,
  StructureTemplate,
} from "@tekton/component-system";

/**
 * Complete archetype data for a hook
 */
export interface CompleteArchetype {
  hookName: string;
  propRules: HookPropRule | null;
  stateMappings: StateStyleMapping | null;
  variants: VariantBranching | null;
  structure: StructureTemplate | null;
}

/**
 * Query criteria for searching archetypes
 */
export interface ArchetypeQueryCriteria {
  wcagLevel?: "A" | "AA" | "AAA";
  stateName?: string;
  hasVariant?: string;
  propObject?: string;
}

/**
 * Tool result wrapper
 */
export interface ToolResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Archetype Tools - provides MCP tool implementations
 */
export class ArchetypeTools {
  private propRules: HookPropRule[] = [];
  private stateMappings: StateStyleMapping[] = [];
  private variants: VariantBranching[] = [];
  private structures: StructureTemplate[] = [];
  private initialized = false;

  /**
   * Initialize tools with archetype data
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Dynamic import to handle module resolution
      const componentData = await import("@tekton/component-system/data");

      this.propRules = componentData.hookPropRulesData || [];
      this.stateMappings = componentData.stateStyleMappingsData || [];
      this.variants = componentData.variantBranchingData || [];
      this.structures = componentData.structureTemplatesData || [];

      this.initialized = true;
    } catch (error) {
      console.error("Failed to load archetype data:", error);
      // Initialize with empty arrays if import fails
      this.initialized = true;
    }
  }

  /**
   * List all available hooks
   */
  async list(): Promise<ToolResult<string[]>> {
    await this.initialize();

    const hookNames = new Set<string>();

    this.propRules.forEach((r) => hookNames.add(r.hookName));
    this.stateMappings.forEach((m) => hookNames.add(m.hookName));
    this.variants.forEach((v) => hookNames.add(v.hookName));
    this.structures.forEach((s) => hookNames.add(s.hookName));

    return {
      success: true,
      data: Array.from(hookNames).sort(),
    };
  }

  /**
   * Get complete archetype for a hook
   */
  async get(hookName: string): Promise<ToolResult<CompleteArchetype>> {
    await this.initialize();

    const propRules = this.propRules.find((r) => r.hookName === hookName) || null;
    const stateMappings =
      this.stateMappings.find((m) => m.hookName === hookName) || null;
    const variants = this.variants.find((v) => v.hookName === hookName) || null;
    const structure =
      this.structures.find((s) => s.hookName === hookName) || null;

    if (!propRules && !stateMappings && !variants && !structure) {
      return {
        success: false,
        error: `Archetype not found: ${hookName}`,
      };
    }

    return {
      success: true,
      data: {
        hookName,
        propRules,
        stateMappings,
        variants,
        structure,
      },
    };
  }

  /**
   * Get Layer 1: Hook Prop Rules
   */
  async getPropRules(hookName: string): Promise<ToolResult<HookPropRule>> {
    await this.initialize();

    const rules = this.propRules.find((r) => r.hookName === hookName);

    if (!rules) {
      return {
        success: false,
        error: `Prop rules not found for: ${hookName}`,
      };
    }

    return {
      success: true,
      data: rules,
    };
  }

  /**
   * Get Layer 2: State-Style Mappings
   */
  async getStateMappings(
    hookName: string,
  ): Promise<ToolResult<StateStyleMapping>> {
    await this.initialize();

    const mappings = this.stateMappings.find((m) => m.hookName === hookName);

    if (!mappings) {
      return {
        success: false,
        error: `State mappings not found for: ${hookName}`,
      };
    }

    return {
      success: true,
      data: mappings,
    };
  }

  /**
   * Get Layer 3: Variant Branching
   */
  async getVariants(hookName: string): Promise<ToolResult<VariantBranching>> {
    await this.initialize();

    const variants = this.variants.find((v) => v.hookName === hookName);

    if (!variants) {
      return {
        success: false,
        error: `Variants not found for: ${hookName}`,
      };
    }

    return {
      success: true,
      data: variants,
    };
  }

  /**
   * Get Layer 4: Structure Templates
   */
  async getStructure(hookName: string): Promise<ToolResult<StructureTemplate>> {
    await this.initialize();

    const structure = this.structures.find((s) => s.hookName === hookName);

    if (!structure) {
      return {
        success: false,
        error: `Structure not found for: ${hookName}`,
      };
    }

    return {
      success: true,
      data: structure,
    };
  }

  /**
   * Query archetypes by criteria
   */
  async query(
    criteria: ArchetypeQueryCriteria,
  ): Promise<ToolResult<CompleteArchetype[]>> {
    await this.initialize();

    const results: CompleteArchetype[] = [];
    const hookNames = new Set<string>();

    // Collect all hook names
    this.propRules.forEach((r) => hookNames.add(r.hookName));
    this.stateMappings.forEach((m) => hookNames.add(m.hookName));
    this.variants.forEach((v) => hookNames.add(v.hookName));
    this.structures.forEach((s) => hookNames.add(s.hookName));

    for (const hookName of hookNames) {
      const propRules =
        this.propRules.find((r) => r.hookName === hookName) || null;
      const stateMappings =
        this.stateMappings.find((m) => m.hookName === hookName) || null;
      const variants =
        this.variants.find((v) => v.hookName === hookName) || null;
      const structure =
        this.structures.find((s) => s.hookName === hookName) || null;

      let matches = true;

      // Filter by WCAG level
      if (criteria.wcagLevel && structure) {
        matches = matches && structure.accessibility.wcagLevel === criteria.wcagLevel;
      }

      // Filter by state name
      if (criteria.stateName && stateMappings) {
        matches =
          matches &&
          stateMappings.states.some((s) => s.stateName === criteria.stateName);
      }

      // Filter by variant
      if (criteria.hasVariant && variants) {
        matches =
          matches &&
          variants.configurationOptions.some(
            (o) => o.optionName === criteria.hasVariant,
          );
      }

      // Filter by prop object
      if (criteria.propObject && propRules) {
        matches =
          matches && propRules.propObjects.includes(criteria.propObject);
      }

      if (matches) {
        results.push({
          hookName,
          propRules,
          stateMappings,
          variants,
          structure,
        });
      }
    }

    return {
      success: true,
      data: results,
    };
  }

  /**
   * Get all prop rules
   */
  async getAllPropRules(): Promise<ToolResult<HookPropRule[]>> {
    await this.initialize();
    return {
      success: true,
      data: this.propRules,
    };
  }

  /**
   * Get all state mappings
   */
  async getAllStateMappings(): Promise<ToolResult<StateStyleMapping[]>> {
    await this.initialize();
    return {
      success: true,
      data: this.stateMappings,
    };
  }

  /**
   * Get all variants
   */
  async getAllVariants(): Promise<ToolResult<VariantBranching[]>> {
    await this.initialize();
    return {
      success: true,
      data: this.variants,
    };
  }

  /**
   * Get all structures
   */
  async getAllStructures(): Promise<ToolResult<StructureTemplate[]>> {
    await this.initialize();
    return {
      success: true,
      data: this.structures,
    };
  }
}

// Export singleton instance
export const archetypeTools = new ArchetypeTools();
