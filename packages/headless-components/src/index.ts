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

// Hook exports - Tier 1: Form Controls
export { useButton } from './hooks/useButton';
export type { UseButtonProps, UseButtonReturn } from './hooks/useButton';
export { useToggle } from './hooks/useToggle';
export type { UseToggleProps, UseToggleReturn } from './hooks/useToggle';
export { useInput } from './hooks/useInput';
export type { UseInputProps, UseInputReturn } from './hooks/useInput';
export { useCheckbox } from './hooks/useCheckbox';
export type { UseCheckboxProps, UseCheckboxReturn } from './hooks/useCheckbox';
export { useRadio, useRadioGroup } from './hooks/useRadio';
export type { UseRadioProps, UseRadioReturn, UseRadioGroupProps, UseRadioGroupReturn } from './hooks/useRadio';

// Hook exports - Tier 2: Complex Controls
export { useSelect } from './hooks/useSelect';
export type { UseSelectProps, UseSelectReturn, SelectOption } from './hooks/useSelect';
export { useTabs } from './hooks/useTabs';
export type { UseTabsProps, UseTabsReturn, TabItem } from './hooks/useTabs';
export { useBreadcrumb } from './hooks/useBreadcrumb';
export type { UseBreadcrumbProps, UseBreadcrumbReturn, BreadcrumbItem } from './hooks/useBreadcrumb';
export { usePagination } from './hooks/usePagination';
export type { UsePaginationProps, UsePaginationReturn, PageItem } from './hooks/usePagination';
export { useSlider } from './hooks/useSlider';
export type { UseSliderProps, UseSliderReturn } from './hooks/useSlider';

// Hook exports - Tier 3: Overlays & Dialogs
export { useModal } from './hooks/useModal';
export type { UseModalProps, UseModalReturn } from './hooks/useModal';
export { useTooltip } from './hooks/useTooltip';
export type { UseTooltipProps, UseTooltipReturn } from './hooks/useTooltip';
export { usePopover } from './hooks/usePopover';
export type { UsePopoverProps, UsePopoverReturn } from './hooks/usePopover';
export { useDropdownMenu } from './hooks/useDropdownMenu';
export type { UseDropdownMenuProps, UseDropdownMenuReturn, MenuItem } from './hooks/useDropdownMenu';
export { useAlert } from './hooks/useAlert';
export type { UseAlertProps, UseAlertReturn, AlertVariant } from './hooks/useAlert';

// Hook exports - Tier 4: Display Components
export { useCard } from './hooks/useCard';
export type { UseCardProps, UseCardReturn } from './hooks/useCard';
export { useAvatar } from './hooks/useAvatar';
export type { UseAvatarProps, UseAvatarReturn } from './hooks/useAvatar';
export { useBadge } from './hooks/useBadge';
export type { UseBadgeProps, UseBadgeReturn } from './hooks/useBadge';
export { useDivider } from './hooks/useDivider';
export type { UseDividerProps, UseDividerReturn } from './hooks/useDivider';
export { useProgress } from './hooks/useProgress';
export type { UseProgressProps, UseProgressReturn } from './hooks/useProgress';
