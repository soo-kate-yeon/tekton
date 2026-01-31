/**
 * @tekton/ui - Label Component Tests
 * SPEC-UI-001: Comprehensive test coverage for Label component
 */

import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Label } from '../label';

describe('Label', () => {
  // 1. Rendering Tests
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Label>Test Label</Label>);
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('renders with custom children', () => {
      render(<Label>Username</Label>);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('renders with htmlFor attribute', () => {
      render(
        <>
          <Label htmlFor="username">Username</Label>
          <input id="username" />
        </>
      );
      const label = screen.getByText('Username');
      expect(label).toHaveAttribute('for', 'username');
    });
  });

  // 2. Props Tests
  describe('Props', () => {
    it('applies custom className', () => {
      render(<Label className="custom-label">Custom</Label>);
      const label = screen.getByText('Custom');
      expect(label.className).toContain('custom-label');
    });

    it('handles peer-disabled styling', () => {
      const { container } = render(<Label>Disabled Label</Label>);
      const label = container.querySelector('label');
      expect(label?.className).toContain('peer-disabled:cursor-not-allowed');
      expect(label?.className).toContain('peer-disabled:opacity-70');
    });

    it('supports data attributes', () => {
      render(<Label data-testid="test-label">Test</Label>);
      expect(screen.getByTestId('test-label')).toBeInTheDocument();
    });
  });

  // 3. Association Tests
  describe('Form Association', () => {
    it('associates with input using htmlFor', () => {
      render(
        <div>
          <Label htmlFor="email">Email</Label>
          <input id="email" type="email" />
        </div>
      );

      const label = screen.getByText('Email');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', 'email');
      expect(input).toHaveAttribute('id', 'email');
    });

    it('works with nested input (implicit association)', () => {
      render(
        <Label>
          Nested Input
          <input type="text" />
        </Label>
      );

      expect(screen.getByText('Nested Input')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('associates with multiple form elements', () => {
      render(
        <>
          <Label htmlFor="field1">Field 1</Label>
          <input id="field1" />
          <Label htmlFor="field2">Field 2</Label>
          <input id="field2" />
        </>
      );

      expect(screen.getByText('Field 1')).toHaveAttribute('for', 'field1');
      expect(screen.getByText('Field 2')).toHaveAttribute('for', 'field2');
    });
  });

  // 4. Accessibility Tests
  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = render(
        <div>
          <Label htmlFor="accessible-input">Accessible Label</Label>
          <input id="accessible-input" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides accessible name for associated input', () => {
      render(
        <>
          <Label htmlFor="name-input">Name</Label>
          <input id="name-input" />
        </>
      );

      const input = screen.getByRole('textbox', { name: 'Name' });
      expect(input).toBeInTheDocument();
    });

    it('supports screen readers with proper semantics', () => {
      render(<Label htmlFor="sr-input">Screen Reader Label</Label>);
      const label = screen.getByText('Screen Reader Label');
      expect(label.tagName).toBe('LABEL');
    });
  });

  // 5. Token Compliance Tests
  describe('Token Compliance', () => {
    it('applies Tekton typography styles', () => {
      const { container } = render(<Label>Typography</Label>);
      const label = container.querySelector('label');
      expect(label?.className).toContain('text-sm');
      expect(label?.className).toContain('font-medium');
    });

    it('uses consistent leading and tracking', () => {
      const { container } = render(<Label>Consistent</Label>);
      const label = container.querySelector('label');
      expect(label?.className).toContain('leading-none');
    });

    it('handles peer state styling', () => {
      const { container } = render(<Label>Peer State</Label>);
      const label = container.querySelector('label');
      expect(label?.className).toMatch(/peer-disabled/);
    });
  });

  // Additional Edge Cases
  describe('Edge Cases', () => {
    it('renders with complex children', () => {
      render(
        <Label>
          <span>Complex</span> <strong>Children</strong>
        </Label>
      );
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Children')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = { current: null as HTMLLabelElement | null };
      render(<Label ref={ref}>Ref Test</Label>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it('handles onClick events', () => {
      const handleClick = vi.fn();
      render(<Label onClick={handleClick}>Clickable</Label>);

      const label = screen.getByText('Clickable');
      label.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
