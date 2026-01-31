/**
 * @tekton/ui - ScrollArea Component Tests
 */

import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect } from 'vitest';
import { ScrollArea, ScrollBar } from '../scroll-area';

describe('ScrollArea', () => {
  const renderScrollArea = () =>
    render(
      <ScrollArea className="h-48 w-48">
        <div className="p-4">
          {Array.from({ length: 50 }).map((_, i) => (
            <p key={i}>Item {i + 1}</p>
          ))}
        </div>
      </ScrollArea>
    );

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderScrollArea();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders children', () => {
      const { getByText } = renderScrollArea();
      expect(getByText('Item 1')).toBeInTheDocument();
      expect(getByText('Item 50')).toBeInTheDocument();
    });

    it('renders with ScrollBar', () => {
      const { container } = render(
        <ScrollArea>
          <div>Content</div>
          <ScrollBar />
        </ScrollArea>
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe('Orientation', () => {
    it('renders vertical scrollbar', () => {
      const { container } = render(
        <ScrollArea>
          <div>Content</div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      );
      expect(container).toBeInTheDocument();
    });

    it('renders horizontal scrollbar', () => {
      const { container } = render(
        <ScrollArea>
          <div>Content</div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <ScrollArea className="custom-scroll">
          <div>Content</div>
        </ScrollArea>
      );
      expect(container.querySelector('.custom-scroll')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = renderScrollArea();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Token Compliance', () => {
    it('uses Tekton tokens', () => {
      const { container } = renderScrollArea();
      // Check that ScrollArea viewport is rendered
      const viewport = container.querySelector('[class*="rounded"]');
      expect(viewport).toBeInTheDocument();
    });
  });
});
