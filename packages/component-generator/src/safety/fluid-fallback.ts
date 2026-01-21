/**
 * Fluid Fallback
 * TAG: SPEC-LAYER3-001 Section 5.5.4
 *
 * Assigns appropriate fallback components based on slot roles
 */

import {
  FALLBACK_COMPONENTS,
  SCORE_THRESHOLD,
  type SlotRole,
  type FluidFallbackResult,
  type FallbackMetadata,
} from "./safety.types.js";

/**
 * FluidFallback - Assigns fallback components for low-quality placements
 * SPEC-LAYER3-001 Section 5.5.4
 */
export class FluidFallback {
  /**
   * Assign a fallback component based on slot role
   *
   * @param targetSlot - Target slot identifier
   * @param slotRole - Slot role for fallback selection
   * @param originalScore - Original score that triggered fallback (if any)
   * @param originalComponentName - Original component name if hallucinated (if any)
   * @returns Fluid fallback result with component and metadata
   */
  assignFallback(
    targetSlot: string,
    slotRole: SlotRole,
    originalScore?: number,
    originalComponentName?: string,
  ): FluidFallbackResult {
    const componentName = this.getFallbackComponent(slotRole);
    const reason = this.createFallbackReason(
      slotRole,
      originalScore,
      originalComponentName,
    );

    const metadata: FallbackMetadata = {
      _fallback: true,
      reason,
      originalScore,
      originalComponentName,
    };

    return {
      componentName,
      targetSlot,
      slotRole,
      metadata,
    };
  }

  /**
   * Get fallback component for a slot role
   *
   * @param slotRole - Slot role
   * @returns Fallback component name
   */
  getFallbackComponent(slotRole: SlotRole): string {
    return FALLBACK_COMPONENTS[slotRole];
  }

  /**
   * Check if metadata indicates a fallback component
   *
   * @param metadata - Metadata object to check
   * @returns True if metadata indicates fallback
   */
  isFallbackComponent(metadata: any): metadata is FallbackMetadata {
    return (
      typeof metadata === "object" &&
      metadata !== null &&
      metadata._fallback === true
    );
  }

  /**
   * Create fallback reason message
   *
   * @param slotRole - Slot role
   * @param originalScore - Original score (if any)
   * @param originalComponentName - Original component name (if any)
   * @returns Fallback reason message
   */
  createFallbackReason(
    slotRole: SlotRole,
    originalScore?: number,
    originalComponentName?: string,
  ): string {
    const fallbackComponent = FALLBACK_COMPONENTS[slotRole];
    const parts: string[] = [];

    if (originalComponentName) {
      parts.push(
        `Invalid component "${originalComponentName}" not found in catalog`,
      );
    }

    if (originalScore !== undefined) {
      parts.push(
        `Score below threshold (${originalScore} < ${SCORE_THRESHOLD})`,
      );
    }

    const issueDescription =
      parts.length > 0 ? parts.join(". ") : "Quality check failed";

    return `${issueDescription}. Assigning fallback component "${fallbackComponent}" for slot role "${slotRole}".`;
  }
}
