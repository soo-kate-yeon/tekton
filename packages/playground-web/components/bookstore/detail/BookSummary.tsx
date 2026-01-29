'use client';

import { useState } from 'react';

interface BookSummaryProps {
  paragraphs: string[];
}

export function BookSummary({ paragraphs }: BookSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = paragraphs.length > 2;
  const displayParagraphs = expanded || !shouldTruncate ? paragraphs : paragraphs.slice(0, 2);

  return (
    <section className="px-6 md:px-10 py-8 md:py-10 border-t border-[var(--atomic-semantic-border-default-subtle)]">
      <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-serif)] font-bold text-[var(--atomic-semantic-text-primary)] mb-6">
        About This Book
      </h2>

      <div className="space-y-4 text-[var(--atomic-semantic-text-secondary)] leading-relaxed">
        {displayParagraphs.map((paragraph, index) => (
          <p key={index} className="text-base md:text-lg">
            {paragraph}
          </p>
        ))}
      </div>

      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-[var(--atomic-semantic-text-brand)] font-medium hover:opacity-70 transition-opacity text-sm md:text-base"
        >
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      )}
    </section>
  );
}
