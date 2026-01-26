/**
 * @tekton/ui - Button Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Button } from '../../src/primitives/button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="secondary">Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-[var(--button-secondary-background)]');
  });

  it('applies size classes', () => {
    const { container } = render(<Button size="sm">Small</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('h-9');
    expect(button?.className).toContain('px-3');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('calls onClick handler', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', async () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} loading>
        Loading
      </Button>
    );

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible</Button>);
    const results = await axe(container);
    // Check that there are no violations
    expect(results.violations).toHaveLength(0);
  });

  it('supports keyboard interaction', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Keyboard</Button>);

    const button = screen.getByRole('button');
    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalled();
  });

  it('supports custom className', () => {
    const { container } = render(<Button className="custom-class">Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('custom-class');
  });

  it('renders all variant options', () => {
    const variants = ['default', 'secondary', 'ghost', 'destructive', 'outline', 'link'] as const;

    variants.forEach(variant => {
      const { container } = render(<Button variant={variant}>Test</Button>);
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });
  });

  it('renders all size options', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;

    sizes.forEach(size => {
      const { container } = render(<Button size={size}>Test</Button>);
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });
  });

  it('supports asChild prop with Slot', () => {
    // asChild should render as the child element, not a button
    const { container } = render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Link Button');
    expect(link).toHaveAttribute('href', '/test');
    // Should not render a button element
    const button = container.querySelector('button');
    expect(button).not.toBeInTheDocument();
  });

  it('shows loading spinner', () => {
    const { container } = render(<Button loading>Loading</Button>);
    const spinner = container.querySelector('[aria-hidden="true"]');
    expect(spinner).toBeInTheDocument();
    expect(spinner?.className).toContain('animate-spin');
  });

  it('merges className with variants correctly', () => {
    const { container } = render(
      <Button variant="secondary" size="lg" className="my-custom-class">
        Test
      </Button>
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('my-custom-class');
    expect(button?.className).toContain('bg-[var(--button-secondary-background)]');
    expect(button?.className).toContain('h-11');
  });
});
