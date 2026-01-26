/**
 * @tekton/ui - Input Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Input } from '../../src/primitives/input';

describe('Input', () => {
  describe('Rendering', () => {
    it('renders successfully', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with default type="text"', () => {
      render(<Input data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'text');
    });

    it('accepts custom type', () => {
      render(<Input type="email" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null as HTMLInputElement | null };
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Error State', () => {
    it('applies error styling when error=true', () => {
      render(<Input error={true} data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('border-[var(--input-error-border)]');
    });

    it('sets aria-invalid when error=true', () => {
      render(<Input error={true} data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid when error=false', () => {
      render(<Input error={false} data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('bg-[var(--input-background)]');
      expect(input).toHaveClass('text-[var(--input-foreground)]');
      expect(input).toHaveClass('border-[var(--input-border)]');
    });
  });

  describe('User Interaction', () => {
    it('handles user input', async () => {
      const user = userEvent.setup();
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input') as HTMLInputElement;

      await user.type(input, 'Hello World');
      expect(input.value).toBe('Hello World');
    });

    it('respects disabled state', async () => {
      const user = userEvent.setup();
      render(<Input disabled data-testid="input" />);
      const input = screen.getByTestId('input');

      await user.type(input, 'Test');
      expect(input).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-input">Test Input</label>
          <Input id="test-input" />
        </div>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('supports aria-label', () => {
      render(<Input aria-label="Search" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-label', 'Search');
    });

    it('supports aria-describedby for error messages', () => {
      render(
        <div>
          <Input error={true} aria-describedby="error-msg" data-testid="input" />
          <span id="error-msg">This field is required</span>
        </div>
      );
      expect(screen.getByTestId('input')).toHaveAttribute('aria-describedby', 'error-msg');
    });
  });
});
