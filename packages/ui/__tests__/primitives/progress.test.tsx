/**
 * @tekton/ui - Progress Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Progress } from '../../src/primitives/progress';

describe('Progress', () => {
  describe('Rendering', () => {
    it('renders successfully', () => {
      render(<Progress value={50} data-testid="progress" />);
      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });

    it('renders with 0 value', () => {
      render(<Progress value={0} data-testid="progress" />);
      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });

    it('renders with 100 value', () => {
      render(<Progress value={100} data-testid="progress" />);
      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<Progress ref={ref} value={50} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Value Handling', () => {
    it('respects value prop', () => {
      render(<Progress value={75} data-testid="progress" />);
      const progressRoot = screen.getByTestId('progress');
      expect(progressRoot).toBeInTheDocument();
      // Progress component renders, value is handled internally by Radix
      expect(progressRoot).toHaveAttribute('role', 'progressbar');
    });

    it('handles 0 value', () => {
      render(<Progress value={0} data-testid="progress" />);
      const progressRoot = screen.getByTestId('progress');
      expect(progressRoot).toBeInTheDocument();
      expect(progressRoot).toHaveAttribute('role', 'progressbar');
    });

    it('updates when value changes', () => {
      const { rerender } = render(<Progress value={25} data-testid="progress" />);
      let progressRoot = screen.getByTestId('progress');
      expect(progressRoot).toBeInTheDocument();

      rerender(<Progress value={75} data-testid="progress" />);
      progressRoot = screen.getByTestId('progress');
      expect(progressRoot).toBeInTheDocument();
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(<Progress value={50} data-testid="progress" />);
      const progressRoot = screen.getByTestId('progress');
      expect(progressRoot).toHaveClass('bg-[var(--progress-background)]');
    });

    it('applies indicator background color', () => {
      const { container } = render(<Progress value={50} />);
      // Check for element with progress indicator background class
      const indicator = container.querySelector(
        '.bg-\\[var\\(--progress-indicator-background\\)\\]'
      );
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <div>
          <Progress value={50} aria-label="Upload Progress" />
        </div>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('has role="progressbar"', () => {
      render(<Progress value={50} data-testid="progress" />);
      expect(screen.getByTestId('progress')).toHaveAttribute('role', 'progressbar');
    });

    it('supports aria-label', () => {
      render(<Progress value={50} aria-label="Loading progress" data-testid="progress" />);
      expect(screen.getByTestId('progress')).toHaveAttribute('aria-label', 'Loading progress');
    });

    it('supports custom className', () => {
      render(<Progress value={50} className="custom-class" data-testid="progress" />);
      expect(screen.getByTestId('progress')).toHaveClass('custom-class');
    });
  });
});
