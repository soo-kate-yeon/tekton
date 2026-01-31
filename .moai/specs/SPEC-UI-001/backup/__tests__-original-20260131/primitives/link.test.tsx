/**
 * @tekton/ui - Link Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Link } from '../../src/primitives/link';

describe('Link', () => {
  describe('Rendering', () => {
    it('renders successfully with children', () => {
      render(<Link href="/test">Test Link</Link>);
      expect(screen.getByText('Test Link')).toBeInTheDocument();
    });

    it('renders as <a> by default', () => {
      render(
        <Link href="/test" data-testid="link">
          Link
        </Link>
      );
      expect(screen.getByTestId('link').tagName).toBe('A');
    });

    it('renders with href attribute', () => {
      render(
        <Link href="/test" data-testid="link">
          Link
        </Link>
      );
      expect(screen.getByTestId('link')).toHaveAttribute('href', '/test');
    });
  });

  describe('Variants', () => {
    it('applies default variant', () => {
      render(
        <Link href="/test" variant="default" data-testid="link">
          Link
        </Link>
      );
      const link = screen.getByTestId('link');
      expect(link).toHaveClass('text-[var(--link-foreground)]');
      expect(link).toHaveClass('hover:underline');
    });

    it('applies muted variant', () => {
      render(
        <Link href="/test" variant="muted" data-testid="link">
          Link
        </Link>
      );
      const link = screen.getByTestId('link');
      expect(link).toHaveClass('text-[var(--link-muted-foreground)]');
      expect(link).toHaveClass('hover:underline');
    });

    it('applies subtle variant', () => {
      render(
        <Link href="/test" variant="subtle" data-testid="link">
          Link
        </Link>
      );
      const link = screen.getByTestId('link');
      expect(link).toHaveClass('text-[var(--link-subtle-foreground)]');
    });
  });

  describe('User Interaction', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn(e => e.preventDefault());
      render(
        <Link href="/test" onClick={handleClick} data-testid="link">
          Link
        </Link>
      );

      await user.click(screen.getByTestId('link'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('supports keyboard navigation (Enter)', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn(e => e.preventDefault());
      render(
        <Link href="/test" onClick={handleClick} data-testid="link">
          Link
        </Link>
      );

      screen.getByTestId('link').focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('External Links', () => {
    it('supports target="_blank" for external links', () => {
      render(
        <Link
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="link"
        >
          External
        </Link>
      );
      const link = screen.getByTestId('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(
        <Link href="/test" variant="default" data-testid="link">
          Link
        </Link>
      );
      expect(screen.getByTestId('link')).toHaveClass('text-[var(--link-foreground)]');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <nav>
          <Link href="/home">Home</Link>
          <Link href="/about">About</Link>
        </nav>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('is keyboard focusable', () => {
      render(
        <Link href="/test" data-testid="link">
          Link
        </Link>
      );
      const link = screen.getByTestId('link');
      link.focus();
      expect(link).toHaveFocus();
    });

    it('supports aria-label for icon links', () => {
      render(
        <Link href="/home" aria-label="Go to home" data-testid="link">
          🏠
        </Link>
      );
      expect(screen.getByTestId('link')).toHaveAttribute('aria-label', 'Go to home');
    });

    it('supports custom className', () => {
      render(
        <Link href="/test" className="custom-class" data-testid="link">
          Link
        </Link>
      );
      expect(screen.getByTestId('link')).toHaveClass('custom-class');
    });
  });
});
