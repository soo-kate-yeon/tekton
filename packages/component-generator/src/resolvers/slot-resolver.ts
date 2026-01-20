/**
 * Slot Resolver
 * Unified access to global and local slot registries
 * SPEC-LAYER3-001 Phase 1
 */

import type {
  SlotType,
  SlotScope,
  SlotRole,
  SlotDefinition,
} from '../types/slot-types';
import type { GlobalSlotRegistry } from '../registry/global-slot-registry';
import type { LocalSlotRegistry } from '../registry/local-slot-registry';

/**
 * Resolver for slot definitions across global and local registries
 */
export class SlotResolver {
  constructor(
    private globalRegistry: GlobalSlotRegistry,
    private localRegistry: LocalSlotRegistry
  ) {}

  /**
   * Resolve a slot by name (checks both global and local registries)
   */
  resolveSlot(name: SlotType): SlotDefinition {
    // Try global registry first
    if (this.globalRegistry.hasSlot(name as any)) {
      return this.globalRegistry.getSlot(name as any);
    }

    // Try local registry
    if (this.localRegistry.hasSlot(name as any)) {
      return this.localRegistry.getSlot(name as any);
    }

    throw new Error(`Slot '${name}' not found in any registry`);
  }

  /**
   * Resolve all slots by scope
   */
  resolveSlotsByScope(scope: SlotScope): SlotDefinition[] {
    if (scope === 'global') {
      return this.globalRegistry.getAllSlots();
    }

    return this.localRegistry.getAllSlots();
  }

  /**
   * Resolve all slots by role
   */
  resolveSlotsByRole(role: SlotRole): SlotDefinition[] {
    const allSlots = this.getAllSlots();
    return allSlots.filter(slot => slot.role === role);
  }

  /**
   * Resolve slots by parent component (local slots only)
   */
  resolveSlotsByParent(parentComponent: string): SlotDefinition[] {
    return this.localRegistry.getSlotsByParent(parentComponent);
  }

  /**
   * Get all slots (global + local)
   */
  getAllSlots(): SlotDefinition[] {
    return [
      ...this.globalRegistry.getAllSlots(),
      ...this.localRegistry.getAllSlots(),
    ];
  }

  /**
   * Check if a slot exists
   */
  isSlotValid(name: SlotType): boolean {
    return (
      this.globalRegistry.hasSlot(name as any) ||
      this.localRegistry.hasSlot(name as any)
    );
  }

  /**
   * Get the scope type of a slot
   */
  getSlotType(name: SlotType): SlotScope | undefined {
    if (this.globalRegistry.hasSlot(name as any)) {
      return 'global';
    }

    if (this.localRegistry.hasSlot(name as any)) {
      return 'local';
    }

    return undefined;
  }
}
