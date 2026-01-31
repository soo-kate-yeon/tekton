/**
 * @tekton/ui - Dropdown Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from '../../src/components/dropdown';
import { Button } from '../../src/primitives/button';

describe('Dropdown', () => {
  describe('Rendering', () => {
    it('renders trigger button', () => {
      render(
        <Dropdown>
          <DropdownTrigger asChild>
            <Button>Open Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Item 1</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );
      expect(screen.getByRole('button', { name: 'Open Menu' })).toBeInTheDocument();
    });

    it('does not render content initially', () => {
      render(
        <Dropdown>
          <DropdownTrigger asChild>
            <Button>Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Hidden Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );
      expect(screen.queryByText('Hidden Item')).not.toBeInTheDocument();
    });
  });

  describe('Opening and Closing', () => {
    it('opens dropdown when trigger is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown>
          <DropdownTrigger asChild>
            <Button>Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Option 1</DropdownItem>
            <DropdownItem>Option 2</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      await user.click(screen.getByRole('button', { name: 'Menu' }));
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('closes dropdown when item is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown>
          <DropdownTrigger asChild>
            <Button>Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Option 1</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      await user.click(screen.getByRole('button', { name: 'Menu' }));
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      await user.click(screen.getByText('Option 1'));
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('closes dropdown when Escape is pressed', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown>
          <DropdownTrigger asChild>
            <Button>Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Option 1</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      await user.click(screen.getByRole('button', { name: 'Menu' }));
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('renders multiple items', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown>
          <DropdownTrigger asChild>
            <Button>Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Edit</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
            <DropdownItem>Share</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      await user.click(screen.getByRole('button', { name: 'Menu' }));

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByText('Share')).toBeInTheDocument();
    });

    it('renders separator between items', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown>
          <DropdownTrigger asChild>
            <Button>Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Edit</DropdownItem>
            <DropdownSeparator data-testid="separator" />
            <DropdownItem>Delete</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      await user.click(screen.getByRole('button', { name: 'Menu' }));
      expect(screen.getByTestId('separator')).toBeInTheDocument();
    });

    it('handles item click events', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <Dropdown>
          <DropdownTrigger asChild>
            <Button>Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem onClick={handleClick}>Click Me</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      await user.click(screen.getByRole('button', { name: 'Menu' }));
      await user.click(screen.getByText('Click Me'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown>
          <DropdownTrigger asChild>
            <Button>Menu</Button>
          </DropdownTrigger>
          <DropdownContent data-testid="content">
            <DropdownItem data-testid="item">Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      await user.click(screen.getByRole('button', { name: 'Menu' }));

      expect(screen.getByTestId('content')).toHaveClass('bg-[var(--dropdown-background)]');
      expect(screen.getByTestId('content')).toHaveClass('text-[var(--dropdown-foreground)]');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Dropdown>
          <DropdownTrigger asChild>
            <Button>Actions Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Edit</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      await user.click(screen.getByRole('button', { name: 'Actions Menu' }));
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('has role="menu" on dropdown content', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown>
          <DropdownTrigger asChild>
            <Button>Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      await user.click(screen.getByRole('button', { name: 'Menu' }));
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('supports keyboard navigation (Arrow keys)', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown>
          <DropdownTrigger asChild>
            <Button>Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>First</DropdownItem>
            <DropdownItem>Second</DropdownItem>
            <DropdownItem>Third</DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      await user.click(screen.getByRole('button', { name: 'Menu' }));

      await user.keyboard('{ArrowDown}');
      expect(screen.getByText('First')).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByText('Second')).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(screen.getByText('First')).toHaveFocus();
    });

    it('supports disabled items', async () => {
      const user = userEvent.setup();

      render(
        <Dropdown>
          <DropdownTrigger asChild>
            <Button>Menu</Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem disabled data-testid="disabled-item">
              Disabled Item
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      );

      await user.click(screen.getByRole('button', { name: 'Menu' }));

      const disabledItem = screen.getByTestId('disabled-item');
      expect(disabledItem).toHaveAttribute('data-disabled');
      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
