# @tekton/studio-web

Web application for the Tekton Design System - design token management and component preview.

## Features (MVP)

- **Theme Gallery**: Browse and manage curated design token themes
- **Theme CRUD**: Create, view, and delete themes
- **Filtering**: Filter themes by category and tags
- **Multi-Theme Support**: System-aware theming with multiple themes (Default, Dark, Premium Editorial)
- **Responsive**: Mobile-friendly responsive design

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Studio API running at `localhost:8000`

### Installation

```bash
# From the monorepo root
pnpm install

# Or from this directory
pnpm install
```

### Development

```bash
# Start development server (port 3001)
pnpm dev

# Open http://localhost:3001
```

### Build

```bash
pnpm build
pnpm start
```

### Testing

```bash
pnpm test
pnpm test:coverage
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout with providers
│   ├── page.tsx        # Home page
│   └── themes/        # Theme gallery pages
├── components/
│   ├── layout/         # Layout components (Header)
│   ├── themes/        # Theme-specific components
│   └── ui/             # Reusable UI components
│       └── ThemeSelector.tsx  # Theme selection dropdown
├── hooks/              # React Query hooks
├── lib/
│   ├── api/            # API client and types
│   └── utils/          # Utility functions
├── providers/          # React context providers
└── types/              # TypeScript type definitions
```

## Integration Points

| Service | URL | Purpose |
|---------|-----|---------|
| Studio API | localhost:8000 | Theme CRUD operations |
| Studio MCP | localhost:3000 | Component data (future) |

## Technology Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **UI**: Radix UI primitives + Tailwind CSS
- **State**: TanStack Query (React Query)
- **Validation**: Zod
- **Testing**: Vitest + Testing Library

## Theme System

Studio Web includes a flexible multi-theme system with the following themes:

| Theme | Description |
|-------|-------------|
| Default | Light theme with modern styling |
| Dark | Dark theme for low-light environments |
| Premium Editorial | NYTimes-inspired elegant reading experience |

### Usage

```tsx
import { useTheme } from '@/providers/ThemeProvider';

function MyComponent() {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      {availableThemes.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  );
}
```

Themes are applied via the `data-theme` attribute on the root element and use CSS custom properties defined in `globals.css`.

## Future Roadmap

- [ ] Token Editor with OKLCH color picker
- [ ] Component Preview with MCP integration
- [ ] Export system (CSS, JSON, React Native)
