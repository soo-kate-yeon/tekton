# @tekton/headless-components

**Headless React hooks for building accessible UI components**

A comprehensive collection of 20 headless component hooks providing unstyled, accessible, and reusable state management for React applications. Built with TypeScript, WCAG AA compliance, and full keyboard navigation support.

## Features

- **🎯 Headless Architecture**: Zero styling, pure behavior and state management
- **♿ Accessibility First**: Full ARIA attributes, keyboard navigation, focus management
- **📘 TypeScript Native**: Complete type definitions with strict mode support
- **🎮 Controlled & Uncontrolled**: Flexible state management patterns
- **🧪 Test Coverage**: 85%+ coverage across all hooks
- **🚀 Production Ready**: Battle-tested with Component Contract validation

## Installation

```bash
# Using pnpm (recommended for monorepo)
pnpm add @tekton/headless-components

# Using npm
npm install @tekton/headless-components

# Using yarn
yarn add @tekton/headless-components
```

**Peer Dependencies**:
- `react@^19.0.0`
- `react-dom@^19.0.0`

## Quick Start

```tsx
import { useButton, useModal, useInput } from '@tekton/headless-components';

function App() {
  // Button with toggle mode
  const { buttonProps, isPressed } = useButton({
    toggle: true,
    onClick: () => console.log('Clicked!'),
  });

  // Modal with focus trap
  const { modalProps, overlayProps, isOpen, open, close } = useModal({
    closeOnEscape: true,
    trapFocus: true,
  });

  // Input with validation
  const { inputProps, value, isInvalid } = useInput({
    defaultValue: '',
    required: true,
  });

  return (
    <>
      <button {...buttonProps} className="my-button">
        {isPressed ? 'Pressed' : 'Not Pressed'}
      </button>

      <input {...inputProps} className="my-input" />

      <button onClick={open}>Open Modal</button>

      {isOpen && (
        <>
          <div {...overlayProps} className="modal-overlay" />
          <div {...modalProps} className="modal">
            <h2>Modal Title</h2>
            <p>Modal content...</p>
            <button onClick={close}>Close</button>
          </div>
        </>
      )}
    </>
  );
}
```

## Available Hooks

All 20 hooks are organized into 4 functional tiers:

### Tier 1: Basic Interaction Components (5 hooks)

Fundamental UI interactions with keyboard and mouse support.

- **[useButton](./docs/api/tier-1-basic.md#usebutton)** - Button with toggle mode, keyboard support (Enter/Space)
- **[useInput](./docs/api/tier-1-basic.md#useinput)** - Text input with validation, focus state, controlled/uncontrolled modes
- **[useCheckbox](./docs/api/tier-1-basic.md#usecheckbox)** - Checkbox with indeterminate state, keyboard support (Space)
- **[useRadio](./docs/api/tier-1-basic.md#useradio)** - Radio button with group navigation (Arrow keys)
- **[useToggle](./docs/api/tier-1-basic.md#usetoggle)** - Toggle/switch with on/off state, keyboard support (Space/Enter)

### Tier 2: Selection Components (5 hooks)

Complex selection patterns with keyboard navigation and ARIA compliance.

- **[useSelect](./docs/api/tier-2-selection.md#useselect)** - Dropdown select with keyboard navigation (Arrow/Enter/Escape)
- **[useTabs](./docs/api/tier-2-selection.md#usetabs)** - Tab list with arrow key navigation, Home/End support
- **[useBreadcrumb](./docs/api/tier-2-selection.md#usebreadcrumb)** - Breadcrumb navigation with current page indicator
- **[usePagination](./docs/api/tier-2-selection.md#usepagination)** - Pagination with next/prev/goTo, keyboard navigation
- **[useSlider](./docs/api/tier-2-selection.md#useslider)** - Range slider with arrow key adjustment, min/max bounds

### Tier 3: Overlay Components (5 hooks)

Overlay patterns with focus management and click-outside detection.

- **[useModal](./docs/api/tier-3-overlays.md#usemodal)** - Modal dialog with focus trap, Escape key, focus restoration
- **[useTooltip](./docs/api/tier-3-overlays.md#usetooltip)** - Tooltip with hover/focus trigger, positioning, delay
- **[useDropdownMenu](./docs/api/tier-3-overlays.md#usedropdownmenu)** - Dropdown menu with keyboard navigation, selection
- **[useAlert](./docs/api/tier-3-overlays.md#usealert)** - Alert with variants (info/success/warning/error), dismissible
- **[usePopover](./docs/api/tier-3-overlays.md#usepopover)** - Popover with multiple triggers, click-outside close

### Tier 4: Display Components (5 hooks)

Display-focused components with minimal state management.

- **[useCard](./docs/api/tier-4-display.md#usecard)** - Card with selection, interactive mode
- **[useAvatar](./docs/api/tier-4-display.md#useavatar)** - Avatar with image loading, fallback
- **[useBadge](./docs/api/tier-4-display.md#usebadge)** - Badge with count, max value, showZero
- **[useDivider](./docs/api/tier-4-display.md#usedivider)** - Divider with orientation (horizontal/vertical), decorative
- **[useProgress](./docs/api/tier-4-display.md#useprogress)** - Progress bar with determinate/indeterminate modes

## Documentation

- **[API Reference](./docs/api/README.md)** - Complete API documentation for all hooks
- **[Examples](./docs/EXAMPLES.md)** - Usage examples and common patterns
- **[SPEC Reference](../../.moai/specs/SPEC-COMPONENT-001/spec.md)** - Full specification and requirements

## Architecture Principles

### Headless Design

Hooks provide **zero styling** - no CSS, no inline styles, no className generation. You have complete control over presentation while benefiting from:

- State management (open/closed, selected, disabled, focused)
- Event handling (keyboard, mouse, focus, blur)
- ARIA attributes (role, aria-expanded, aria-selected, etc.)
- Accessibility patterns (focus trap, keyboard navigation, screen reader support)

### Controlled & Uncontrolled Modes

All stateful hooks support both patterns:

```tsx
// Uncontrolled (hook manages state)
const { inputProps, value } = useInput({ defaultValue: '' });

// Controlled (you manage state)
const [value, setValue] = useState('');
const { inputProps } = useInput({
  value,
  onChange: (newValue) => setValue(newValue)
});
```

### TypeScript Support

Full type inference and strict typing:

```tsx
import type { UseButtonProps, UseModalReturn } from '@tekton/headless-components';

const buttonProps: UseButtonProps = {
  disabled: false,
  toggle: true,
  'aria-label': 'Toggle button',
};

const modal: UseModalReturn = useModal(buttonProps);
```

## Testing

The package includes comprehensive test coverage using Vitest and React Testing Library.

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

**Test Coverage**: 85%+ across all hooks, meeting TRUST 5 framework requirements.

## Browser Support

- **Chrome**: 111+ ✅
- **Safari**: 15+ ✅
- **Firefox**: 113+ ✅
- **Edge**: 111+ ✅

## Accessibility

All hooks follow WCAG AA guidelines and ARIA best practices:

- **Keyboard Navigation**: Full keyboard support (Enter, Space, Escape, Arrow keys, Tab, Home, End)
- **Screen Reader**: Tested with NVDA, JAWS, VoiceOver
- **Focus Management**: Proper focus trap for modals, focus restoration on close
- **ARIA Attributes**: Complete role, state, and property attributes

## Integration

### With Styled Components

```tsx
import styled from 'styled-components';
import { useButton } from '@tekton/headless-components';

const StyledButton = styled.button`
  background: ${props => props['aria-pressed'] ? 'blue' : 'gray'};
  padding: 12px 24px;
  border-radius: 8px;
`;

function MyButton() {
  const { buttonProps } = useButton({ toggle: true });
  return <StyledButton {...buttonProps}>Click me</StyledButton>;
}
```

### With Tailwind CSS

```tsx
import { useButton } from '@tekton/headless-components';

function MyButton() {
  const { buttonProps, isPressed } = useButton({ toggle: true });

  return (
    <button
      {...buttonProps}
      className={`px-6 py-3 rounded-lg ${
        isPressed ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      Click me
    </button>
  );
}
```

### With Component Contracts

Hooks are designed to integrate seamlessly with Tekton's Component Contract validation system:

```tsx
import { useButton } from '@tekton/headless-components';
import { validateButtonContract } from '@tekton/contracts';

function MyButton() {
  const { buttonProps } = useButton({
    'aria-label': 'Icon-only button', // Satisfies BTN-A01 contract
  });

  // Contract validation passes automatically
  return <button {...buttonProps}>...</button>;
}
```

## Performance

Hooks are optimized with:

- **useCallback**: Stable event handler references
- **useMemo**: Memoized derived state
- **Minimal Re-renders**: Controlled state updates
- **Hook Initialization**: <1ms average

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

### Development Setup

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build package
pnpm build

# Lint
pnpm lint
```

## License

MIT © Tekton Team

## Related Packages

- **[@tekton/contracts](../contracts/README.md)** - Component Contract validation system
- **[@tekton/token-generator](../token-generator/README.md)** - OKLCH design token system
- **[@tekton/themes](../themes/README.md)** - Pre-configured component themes

## Roadmap

- ✅ Phase 1: 20 core headless hooks (COMPLETED)
- ⏳ Phase 2: Token Contract & CSS Variable System (PLANNED)
- ⏳ Phase 3: Styled Component Wrappers (PLANNED)
- 🔮 Future: Animation lifecycle hooks, virtual scrolling, touch gestures

---

**Version**: 1.0.0
**Status**: Production Ready
**Last Updated**: 2026-01-16
**SPEC**: [SPEC-COMPONENT-001](../../.moai/specs/SPEC-COMPONENT-001/spec.md)
