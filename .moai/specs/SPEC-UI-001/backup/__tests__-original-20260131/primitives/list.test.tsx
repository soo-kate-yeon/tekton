/**
 * @tekton/ui - List Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { List, ListItem } from '../../src/primitives/list';

describe('List', () => {
  describe('Rendering', () => {
    it('renders successfully with children', () => {
      render(
        <List>
          <ListItem>Item 1</ListItem>
          <ListItem>Item 2</ListItem>
        </List>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('renders as <ul> by default', () => {
      render(
        <List data-testid="list">
          <ListItem>Item</ListItem>
        </List>
      );
      expect(screen.getByTestId('list').tagName).toBe('UL');
    });

    it('renders as <ol> when ordered=true', () => {
      render(
        <List ordered data-testid="list">
          <ListItem>Item</ListItem>
        </List>
      );
      expect(screen.getByTestId('list').tagName).toBe('OL');
    });

    it('renders multiple list items', () => {
      render(
        <List>
          <ListItem data-testid="item1">First</ListItem>
          <ListItem data-testid="item2">Second</ListItem>
          <ListItem data-testid="item3">Third</ListItem>
        </List>
      );
      expect(screen.getByTestId('item1')).toBeInTheDocument();
      expect(screen.getByTestId('item2')).toBeInTheDocument();
      expect(screen.getByTestId('item3')).toBeInTheDocument();
    });
  });

  describe('List Types', () => {
    it('creates unordered list by default', () => {
      render(
        <List data-testid="list">
          <ListItem>Bullet point 1</ListItem>
          <ListItem>Bullet point 2</ListItem>
        </List>
      );
      expect(screen.getByTestId('list').tagName).toBe('UL');
    });

    it('creates ordered list when ordered prop is true', () => {
      render(
        <List ordered data-testid="list">
          <ListItem>Step 1</ListItem>
          <ListItem>Step 2</ListItem>
        </List>
      );
      expect(screen.getByTestId('list').tagName).toBe('OL');
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(
        <List data-testid="list">
          <ListItem data-testid="item">Item</ListItem>
        </List>
      );
      expect(screen.getByTestId('list')).toHaveClass('text-[var(--list-foreground)]');
      expect(screen.getByTestId('item')).toHaveClass('text-[var(--list-item-foreground)]');
    });
  });

  describe('Nested Lists', () => {
    it('supports nested lists', () => {
      render(
        <List data-testid="parent">
          <ListItem>Parent 1</ListItem>
          <ListItem>
            Parent 2
            <List data-testid="child">
              <ListItem>Child 1</ListItem>
              <ListItem>Child 2</ListItem>
            </List>
          </ListItem>
        </List>
      );
      expect(screen.getByTestId('parent')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations for unordered list', async () => {
      const { container } = render(
        <List>
          <ListItem>Item 1</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 3</ListItem>
        </List>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('has no axe violations for ordered list', async () => {
      const { container } = render(
        <List ordered>
          <ListItem>First step</ListItem>
          <ListItem>Second step</ListItem>
          <ListItem>Third step</ListItem>
        </List>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('supports custom className on List', () => {
      render(
        <List className="custom-class" data-testid="list">
          <ListItem>Item</ListItem>
        </List>
      );
      expect(screen.getByTestId('list')).toHaveClass('custom-class');
    });

    it('supports custom className on ListItem', () => {
      render(
        <List>
          <ListItem className="custom-item" data-testid="item">
            Item
          </ListItem>
        </List>
      );
      expect(screen.getByTestId('item')).toHaveClass('custom-item');
    });

    it('maintains proper list semantics', () => {
      render(
        <List data-testid="list">
          <ListItem data-testid="item">Item</ListItem>
        </List>
      );
      const list = screen.getByTestId('list');
      const item = screen.getByTestId('item');
      expect(list.tagName).toBe('UL');
      expect(item.tagName).toBe('LI');
    });
  });
});
