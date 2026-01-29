'use client';

interface TableOfContentsProps {
  chapters: {
    chapter: number;
    title: string;
  }[];
}

export function TableOfContents({ chapters }: TableOfContentsProps) {
  return (
    <section className="px-6 md:px-10 py-8 md:py-10 border-t border-[var(--atomic-semantic-border-default-subtle)]">
      <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-serif)] font-bold text-[var(--atomic-semantic-text-primary)] mb-6">
        Table of Contents
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {chapters.map((item) => (
          <div
            key={item.chapter}
            className="flex items-start gap-4 p-4 rounded-[var(--atomic-radius-md)] hover:bg-[var(--atomic-semantic-background-surface-emphasis)]/5 transition-colors cursor-pointer"
          >
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-[var(--atomic-radius-full)] bg-[var(--atomic-semantic-background-surface-emphasis)]/10 text-[var(--atomic-semantic-text-brand)] font-semibold text-sm">
              {item.chapter}
            </span>
            <p className="text-[var(--atomic-semantic-text-primary)] font-medium text-sm md:text-base">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
