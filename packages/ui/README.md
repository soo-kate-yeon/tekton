# @tekton/ui

Tekton UI Reference Component Library - High-quality, accessible React components with CSS Variables theming.

## Overview

@tekton/ui provides 20 production-ready components built with:

- **React 19** - Latest React features with Server Components support
- **TypeScript 5.7+** - Full type safety with strict mode
- **Radix UI v1.0+** - Accessible headless primitives
- **CSS Variables** - 3-layer architecture (Atomic → Semantic → Component)
- **WCAG 2.1 AA** - Fully accessible (98.93% test coverage)

## Installation

```bash
pnpm add @tekton/ui
# or
npm install @tekton/ui
# or
yarn add @tekton/ui
```

## Quick Start

### Import Components

```tsx
import { Button, Input, Card } from '@tekton/ui';
import '@tekton/ui/styles';

export default function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Tekton UI</CardTitle>
        <CardDescription>Build accessible UIs faster</CardDescription>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter your email..." />
      </CardContent>
      <CardFooter>
        <Button variant="primary">Get Started</Button>
      </CardFooter>
    </Card>
  );
}
```

### CSS Variables Theming

Import the CSS Variables template and customize:

```css
@import '@tekton/ui/styles';

:root {
  /* Button Tokens */
  --button-primary-background: #3b82f6;
  --button-primary-foreground: white;

  /* Input Tokens */
  --input-border: #d1d5db;
  --input-background: white;

  /* Card Tokens */
  --card-background: white;
  --card-border: #e5e7eb;

  /* ... customize 100+ other tokens */
}
```

## Components

### Primitive Components (14)

Core UI building blocks with single responsibility:

- **Button** - Interactive button with loading states and variants (default, primary, secondary, destructive, outline, ghost, link)
- **Input** - Text input with error states and type support (text, email, password, number)
- **Checkbox** - Checkbox with indeterminate support and form integration
- **RadioGroup** - Radio button groups with keyboard navigation
- **Switch** - Toggle switch with checked/unchecked states
- **Slider** - Range slider with min/max/step configuration
- **Text** - Polymorphic text component with size variants
- **Heading** - Hierarchical headings (h1-h6) with level prop
- **Badge** - Status badges (default, primary, secondary, destructive, outline)
- **Avatar** - User avatars with image/fallback support
- **Progress** - Progress bar with value 0-100
- **Link** - Navigation links (default, muted, underline variants)
- **Image** - Image component with alt text and optional object-fit
- **List** - Polymorphic list component (ul/ol)

### Composed Components (6)

Complex components built from primitives:

- **Card** - Card container with header/content/footer structure
- **Form** - Form with validation context and error handling
- **Modal** - Dialog/modal overlay with Portal rendering
- **Dropdown** - Dropdown menu with keyboard navigation
- **Tabs** - Tabbed navigation with automatic ARIA labels
- **Table** - Data table with semantic HTML structure

---

## Component Examples

### Button

```tsx
import { Button } from '@tekton/ui';

// Variants
<Button variant="default">Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
```

**Props:**

- `variant`: `"default" | "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link"`
- `size`: `"sm" | "md" | "lg"`
- `loading`: `boolean`
- All native `<button>` props

---

### Input

```tsx
import { Input } from '@tekton/ui';

// Basic usage
<Input type="text" placeholder="Enter text..." />
<Input type="email" placeholder="Email address" />
<Input type="password" placeholder="Password" />

// With error state
<Input type="text" aria-invalid="true" />

// Disabled
<Input disabled placeholder="Disabled input" />
```

**Props:**

- `type`: `"text" | "email" | "password" | "number" | "search" | "tel" | "url"`
- All native `<input>` props

---

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@tekton/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description or subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

---

### Form

```tsx
import { Form, FormField, FormLabel, FormControl, FormDescription, FormMessage } from '@tekton/ui';
import { Input } from '@tekton/ui';

<Form
  onSubmit={e => {
    e.preventDefault(); /* handle submit */
  }}
>
  <FormField name="email">
    <FormLabel htmlFor="email">Email</FormLabel>
    <FormControl>
      <Input id="email" type="email" />
    </FormControl>
    <FormDescription>We'll never share your email.</FormDescription>
    <FormMessage name="email">Invalid email address</FormMessage>
  </FormField>
</Form>;
```

---

### Modal (Dialog)

```tsx
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from '@tekton/ui';
import { Button } from '@tekton/ui';

<Modal>
  <ModalTrigger asChild>
    <Button>Open Modal</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Modal Title</ModalTitle>
      <ModalDescription>Modal description text</ModalDescription>
    </ModalHeader>
    <div>Modal body content</div>
    <ModalFooter>
      <ModalClose asChild>
        <Button variant="outline">Cancel</Button>
      </ModalClose>
      <Button variant="primary">Confirm</Button>
    </ModalFooter>
  </ModalContent>
</Modal>;
```

---

### Dropdown Menu

```tsx
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from '@tekton/ui';
import { Button } from '@tekton/ui';

<Dropdown>
  <DropdownTrigger asChild>
    <Button>Open Menu</Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem onClick={() => console.log('Edit')}>Edit</DropdownItem>
    <DropdownItem onClick={() => console.log('Duplicate')}>Duplicate</DropdownItem>
    <DropdownSeparator />
    <DropdownItem disabled>Disabled Item</DropdownItem>
    <DropdownItem onClick={() => console.log('Delete')}>Delete</DropdownItem>
  </DropdownContent>
</Dropdown>;
```

---

### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@tekton/ui';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <p>Content for Tab 1</p>
  </TabsContent>
  <TabsContent value="tab2">
    <p>Content for Tab 2</p>
  </TabsContent>
  <TabsContent value="tab3">
    <p>Content for Tab 3</p>
  </TabsContent>
</Tabs>;
```

---

### Checkbox

```tsx
import { Checkbox } from '@tekton/ui';

// Basic checkbox
<label>
  <Checkbox id="terms" />
  Accept terms and conditions
</label>

// Indeterminate state
<Checkbox checked="indeterminate" />

// Disabled
<Checkbox disabled />
```

**Props:**

- `checked`: `boolean | "indeterminate"`
- `onCheckedChange`: `(checked: boolean | "indeterminate") => void`
- All Radix UI Checkbox props

---

### RadioGroup

```tsx
import { RadioGroup, RadioGroupItem } from '@tekton/ui';

<RadioGroup defaultValue="option1">
  <div>
    <RadioGroupItem value="option1" id="opt1" />
    <label htmlFor="opt1">Option 1</label>
  </div>
  <div>
    <RadioGroupItem value="option2" id="opt2" />
    <label htmlFor="opt2">Option 2</label>
  </div>
  <div>
    <RadioGroupItem value="option3" id="opt3" />
    <label htmlFor="opt3">Option 3</label>
  </div>
</RadioGroup>;
```

---

### Switch

```tsx
import { Switch } from '@tekton/ui';

<label>
  <Switch id="notifications" />
  Enable notifications
</label>

<Switch checked onCheckedChange={(checked) => console.log(checked)} />
```

**Props:**

- `checked`: `boolean`
- `onCheckedChange`: `(checked: boolean) => void`
- All Radix UI Switch props

---

### Slider

```tsx
import { Slider } from '@tekton/ui';

// Basic slider
<label htmlFor="volume" id="volume-label">Volume</label>
<Slider
  id="volume"
  defaultValue={[50]}
  min={0}
  max={100}
  step={1}
  aria-labelledby="volume-label"
/>

// Range slider
<Slider defaultValue={[25, 75]} min={0} max={100} />
```

**Props:**

- `defaultValue`: `number[]`
- `min`: `number`
- `max`: `number`
- `step`: `number`
- All Radix UI Slider props

---

### Progress

```tsx
import { Progress } from '@tekton/ui';

<Progress value={50} aria-label="Upload progress" />
<Progress value={75} aria-label="Loading" />
<Progress value={100} aria-label="Complete" />
```

**Props:**

- `value`: `number` (0-100)
- All Radix UI Progress props

---

### Avatar

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@tekton/ui';

<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="John Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>;
```

---

### Badge

```tsx
import { Badge } from '@tekton/ui';

<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

**Props:**

- `variant`: `"default" | "primary" | "secondary" | "destructive" | "outline"`

---

### Text

```tsx
import { Text } from '@tekton/ui';

// Sizes
<Text size="xs">Extra small text</Text>
<Text size="sm">Small text</Text>
<Text size="md">Medium text</Text>
<Text size="lg">Large text</Text>

// Polymorphic rendering
<Text as="p">Paragraph</Text>
<Text as="span">Inline text</Text>
<Text as="div">Block text</Text>
```

**Props:**

- `as`: `"p" | "span" | "div" | "label"`
- `size`: `"xs" | "sm" | "md" | "lg"`
- `variant`: `"default" | "muted"`

---

### Heading

```tsx
import { Heading } from '@tekton/ui';

<Heading level={1}>Heading 1</Heading>
<Heading level={2}>Heading 2</Heading>
<Heading level={3}>Heading 3</Heading>
<Heading level={4}>Heading 4</Heading>
<Heading level={5}>Heading 5</Heading>
<Heading level={6}>Heading 6</Heading>

// Sizes
<Heading level={1} size="sm">Small H1</Heading>
<Heading level={2} size="lg">Large H2</Heading>
```

**Props:**

- `level`: `1 | 2 | 3 | 4 | 5 | 6`
- `size`: `"sm" | "md" | "lg"`

---

### Link

```tsx
import { Link } from '@tekton/ui';

<Link href="/home" variant="default">Default Link</Link>
<Link href="/about" variant="muted">Muted Link</Link>
<Link href="/contact" variant="underline">Underlined Link</Link>
```

**Props:**

- `href`: `string`
- `variant`: `"default" | "muted" | "underline"`
- All native `<a>` props

---

### List

```tsx
import { List, ListItem } from '@tekton/ui';

// Unordered list
<List as="ul">
  <ListItem>Item 1</ListItem>
  <ListItem>Item 2</ListItem>
  <ListItem>Item 3</ListItem>
</List>

// Ordered list
<List as="ol">
  <ListItem>First item</ListItem>
  <ListItem>Second item</ListItem>
  <ListItem>Third item</ListItem>
</List>
```

**Props:**

- `as`: `"ul" | "ol"`

---

### Image

```tsx
import { Image } from '@tekton/ui';

<Image
  src="https://example.com/image.jpg"
  alt="Description of image"
/>

<Image
  src="https://example.com/image.jpg"
  alt="Cover image"
  className="object-cover w-full h-64"
/>
```

**Props:**

- `src`: `string`
- `alt`: `string` (required for accessibility)
- All native `<img>` props

---

### Table

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@tekton/ui';

<Table>
  <TableCaption>List of users</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>Admin</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Jane Smith</TableCell>
      <TableCell>jane@example.com</TableCell>
      <TableCell>User</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={3}>Total: 2 users</TableCell>
    </TableRow>
  </TableFooter>
</Table>;
```

---

## Features

### CSS Variables First

All themeable properties use CSS Variables:

```tsx
<Button variant="primary">
  {/* Uses --button-primary-background and --button-primary-foreground */}
</Button>
```

### Type-Safe Variants

Powered by class-variance-authority:

```tsx
<Button variant="secondary" size="lg" loading>
  Click me
</Button>
```

### Accessibility Built-In

- **WCAG 2.1 AA compliant** - All components pass axe-core validation
- **Proper ARIA attributes** - Screen reader friendly
- **Keyboard navigation** - Full keyboard support (Tab, Arrow keys, Enter, Escape)
- **Focus management** - Visible focus indicators and proper focus trapping

### Zero Config Setup

Works out of the box with sensible defaults:

```tsx
import { Button } from '@tekton/ui';

<Button>Just works</Button>;
```

---

## Screen Templates (Phase 3)

**New in Phase 3**: Screen Template System for rapid full-screen composition.

### Overview

Screen Templates provide pre-built, theme-aware full-screen layouts that combine multiple components into cohesive user experiences. Each template is registered in a centralized `TemplateRegistry` for easy discovery and reuse.

**Features:**

- **Pre-built Layouts**: Login, Dashboard, and more coming soon
- **Theme-Aware**: Automatically adapts to active theme via CSS Variables
- **Composable**: Combine templates with custom slots
- **Type-Safe**: Full TypeScript support with template metadata

### Quick Start

```tsx
import { getTemplate } from '@tekton/ui/templates';

// Get a registered template by ID
const LoginTemplate = getTemplate('login-minimal');

// Render with custom slots
<LoginTemplate
  slots={{
    branding: <YourLogo />,
    footer: <YourFooter />,
  }}
/>;
```

### Available Templates

#### LoginTemplate

Minimal authentication screen with centered card layout.

```tsx
import { LoginTemplate } from '@tekton/ui/templates/auth/login';

<LoginTemplate
  slots={{
    branding: <img src="/logo.svg" alt="Brand" />,
    footer: <p>© 2026 Your Company</p>,
  }}
/>;
```

**Metadata:**

- **ID**: `login-minimal`
- **Category**: `auth`
- **Supported Themes**: All
- **Slots**: `branding` (optional), `footer` (optional)

#### DashboardTemplate

Full dashboard with sidebar navigation and content area.

```tsx
import { DashboardTemplate } from '@tekton/ui/templates/dashboard/overview';

<DashboardTemplate
  slots={{
    sidebar: <YourSidebar />,
    header: <YourHeader />,
    content: <YourDashboardContent />,
  }}
/>;
```

**Metadata:**

- **ID**: `dashboard-minimal`
- **Category**: `dashboard`
- **Supported Themes**: All
- **Slots**: `sidebar` (required), `header` (optional), `content` (required)

### TemplateRegistry API

The `TemplateRegistry` provides centralized template management:

```tsx
import { TemplateRegistry } from '@tekton/ui/templates/registry';

// Get all templates
const allTemplates = TemplateRegistry.getAll();

// Get templates by category
const authTemplates = TemplateRegistry.getByCategory('auth');

// Get specific template
const loginTemplate = TemplateRegistry.get('login-minimal');
```

**API Reference**: See [docs/templates-api.md](./docs/templates-api.md) for complete API documentation.

### Template Anatomy

Each template includes:

1. **Metadata**: ID, name, category, description, tags, supported themes
2. **Layout Configuration**: Type, max width, padding, gap (using CSS Variables)
3. **Slot Definitions**: Required/optional slots with type constraints
4. **Token Bindings**: CSS Variable mappings for theming
5. **React Component**: The actual template implementation

**Example Template Structure:**

```tsx
export const LoginTemplate: ScreenTemplate = {
  meta: {
    id: 'login-minimal',
    name: 'Minimal Login',
    category: 'auth',
    description: 'Centered login card with branding',
    tags: ['auth', 'login', 'minimal'],
    supportedThemes: ['*'], // All themes
  },
  layout: {
    type: 'centered',
    maxWidth: 'sm',
    padding: 'var(--tekton-spacing-4)',
  },
  slots: [
    {
      id: 'branding',
      name: 'Brand Logo',
      required: false,
    },
    {
      id: 'footer',
      name: 'Footer Content',
      required: false,
    },
  ],
  Component: LoginScreenComponent, // React component
};
```

### Creating Custom Templates

To create your own template:

1. Define template metadata following `ScreenTemplate` interface
2. Implement React component with slot support
3. Register template in `TemplateRegistry`
4. Export from your module

**Example:**

```tsx
import type { ScreenTemplate } from '@tekton/ui/templates/types';

export const MyCustomTemplate: ScreenTemplate = {
  meta: {
    id: 'custom-template',
    name: 'My Custom Template',
    category: 'content',
    description: 'Custom template description',
    tags: ['custom'],
    supportedThemes: ['*'],
  },
  layout: {
    type: 'full',
    maxWidth: 'xl',
  },
  slots: [
    {
      id: 'header',
      name: 'Header',
      required: true,
    },
  ],
  Component: ({ slots }) => (
    <div className="min-h-screen">
      <header>{slots?.header}</header>
      {/* Template implementation */}
    </div>
  ),
};

// Register
import { TemplateRegistry } from '@tekton/ui/templates/registry';
TemplateRegistry.register(MyCustomTemplate);
```

### Phase 3 Status

**Completed:**

- ✅ Template type system (`ScreenTemplate`, `TemplateRegistry`)
- ✅ LoginTemplate implementation
- ✅ DashboardTemplate implementation
- ✅ Template registry with category filtering
- ✅ 497 tests with 91.72% coverage

**Upcoming (Phase 4):**

- Additional templates (Settings, Profile, Analytics)
- Enhanced template customization
- Storybook documentation
- Template preview gallery

**Known Issues:**

- TAG comment annotations incomplete (see [SPEC-UI-001 improvements.md](../../.moai/specs/SPEC-UI-001/improvements.md))
- 23 TypeScript type definition warnings

---

## CSS Variables Reference

@tekton/ui uses a 3-layer CSS Variables architecture:

### Layer 1: Atomic Tokens

```css
--color-primary: #3b82f6;
--color-destructive: #ef4444;
--spacing-sm: 0.5rem;
--radius-md: 0.375rem;
```

### Layer 2: Semantic Tokens

```css
--text-primary: var(--color-primary);
--bg-destructive: var(--color-destructive);
```

### Layer 3: Component Tokens

**Button Tokens:**

```css
--button-default-background
--button-default-foreground
--button-primary-background
--button-primary-foreground
--button-secondary-background
--button-secondary-foreground
--button-destructive-background
--button-destructive-foreground
--button-outline-border
--button-outline-foreground
--button-ghost-hover-background
--button-link-foreground
--button-disabled-opacity
--button-focus-ring
```

**Input Tokens:**

```css
--input-background
--input-foreground
--input-border
--input-placeholder
--input-focus-ring
--input-disabled-background
--input-disabled-foreground
```

**Card Tokens:**

```css
--card-background
--card-foreground
--card-border
```

**Modal Tokens:**

```css
--modal-background
--modal-border
--modal-overlay-background
--modal-title-foreground
--modal-description-foreground
```

**Form Tokens:**

```css
--form-label-foreground
--form-message-destructive
--form-description-foreground
```

**Other Component Tokens:**

- Badge: `--badge-*-background`, `--badge-*-foreground`, `--badge-*-border`
- Dropdown: `--dropdown-*-background`, `--dropdown-item-*`
- Tabs: `--tabs-*-background`, `--tabs-trigger-*`
- Table: `--table-*-background`, `--table-border`
- Progress: `--progress-background`, `--progress-indicator-background`
- Slider: `--slider-track-background`, `--slider-thumb-*`
- Avatar: `--avatar-background`, `--avatar-foreground`

### Custom Theme Example

```css
/* dark-theme.css */
@import '@tekton/ui/styles';

:root {
  /* Atomic Layer */
  --color-primary: #60a5fa;
  --color-background: #1f2937;
  --color-foreground: #f9fafb;

  /* Button Layer */
  --button-primary-background: var(--color-primary);
  --button-primary-foreground: #000000;
  --button-default-background: #374151;
  --button-default-foreground: var(--color-foreground);

  /* Input Layer */
  --input-background: #374151;
  --input-foreground: var(--color-foreground);
  --input-border: #4b5563;

  /* Card Layer */
  --card-background: #374151;
  --card-foreground: var(--color-foreground);
  --card-border: #4b5563;
}
```

---

## Development

### Setup

```bash
# Clone repository
git clone https://github.com/your-org/tekton.git
cd tekton/packages/ui

# Install dependencies (requires pnpm)
pnpm install
```

### Scripts

```bash
# Run tests
pnpm test

# Run tests with coverage (target: ≥90%)
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Type check (TypeScript 5.7+ strict mode)
pnpm type-check

# Lint (ESLint 9)
pnpm lint

# Build (outputs to dist/)
pnpm build

# Clean build artifacts
pnpm clean
```

### Project Structure

```
packages/ui/
├── src/
│   ├── primitives/          # 14 primitive components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── checkbox.tsx
│   │   └── ...
│   ├── components/          # 6 composed components
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── modal.tsx
│   │   └── ...
│   ├── lib/
│   │   └── utils.ts         # cn() utility
│   └── index.ts             # Main export
├── __tests__/
│   ├── primitives/          # Primitive tests
│   ├── components/          # Component tests
│   ├── lib/                 # Utility tests
│   └── accessibility.test.tsx  # WCAG compliance
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

---

## Testing

All 20 components include comprehensive test coverage:

### Test Coverage (98.93%)

- **Statement Coverage**: 98.93%
- **Branch Coverage**: 95.52%
- **Function Coverage**: 100%
- **Line Coverage**: 98.93%

### Test Categories

**Unit Tests (Vitest + Testing Library)**

- Component rendering
- Props validation
- Variant behavior
- State management
- Event handling

**Accessibility Tests (vitest-axe)**

- WCAG 2.1 AA compliance
- ARIA attributes
- Semantic HTML
- Color contrast (disabled in jsdom)

**Keyboard Navigation Tests**

- Tab navigation
- Arrow key navigation (RadioGroup, Tabs, Slider)
- Enter/Space activation
- Escape key handling (Modal, Dropdown)

**User Interaction Tests (userEvent)**

- Click events
- Form submissions
- Input changes
- Focus management

### Running Tests

```bash
# All tests
pnpm test

# Specific file
pnpm vitest run __tests__/primitives/button.test.tsx

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Note**: Internet Explorer is not supported.

---

## TypeScript Support

All components are fully typed with TypeScript 5.7+:

```tsx
import { Button, ButtonProps } from '@tekton/ui';

// Type-safe props
const MyButton: React.FC<ButtonProps> = props => {
  return <Button {...props} />;
};

// Type inference
<Button
  variant="primary" // ✓ Valid
  variant="invalid" // ✗ TypeScript error
  size="lg" // ✓ Valid
  onClick={e => {
    // e is typed as MouseEvent<HTMLButtonElement>
    console.log(e.currentTarget);
  }}
/>;
```

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Run type check (`pnpm type-check`)
6. Run linter (`pnpm lint`)
7. Commit changes (`git commit -m 'Add amazing feature'`)
8. Push to branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Code Quality Standards

- **Test Coverage**: ≥90% (currently 98.93%)
- **TypeScript**: Strict mode, no `any` types
- **Accessibility**: WCAG 2.1 AA compliant
- **ESLint**: Zero warnings/errors
- **Documentation**: All public APIs documented

---

## License

MIT License - see [LICENSE](./LICENSE) for details

---

## Links

- **Documentation**: [Tekton UI Guide](https://github.com/tektoncd/tekton)
- **Radix UI**: [https://www.radix-ui.com/](https://www.radix-ui.com/)
- **WCAG 2.1**: [https://www.w3.org/WAI/WCAG21/quickref/](https://www.w3.org/WAI/WCAG21/quickref/)
- **React 19**: [https://react.dev/](https://react.dev/)
- **TypeScript**: [https://www.typescriptlang.org/](https://www.typescriptlang.org/)

---

## Acknowledgments

Built with:

- [React 19](https://react.dev/) - UI library
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [class-variance-authority](https://cva.style/docs) - Variant management
- [Vitest](https://vitest.dev/) - Testing framework
- [axe-core](https://github.com/dequelabs/axe-core) - Accessibility testing

---

**Version**: 1.0.0
**Last Updated**: 2026-01-26
**Maintained by**: Tekton Team
