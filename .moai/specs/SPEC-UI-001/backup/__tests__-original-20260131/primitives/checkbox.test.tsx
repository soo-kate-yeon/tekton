/**
 * @tekton/ui - Checkbox Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Checkbox } from '../../src/primitives/checkbox';

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('renders successfully', () => {
      render(<Checkbox data-testid="checkbox" />);
      expect(screen.getByTestId('checkbox')).toBeInTheDocument();
    });

    it('renders with aria-label', () => {
      render(<Checkbox aria-label="Accept terms" data-testid="checkbox" />);
      expect(screen.getByTestId('checkbox')).toHaveAttribute('aria-label', 'Accept terms');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null as HTMLButtonElement | null };
      render(<Checkbox ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('States', () => {
    it('toggles checked state on click', async () => {
      const user = userEvent.setup();
      render(<Checkbox data-testid="checkbox" />);
      const checkbox = screen.getByTestId('checkbox');

      expect(checkbox).toHaveAttribute('data-state', 'unchecked');

      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('data-state', 'checked');

      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    });

    it('respects disabled state', async () => {
      const user = userEvent.setup();
      render(<Checkbox disabled data-testid="checkbox" />);
      const checkbox = screen.getByTestId('checkbox');

      expect(checkbox).toBeDisabled();
      expect(checkbox).toHaveAttribute('data-state', 'unchecked');

      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    });

    it('accepts controlled checked prop', () => {
      const { rerender } = render(<Checkbox checked={false} data-testid="checkbox" />);
      expect(screen.getByTestId('checkbox')).toHaveAttribute('data-state', 'unchecked');

      rerender(<Checkbox checked={true} data-testid="checkbox" />);
      expect(screen.getByTestId('checkbox')).toHaveAttribute('data-state', 'checked');
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(<Checkbox data-testid="checkbox" />);
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveClass('bg-[var(--checkbox-background)]');
      expect(checkbox).toHaveClass('border-[var(--checkbox-border)]');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-checkbox">
            <Checkbox id="test-checkbox" />
            Accept terms
          </label>
        </div>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('supports keyboard interaction (Space)', async () => {
      const user = userEvent.setup();
      render(<Checkbox data-testid="checkbox" />);
      const checkbox = screen.getByTestId('checkbox');

      checkbox.focus();
      expect(checkbox).toHaveFocus();

      await user.keyboard(' ');
      expect(checkbox).toHaveAttribute('data-state', 'checked');

      await user.keyboard(' ');
      expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    });

    it('has role="checkbox"', () => {
      render(<Checkbox data-testid="checkbox" />);
      expect(screen.getByTestId('checkbox')).toHaveAttribute('role', 'checkbox');
    });
  });
});
