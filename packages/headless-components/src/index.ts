/**
 * @tekton/headless-components
 *
 * Headless component hooks with accessibility and keyboard navigation
 * Zero styling - pure behavior and state management
 */

// Type exports
export type * from './types';

// Utility exports
export { generateAriaProps, mergeAriaProps } from './utils/aria';
export type { AriaPropsConfig } from './utils/aria';
export { isKeyboardKey, handleKeyboardEvent, createKeyboardHandler } from './utils/keyboard';
export { useUniqueId } from './utils/id';

// Hook exports
export { useButton } from './hooks/useButton';
export type { UseButtonProps, UseButtonReturn } from './hooks/useButton';
export { useToggle } from './hooks/useToggle';
export type { UseToggleProps, UseToggleReturn } from './hooks/useToggle';

// More hooks to be added
// export { useInput } from './hooks/useInput';
// ...
