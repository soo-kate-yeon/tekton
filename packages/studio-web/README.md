# @tekton/studio-web

Web application for the Tekton Design System - design token management and component preview.

## Features (MVP)

- **Preset Gallery**: Browse and manage curated design token presets
- **Preset CRUD**: Create, view, and delete presets
- **Filtering**: Filter presets by category and tags
- **Dark Mode**: System-aware dark mode toggle
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
│   └── presets/        # Preset gallery pages
├── components/
│   ├── layout/         # Layout components (Header)
│   ├── presets/        # Preset-specific components
│   └── ui/             # Reusable UI components
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
| Studio API | localhost:8000 | Preset CRUD operations |
| Studio MCP | localhost:3000 | Archetype data (future) |

## Technology Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **UI**: Radix UI primitives + Tailwind CSS
- **State**: TanStack Query (React Query)
- **Validation**: Zod
- **Testing**: Vitest + Testing Library

## Future Roadmap

- [ ] Token Editor with OKLCH color picker
- [ ] Component Preview with MCP integration
- [ ] Export system (CSS, JSON, React Native)
