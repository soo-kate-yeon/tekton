/**
 * @tekton/ui - Heading Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Heading } from '../../src/primitives/heading';

describe('Heading', () => {
  describe('Rendering', () => {
    it('renders successfully with children', () => {
      render(<Heading>Page Title</Heading>);
      expect(screen.getByText('Page Title')).toBeInTheDocument();
    });

    it('renders as <h1> by default', () => {
      render(<Heading data-testid="heading">Title</Heading>);
      expect(screen.getByTestId('heading').tagName).toBe('H1');
    });
  });

  describe('Levels', () => {
    it('renders h1 when level=1', () => {
      render(
        <Heading level={1} data-testid="heading">
          H1
        </Heading>
      );
      const heading = screen.getByTestId('heading');
      expect(heading.tagName).toBe('H1');
      expect(heading).toHaveClass('text-4xl');
    });

    it('renders h2 when level=2', () => {
      render(
        <Heading level={2} data-testid="heading">
          H2
        </Heading>
      );
      const heading = screen.getByTestId('heading');
      expect(heading.tagName).toBe('H2');
      expect(heading).toHaveClass('text-3xl');
    });

    it('renders h3 when level=3', () => {
      render(
        <Heading level={3} data-testid="heading">
          H3
        </Heading>
      );
      const heading = screen.getByTestId('heading');
      expect(heading.tagName).toBe('H3');
      expect(heading).toHaveClass('text-2xl');
    });

    it('renders h4 when level=4', () => {
      render(
        <Heading level={4} data-testid="heading">
          H4
        </Heading>
      );
      const heading = screen.getByTestId('heading');
      expect(heading.tagName).toBe('H4');
      expect(heading).toHaveClass('text-xl');
    });

    it('renders h5 when level=5', () => {
      render(
        <Heading level={5} data-testid="heading">
          H5
        </Heading>
      );
      const heading = screen.getByTestId('heading');
      expect(heading.tagName).toBe('H5');
      expect(heading).toHaveClass('text-lg');
    });

    it('renders h6 when level=6', () => {
      render(
        <Heading level={6} data-testid="heading">
          H6
        </Heading>
      );
      const heading = screen.getByTestId('heading');
      expect(heading.tagName).toBe('H6');
      expect(heading).toHaveClass('text-base');
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(<Heading data-testid="heading">Title</Heading>);
      expect(screen.getByTestId('heading')).toHaveClass('text-[var(--heading-foreground)]');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <div>
          <Heading level={1}>Main Title</Heading>
          <Heading level={2}>Section Title</Heading>
        </div>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('maintains proper heading hierarchy', () => {
      render(
        <div>
          <Heading level={1} data-testid="h1">
            Title
          </Heading>
          <Heading level={2} data-testid="h2">
            Subtitle
          </Heading>
          <Heading level={3} data-testid="h3">
            Section
          </Heading>
        </div>
      );
      expect(screen.getByTestId('h1').tagName).toBe('H1');
      expect(screen.getByTestId('h2').tagName).toBe('H2');
      expect(screen.getByTestId('h3').tagName).toBe('H3');
    });

    it('supports custom className', () => {
      render(
        <Heading className="custom-class" data-testid="heading">
          Title
        </Heading>
      );
      expect(screen.getByTestId('heading')).toHaveClass('custom-class');
    });
  });
});
