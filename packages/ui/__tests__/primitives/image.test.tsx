/**
 * @tekton/ui - Image Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Image } from '../../src/primitives/image';

describe('Image', () => {
  describe('Rendering', () => {
    it('renders successfully', () => {
      render(<Image src="https://example.com/image.jpg" alt="Test image" data-testid="image" />);
      expect(screen.getByTestId('image')).toBeInTheDocument();
    });

    it('renders with src and alt attributes', () => {
      render(
        <Image src="https://example.com/photo.jpg" alt="Photo description" data-testid="image" />
      );
      const img = screen.getByTestId('image');
      expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
      expect(img).toHaveAttribute('alt', 'Photo description');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null as HTMLImageElement | null };
      render(<Image ref={ref} src="test.jpg" alt="Test" />);
      expect(ref.current).toBeInstanceOf(HTMLImageElement);
    });
  });

  describe('Lazy Loading', () => {
    it('applies lazy loading by default', () => {
      render(<Image src="https://example.com/image.jpg" alt="Test" data-testid="image" />);
      expect(screen.getByTestId('image')).toHaveAttribute('loading', 'lazy');
    });

    it('supports eager loading', () => {
      render(
        <Image src="https://example.com/image.jpg" alt="Test" loading="eager" data-testid="image" />
      );
      expect(screen.getByTestId('image')).toHaveAttribute('loading', 'eager');
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for placeholder background', () => {
      render(<Image src="https://example.com/image.jpg" alt="Test" data-testid="image" />);
      expect(screen.getByTestId('image')).toHaveClass('bg-[var(--image-placeholder-background)]');
    });
  });

  describe('Responsive Images', () => {
    it('supports width and height attributes', () => {
      render(
        <Image
          src="https://example.com/image.jpg"
          alt="Test"
          width={800}
          height={600}
          data-testid="image"
        />
      );
      const img = screen.getByTestId('image');
      expect(img).toHaveAttribute('width', '800');
      expect(img).toHaveAttribute('height', '600');
    });

    it('supports srcSet for responsive images', () => {
      render(
        <Image
          src="https://example.com/image.jpg"
          srcSet="https://example.com/image-400.jpg 400w, https://example.com/image-800.jpg 800w"
          alt="Test"
          data-testid="image"
        />
      );
      expect(screen.getByTestId('image')).toHaveAttribute(
        'srcset',
        'https://example.com/image-400.jpg 400w, https://example.com/image-800.jpg 800w'
      );
    });

    it('supports sizes attribute', () => {
      render(
        <Image
          src="https://example.com/image.jpg"
          sizes="(max-width: 600px) 100vw, 50vw"
          alt="Test"
          data-testid="image"
        />
      );
      expect(screen.getByTestId('image')).toHaveAttribute(
        'sizes',
        '(max-width: 600px) 100vw, 50vw'
      );
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <figure>
          <Image src="https://example.com/image.jpg" alt="Descriptive alt text" />
          <figcaption>Image caption</figcaption>
        </figure>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('requires alt attribute', () => {
      render(
        <Image src="https://example.com/image.jpg" alt="Required alt text" data-testid="image" />
      );
      expect(screen.getByTestId('image')).toHaveAttribute('alt', 'Required alt text');
    });

    it('supports empty alt for decorative images', () => {
      render(<Image src="https://example.com/decorative.jpg" alt="" data-testid="image" />);
      expect(screen.getByTestId('image')).toHaveAttribute('alt', '');
    });

    it('supports custom className', () => {
      render(
        <Image
          src="https://example.com/image.jpg"
          alt="Test"
          className="custom-class"
          data-testid="image"
        />
      );
      expect(screen.getByTestId('image')).toHaveClass('custom-class');
    });

    it('supports custom object-fit with className', () => {
      render(
        <Image
          src="https://example.com/image.jpg"
          alt="Test"
          className="object-cover"
          data-testid="image"
        />
      );
      expect(screen.getByTestId('image')).toHaveClass('object-cover');
    });
  });
});
