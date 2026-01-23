/**
 * @tekton/headless-components
 *
 * Headless component hooks with accessibility and keyboard navigation
 * Zero styling - pure behavior and state management
 */

// Type exports
export type * from "./types/index.js";

// Utility exports
export { generateAriaProps, mergeAriaProps } from "./utils/aria.js";
export type { AriaPropsConfig } from "./utils/aria.js";
export {
  isKeyboardKey,
  handleKeyboardEvent,
  createKeyboardHandler,
} from "./utils/keyboard.js";
export { useUniqueId } from "./utils/id.js";

// Hook exports - Tier 1: Form Controls
export { useButton } from "./hooks/useButton.js";
export type { UseButtonProps, UseButtonReturn } from "./hooks/useButton.js";
export { useToggle } from "./hooks/useToggle.js";
export type { UseToggleProps, UseToggleReturn } from "./hooks/useToggle.js";
export { useInput } from "./hooks/useInput.js";
export type { UseInputProps, UseInputReturn } from "./hooks/useInput.js";
export { useCheckbox } from "./hooks/useCheckbox.js";
export type { UseCheckboxProps, UseCheckboxReturn } from "./hooks/useCheckbox.js";
export { useRadio, useRadioGroup } from "./hooks/useRadio.js";
export type {
  UseRadioProps,
  UseRadioReturn,
  UseRadioGroupProps,
  UseRadioGroupReturn,
} from "./hooks/useRadio.js";

// Hook exports - Tier 2: Complex Controls
export { useSelect } from "./hooks/useSelect.js";
export type {
  UseSelectProps,
  UseSelectReturn,
  SelectOption,
} from "./hooks/useSelect.js";
export { useTabs } from "./hooks/useTabs.js";
export type { UseTabsProps, UseTabsReturn, TabItem } from "./hooks/useTabs.js";
export { useBreadcrumb } from "./hooks/useBreadcrumb.js";
export type {
  UseBreadcrumbProps,
  UseBreadcrumbReturn,
  BreadcrumbItem,
} from "./hooks/useBreadcrumb.js";
export { usePagination } from "./hooks/usePagination.js";
export type {
  UsePaginationProps,
  UsePaginationReturn,
  PageItem,
} from "./hooks/usePagination.js";
export { useSlider } from "./hooks/useSlider.js";
export type { UseSliderProps, UseSliderReturn } from "./hooks/useSlider.js";

// Hook exports - Tier 3: Overlays & Dialogs
export { useModal } from "./hooks/useModal.js";
export type { UseModalProps, UseModalReturn } from "./hooks/useModal.js";
export { useTooltip } from "./hooks/useTooltip.js";
export type { UseTooltipProps, UseTooltipReturn } from "./hooks/useTooltip.js";
export { usePopover } from "./hooks/usePopover.js";
export type { UsePopoverProps, UsePopoverReturn } from "./hooks/usePopover.js";
export { useDropdownMenu } from "./hooks/useDropdownMenu.js";
export type {
  UseDropdownMenuProps,
  UseDropdownMenuReturn,
  MenuItem,
} from "./hooks/useDropdownMenu.js";
export { useAlert } from "./hooks/useAlert.js";
export type {
  UseAlertProps,
  UseAlertReturn,
  AlertVariant,
} from "./hooks/useAlert.js";

// Hook exports - Tier 4: Display Components
export { useCard } from "./hooks/useCard.js";
export type { UseCardProps, UseCardReturn } from "./hooks/useCard.js";
export { useAvatar } from "./hooks/useAvatar.js";
export type { UseAvatarProps, UseAvatarReturn } from "./hooks/useAvatar.js";
export { useBadge } from "./hooks/useBadge.js";
export type { UseBadgeProps, UseBadgeReturn } from "./hooks/useBadge.js";
export { useDivider } from "./hooks/useDivider.js";
export type { UseDividerProps, UseDividerReturn } from "./hooks/useDivider.js";
export { useProgress } from "./hooks/useProgress.js";
export type { UseProgressProps, UseProgressReturn } from "./hooks/useProgress.js";
