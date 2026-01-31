/**
 * @tekton/ui - Switch Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Switch } from '../../src/primitives/switch';

describe('Switch', () => {
  describe('Rendering', () => {
    it('renders successfully', () => {
      render(<Switch data-testid="switch" />);
      expect(screen.getByTestId('switch')).toBeInTheDocument();
    });

    it('renders with aria-label', () => {
      render(<Switch aria-label="Enable notifications" data-testid="switch" />);
      expect(screen.getByTestId('switch')).toHaveAttribute('aria-label', 'Enable notifications');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null as HTMLButtonElement | null };
      render(<Switch ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('States', () => {
    it('toggles checked state on click', async () => {
      const user = userEvent.setup();
      render(<Switch data-testid="switch" />);
      const switchElement = screen.getByTestId('switch');

      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('data-state', 'checked');

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });

    it('respects disabled state', async () => {
      const user = userEvent.setup();
      render(<Switch disabled data-testid="switch" />);
      const switchElement = screen.getByTestId('switch');

      expect(switchElement).toBeDisabled();
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });

    it('accepts controlled checked prop', () => {
      const { rerender } = render(<Switch checked={false} data-testid="switch" />);
      expect(screen.getByTestId('switch')).toHaveAttribute('data-state', 'unchecked');

      rerender(<Switch checked={true} data-testid="switch" />);
      expect(screen.getByTestId('switch')).toHaveAttribute('data-state', 'checked');
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(<Switch data-testid="switch" />);
      const switchElement = screen.getByTestId('switch');
      expect(switchElement).toHaveClass('bg-[var(--switch-background)]');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-switch">
            <Switch id="test-switch" />
            Enable feature
          </label>
        </div>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('supports keyboard interaction (Space)', async () => {
      const user = userEvent.setup();
      render(<Switch data-testid="switch" />);
      const switchElement = screen.getByTestId('switch');

      switchElement.focus();
      expect(switchElement).toHaveFocus();

      await user.keyboard(' ');
      expect(switchElement).toHaveAttribute('data-state', 'checked');

      await user.keyboard(' ');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });

    it('has role="switch"', () => {
      render(<Switch data-testid="switch" />);
      expect(screen.getByTestId('switch')).toHaveAttribute('role', 'switch');
    });

    it('has aria-checked attribute', () => {
      render(<Switch checked={true} data-testid="switch" />);
      expect(screen.getByTestId('switch')).toHaveAttribute('aria-checked', 'true');
    });
  });
});
