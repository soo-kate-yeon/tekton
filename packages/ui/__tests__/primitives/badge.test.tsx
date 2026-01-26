/**
 * @tekton/ui - Badge Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Badge } from '../../src/primitives/badge';

describe('Badge', () => {
  describe('Rendering', () => {
    it('renders successfully with children', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders as <div> by default', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      expect(screen.getByTestId('badge').tagName).toBe('DIV');
    });
  });

  describe('Variants', () => {
    it('applies default variant', () => {
      render(
        <Badge variant="default" data-testid="badge">
          Default
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-[var(--badge-default-background)]');
      expect(badge).toHaveClass('text-[var(--badge-default-foreground)]');
    });

    it('applies secondary variant', () => {
      render(
        <Badge variant="secondary" data-testid="badge">
          Secondary
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-[var(--badge-secondary-background)]');
      expect(badge).toHaveClass('text-[var(--badge-secondary-foreground)]');
    });

    it('applies destructive variant', () => {
      render(
        <Badge variant="destructive" data-testid="badge">
          Error
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-[var(--badge-destructive-background)]');
      expect(badge).toHaveClass('text-[var(--badge-destructive-foreground)]');
    });

    it('applies outline variant', () => {
      render(
        <Badge variant="outline" data-testid="badge">
          Outline
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('border-[var(--badge-outline-border)]');
      expect(badge).toHaveClass('text-[var(--badge-outline-foreground)]');
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(
        <Badge variant="default" data-testid="badge">
          Badge
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-[var(--badge-default-background)]');
      expect(badge).toHaveClass('text-[var(--badge-default-foreground)]');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <div>
          <Badge>Status Badge</Badge>
          <Badge variant="destructive">Error Badge</Badge>
        </div>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('supports custom className', () => {
      render(
        <Badge className="custom-class" data-testid="badge">
          Badge
        </Badge>
      );
      expect(screen.getByTestId('badge')).toHaveClass('custom-class');
    });

    it('supports aria-label for non-text badges', () => {
      render(
        <Badge aria-label="Status: Active" data-testid="badge">
          ●
        </Badge>
      );
      expect(screen.getByTestId('badge')).toHaveAttribute('aria-label', 'Status: Active');
    });
  });
});
