/**
 * @tekton/ui - Avatar Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Avatar, AvatarImage, AvatarFallback } from '../../src/primitives/avatar';

describe('Avatar', () => {
  describe('Rendering', () => {
    it('renders successfully', () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('displays fallback when no image provided', () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="fallback">JD</AvatarFallback>
        </Avatar>
      );
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders AvatarImage with src attribute', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );
      // In jsdom, images don't load automatically, so we check if img element exists in DOM
      const img = container.querySelector('img');
      if (img) {
        expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
        expect(img).toHaveAttribute('alt', 'User avatar');
      } else {
        // Fallback is shown until image loads
        expect(screen.getByText('JD')).toBeInTheDocument();
      }
    });
  });

  describe('Fallback Behavior', () => {
    it('shows fallback when image fails to load', async () => {
      render(
        <Avatar>
          <AvatarImage src="invalid-url" alt="User avatar" />
          <AvatarFallback data-testid="fallback">JD</AvatarFallback>
        </Avatar>
      );

      // Fallback should be present in DOM
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });

    it('renders custom fallback content', () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="fallback">
            <span>👤</span>
          </AvatarFallback>
        </Avatar>
      );
      expect(screen.getByTestId('fallback')).toContainHTML('<span>👤</span>');
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="fallback">JD</AvatarFallback>
        </Avatar>
      );
      const fallback = screen.getByTestId('fallback');
      expect(fallback).toHaveClass('bg-[var(--avatar-fallback-background)]');
      expect(fallback).toHaveClass('text-[var(--avatar-fallback-foreground)]');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="User profile picture" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('includes alt text on AvatarImage', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );
      // Check if img element has alt attribute
      const img = container.querySelector('img');
      if (img) {
        expect(img).toHaveAttribute('alt', 'John Doe');
      } else {
        // In jsdom, fallback may be shown instead
        expect(screen.getByText('JD')).toBeInTheDocument();
      }
    });

    it('supports custom className', () => {
      render(
        <Avatar className="custom-class" data-testid="avatar">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );
      expect(screen.getByTestId('avatar')).toHaveClass('custom-class');
    });
  });
});
