import { useState, useCallback } from "react";
import { useUniqueId } from "../utils/id.js";

/**
 * Props for the useAvatar hook
 */
export interface UseAvatarProps {
  /**
   * Image source URL
   */
  src?: string;

  /**
   * Fallback content (initials, icon, etc.)
   */
  fallback?: string;

  /**
   * Alt text for the image
   */
  alt: string;

  /**
   * Callback when image loads successfully
   */
  onLoad?: () => void;

  /**
   * Callback when image fails to load
   */
  onError?: () => void;

  /**
   * Custom ID
   */
  id?: string;
}

/**
 * Return type for the useAvatar hook
 */
export interface UseAvatarReturn {
  /**
   * Props for the image element
   */
  imageProps: {
    id: string;
    src?: string;
    alt: string;
    onLoad: () => void;
    onError: () => void;
  };

  /**
   * Props for the fallback element
   */
  fallbackProps: {
    role: "img";
    "aria-label": string;
  };

  /**
   * Whether to show the image or fallback
   */
  showImage: boolean;

  /**
   * Whether image is loading
   */
  isLoading: boolean;

  /**
   * Whether image failed to load
   */
  hasError: boolean;

  /**
   * Retry loading the image
   */
  retry: () => void;
}

/**
 * useAvatar Hook
 *
 * Headless hook for managing avatar image loading with fallback support.
 *
 * Features:
 * - Image load state tracking
 * - Fallback content on load error
 * - Retry functionality
 * - Full ARIA attributes
 * - No styling logic
 *
 * @param props - Configuration options
 * @returns Object containing image and fallback props
 *
 * @example
 * ```tsx
 * const { imageProps, fallbackProps, showImage, hasError } = useAvatar({
 *   src: '/avatar.jpg',
 *   fallback: 'JD',
 *   alt: 'John Doe',
 * });
 *
 * return (
 *   <div className="avatar">
 *     {showImage ? (
 *       <img {...imageProps} />
 *     ) : (
 *       <div {...fallbackProps}>{fallback}</div>
 *     )}
 *   </div>
 * );
 * ```
 */
export function useAvatar(props: UseAvatarProps): UseAvatarReturn {
  const {
    src,
    fallback: _fallback = "",
    alt,
    onLoad,
    onError,
    id: customId,
  } = props;

  // Generate unique ID
  const id = useUniqueId(customId, "avatar");

  // State management
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Image load handler
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setImageLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  // Image error handler
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    setImageLoaded(false);
    onError?.();
  }, [onError]);

  // Retry functionality
  const retry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setImageLoaded(false);
  }, []);

  // Determine whether to show image or fallback
  const showImage = !!src && imageLoaded && !hasError;

  // Image props
  const imageProps = {
    id,
    src,
    alt,
    onLoad: handleLoad,
    onError: handleError,
  };

  // Fallback props
  const fallbackProps = {
    role: "img" as const,
    "aria-label": alt,
  };

  return {
    imageProps,
    fallbackProps,
    showImage,
    isLoading,
    hasError,
    retry,
  };
}
