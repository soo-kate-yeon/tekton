/**
 * @tekton/ui - Radio Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { RadioGroup, RadioGroupItem } from '../../src/primitives/radio';

describe('RadioGroup', () => {
  describe('Rendering', () => {
    it('renders successfully', () => {
      render(
        <RadioGroup data-testid="radio-group">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>
      );
      expect(screen.getByTestId('radio-group')).toBeInTheDocument();
    });

    it('renders multiple radio items', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" data-testid="radio1" />
          <RadioGroupItem value="option2" data-testid="radio2" />
          <RadioGroupItem value="option3" data-testid="radio3" />
        </RadioGroup>
      );
      expect(screen.getByTestId('radio1')).toBeInTheDocument();
      expect(screen.getByTestId('radio2')).toBeInTheDocument();
      expect(screen.getByTestId('radio3')).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('allows selecting a radio item', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" data-testid="radio1" />
          <RadioGroupItem value="option2" data-testid="radio2" />
        </RadioGroup>
      );

      const radio1 = screen.getByTestId('radio1');
      const radio2 = screen.getByTestId('radio2');

      await user.click(radio1);
      expect(radio1).toHaveAttribute('data-state', 'checked');
      expect(radio2).toHaveAttribute('data-state', 'unchecked');

      await user.click(radio2);
      expect(radio1).toHaveAttribute('data-state', 'unchecked');
      expect(radio2).toHaveAttribute('data-state', 'checked');
    });

    it('respects disabled state on individual items', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" disabled data-testid="radio1" />
          <RadioGroupItem value="option2" data-testid="radio2" />
        </RadioGroup>
      );

      const radio1 = screen.getByTestId('radio1');
      expect(radio1).toBeDisabled();

      await user.click(radio1);
      expect(radio1).toHaveAttribute('data-state', 'unchecked');
    });

    it('accepts controlled defaultValue', () => {
      render(
        <RadioGroup defaultValue="option2">
          <RadioGroupItem value="option1" data-testid="radio1" />
          <RadioGroupItem value="option2" data-testid="radio2" />
        </RadioGroup>
      );

      expect(screen.getByTestId('radio1')).toHaveAttribute('data-state', 'unchecked');
      expect(screen.getByTestId('radio2')).toHaveAttribute('data-state', 'checked');
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" data-testid="radio" />
        </RadioGroup>
      );
      const radio = screen.getByTestId('radio');
      expect(radio).toHaveClass('bg-[var(--radio-background)]');
      expect(radio).toHaveClass('border-[var(--radio-border)]');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <fieldset>
          <legend>Choose an option</legend>
          <RadioGroup>
            <div>
              <RadioGroupItem value="option1" id="option1" />
              <label htmlFor="option1">Option 1</label>
            </div>
            <div>
              <RadioGroupItem value="option2" id="option2" />
              <label htmlFor="option2">Option 2</label>
            </div>
          </RadioGroup>
        </fieldset>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('supports keyboard navigation (Arrow keys)', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" data-testid="radio1" />
          <RadioGroupItem value="option2" data-testid="radio2" />
          <RadioGroupItem value="option3" data-testid="radio3" />
        </RadioGroup>
      );

      const radio1 = screen.getByTestId('radio1');
      radio1.focus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('radio2')).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('radio3')).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(screen.getByTestId('radio2')).toHaveFocus();
    });

    it('has role="radiogroup" on RadioGroup', () => {
      render(
        <RadioGroup data-testid="group">
          <RadioGroupItem value="1" />
        </RadioGroup>
      );
      expect(screen.getByTestId('group')).toHaveAttribute('role', 'radiogroup');
    });

    it('has role="radio" on RadioGroupItem', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="1" data-testid="radio" />
        </RadioGroup>
      );
      expect(screen.getByTestId('radio')).toHaveAttribute('role', 'radio');
    });
  });
});
