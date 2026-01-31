/**
 * @tekton/ui - Image Component
 * [SPEC-COMPONENT-001-C] [PRIMITIVE]
 */

import * as React from 'react';
import { cn } from '../lib/utils';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Show loading skeleton
   */
  loading?: 'lazy' | 'eager';
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, alt, loading = 'lazy', ...props }, ref) => {
    return (
      <img
        ref={ref}
        alt={alt}
        loading={loading}
        className={cn(
          'rounded-[var(--radius-md)]',
          'bg-[var(--image-placeholder-background)]',
          className
        )}
        {...props}
      />
    );
  }
);
Image.displayName = 'Image';

export { Image };
