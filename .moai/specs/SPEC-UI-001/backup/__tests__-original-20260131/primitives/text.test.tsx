/**
 * @tekton/ui - Text Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Text } from '../../src/primitives/text';

describe('Text', () => {
  describe('Rendering', () => {
    it('renders successfully with children', () => {
      render(<Text>Hello World</Text>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders as <span> by default', () => {
      render(<Text data-testid="text">Content</Text>);
      expect(screen.getByTestId('text').tagName).toBe('SPAN');
    });

    it('renders as custom element with as prop', () => {
      render(
        <Text as="p" data-testid="text">
          Content
        </Text>
      );
      expect(screen.getByTestId('text').tagName).toBe('P');
    });
  });

  describe('Variants', () => {
    it('applies body variant by default', () => {
      render(<Text data-testid="text">Body text</Text>);
      expect(screen.getByTestId('text')).toHaveClass('text-[var(--text-body-color)]');
    });

    it('applies caption variant', () => {
      render(
        <Text variant="caption" data-testid="text">
          Caption
        </Text>
      );
      const text = screen.getByTestId('text');
      expect(text).toHaveClass('text-[var(--text-caption-color)]');
    });

    it('applies label variant', () => {
      render(
        <Text variant="label" data-testid="text">
          Label
        </Text>
      );
      const text = screen.getByTestId('text');
      expect(text).toHaveClass('text-[var(--text-label-color)]');
    });

    it('applies code variant', () => {
      render(
        <Text variant="code" data-testid="text">
          Code
        </Text>
      );
      const text = screen.getByTestId('text');
      expect(text).toHaveClass('text-[var(--text-code-color)]');
      expect(text).toHaveClass('font-mono');
    });
  });

  describe('Sizes', () => {
    it('applies default size', () => {
      render(
        <Text size="default" data-testid="text">
          Text
        </Text>
      );
      expect(screen.getByTestId('text')).toHaveClass('text-base');
    });

    it('applies sm size', () => {
      render(
        <Text size="sm" data-testid="text">
          Text
        </Text>
      );
      expect(screen.getByTestId('text')).toHaveClass('text-sm');
    });

    it('applies lg size', () => {
      render(
        <Text size="lg" data-testid="text">
          Text
        </Text>
      );
      expect(screen.getByTestId('text')).toHaveClass('text-lg');
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(
        <Text variant="body" data-testid="text">
          Text
        </Text>
      );
      expect(screen.getByTestId('text')).toHaveClass('text-[var(--text-body-color)]');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<Text>Accessible text content</Text>);
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('supports custom className', () => {
      render(
        <Text className="custom-class" data-testid="text">
          Text
        </Text>
      );
      expect(screen.getByTestId('text')).toHaveClass('custom-class');
    });
  });
});
