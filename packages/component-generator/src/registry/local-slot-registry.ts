/**
 * Local Slot Registry
 * Manages component-specific slots
 * SPEC-LAYER3-001 Phase 1
 */

import type {
  LocalSlotType,
  SlotDefinition,
  SlotRole,
  SlotConstraints,
} from '../types/slot-types';

/**
 * Registry for local component-specific slots
 */
export class LocalSlotRegistry {
  private slots: Map<LocalSlotType, SlotDefinition>;

  constructor() {
    this.slots = new Map<LocalSlotType, SlotDefinition>([
      [
        'card_actions',
        {
          name: 'card_actions',
          scope: 'local',
          role: 'action',
          parentComponent: 'Card',
          constraints: {
            maxChildren: 5,
            allowedComponents: ['Button', 'Link', 'Icon'],
          },
        },
      ],
      [
        'table_toolbar',
        {
          name: 'table_toolbar',
          scope: 'local',
          role: 'action',
          parentComponent: 'DataTable',
          constraints: {
            maxChildren: 8,
            allowedComponents: ['Button', 'SearchInput', 'FilterDropdown'],
          },
        },
      ],
      [
        'modal_footer',
        {
          name: 'modal_footer',
          scope: 'local',
          role: 'action',
          parentComponent: 'Modal',
          constraints: {
            maxChildren: 4,
            allowedComponents: ['Button'],
          },
        },
      ],
    ]);
  }

  /**
   * Get a specific local slot definition
   */
  getSlot(name: LocalSlotType): SlotDefinition {
    const slot = this.slots.get(name);
    if (!slot) {
      throw new Error(`Local slot '${name}' not found`);
    }
    return slot;
  }

  /**
   * Get all local slot definitions
   */
  getAllSlots(): SlotDefinition[] {
    return Array.from(this.slots.values());
  }

  /**
   * Check if a local slot exists
   */
  hasSlot(name: LocalSlotType): boolean {
    return this.slots.has(name);
  }

  /**
   * Get slots for a specific parent component
   */
  getSlotsByParent(parentComponent: string): SlotDefinition[] {
    return this.getAllSlots().filter(
      slot => slot.parentComponent === parentComponent
    );
  }

  /**
   * Get the role of a local slot
   */
  getSlotRole(name: LocalSlotType): SlotRole {
    return this.getSlot(name).role;
  }

  /**
   * Get the constraints of a local slot
   */
  getSlotConstraints(name: LocalSlotType): SlotConstraints | undefined {
    return this.getSlot(name).constraints;
  }
}
