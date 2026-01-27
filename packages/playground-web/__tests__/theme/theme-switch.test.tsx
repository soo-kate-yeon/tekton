/**
 * ThemeSwitch Tests
 * SPEC-PLAYGROUND-001 Milestone 3: Theme Integration
 *
 * Test Coverage:
 * - Theme selection UI rendering
 * - Theme change callback
 * - BUILTIN_THEMES integration
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeSwitch } from '@/components/theme/theme-switch';
import { BUILTIN_THEMES } from '@tekton/core';

describe('ThemeSwitch', () => {
  it('should render theme selector', () => {
    render(<ThemeSwitch />);

    const select = screen.getByLabelText('Theme:');
    expect(select).toBeDefined();
  });

  it('should render all built-in themes', () => {
    render(<ThemeSwitch />);

    const select = screen.getByLabelText('Theme:') as HTMLSelectElement;
    const options = Array.from(select.options).map((opt) => opt.value);

    BUILTIN_THEMES.forEach((themeId) => {
      expect(options).toContain(themeId);
    });
  });

  it('should default to first theme if no currentTheme provided', () => {
    render(<ThemeSwitch />);

    const select = screen.getByLabelText('Theme:') as HTMLSelectElement;
    expect(select.value).toBe(BUILTIN_THEMES[0]);
  });

  it('should use provided currentTheme', () => {
    const currentTheme = 'saas-dashboard';
    render(<ThemeSwitch currentTheme={currentTheme} />);

    const select = screen.getByLabelText('Theme:') as HTMLSelectElement;
    expect(select.value).toBe(currentTheme);
  });

  it('should call onThemeChange when selection changes', () => {
    const onThemeChange = vi.fn();
    render(<ThemeSwitch onThemeChange={onThemeChange} />);

    const select = screen.getByLabelText('Theme:') as HTMLSelectElement;
    const newTheme = 'tech-startup';

    fireEvent.change(select, { target: { value: newTheme } });

    expect(onThemeChange).toHaveBeenCalledWith(newTheme);
  });

  it('should update internal state when selection changes', () => {
    render(<ThemeSwitch />);

    const select = screen.getByLabelText('Theme:') as HTMLSelectElement;
    const newTheme = 'korean-fintech';

    fireEvent.change(select, { target: { value: newTheme } });

    expect(select.value).toBe(newTheme);
  });

  it('should handle theme change without onThemeChange callback', () => {
    render(<ThemeSwitch />);

    const select = screen.getByLabelText('Theme:') as HTMLSelectElement;
    const newTheme = 'warm-humanist';

    // Should not throw
    expect(() => {
      fireEvent.change(select, { target: { value: newTheme } });
    }).not.toThrow();

    expect(select.value).toBe(newTheme);
  });

  it('should render with correct CSS classes', () => {
    const { container } = render(<ThemeSwitch />);

    const wrapper = container.querySelector('div');
    expect(wrapper?.className).toContain('flex');
    expect(wrapper?.className).toContain('gap-2');
    expect(wrapper?.className).toContain('items-center');
  });

  it('should have accessible label', () => {
    render(<ThemeSwitch />);

    const label = screen.getByText('Theme:');
    expect(label).toBeDefined();
    expect(label.tagName).toBe('LABEL');
  });

  it('should have select with proper id', () => {
    render(<ThemeSwitch />);

    const select = screen.getByRole('combobox');
    expect(select.id).toBe('theme-select');
  });

  it('should render options in correct order', () => {
    render(<ThemeSwitch />);

    const select = screen.getByLabelText('Theme:') as HTMLSelectElement;
    const options = Array.from(select.options).map((opt) => opt.value);

    // Should match BUILTIN_THEMES order
    expect(options).toEqual(expect.arrayContaining(BUILTIN_THEMES));
  });
});
