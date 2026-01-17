import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Tekton Studio</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Design token management and component preview for the Tekton Design System.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/presets"
            className="group block p-6 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary">
              Preset Gallery
            </h2>
            <p className="text-muted-foreground">
              Browse and manage curated design token presets. View color palettes,
              typography, and composition settings.
            </p>
          </Link>

          <Link
            href="/token-editor"
            className="group block p-6 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary">
              Token Editor
            </h2>
            <p className="text-muted-foreground">
              Create and customize design tokens with OKLCH color picker and
              live WCAG compliance preview.
            </p>
          </Link>

          <Link
            href="/component-preview"
            className="group block p-6 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary">
              Component Preview
            </h2>
            <p className="text-muted-foreground">
              Preview 20 headless components with archetype styling,
              accessibility info, and code export.
            </p>
          </Link>

          <Link
            href="/export"
            className="group block p-6 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary">
              Export
            </h2>
            <p className="text-muted-foreground">
              Export tokens as CSS variables, JSON, or React Native StyleSheet
              with dark mode support.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
