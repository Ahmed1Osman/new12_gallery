// src/components/ImageHandler.tsx
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ImageHandlerProps {
  imageSource: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  preserveAspectRatio?: boolean; // New prop to control aspect ratio preservation
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'; // New prop for object-fit
}

/**
 * ImageHandler component for consistent image handling across the application
 * This component handles various image source formats:
 * 1. Base64 strings
 * 2. URLs from Supabase storage
 * 3. Local image paths
 * 
 * It also provides better control over how images are displayed:
 * - preserveAspectRatio: When true, ensures the image's natural aspect ratio is maintained
 * - objectFit: Controls how the image fits within its container
 */
const ImageHandler: React.FC<ImageHandlerProps> = ({
  imageSource,
  alt,
  className = '',
  fallbackSrc = '/placeholder-image.jpg',
  preserveAspectRatio = true,
  objectFit = 'contain'
}) => {
  const [src, setSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 2;

  useEffect(() => {
    setLoading(true);
    setError(false);
    setRetryCount(0);

    if (!imageSource) {
      setSrc(fallbackSrc);
      setLoading(false);
      return;
    }

    // Handle base64 image strings
    if (imageSource.startsWith('data:image')) {
      setSrc(imageSource);
      setLoading(false);
      return;
    }

    // Handle Supabase URLs
    if (imageSource.includes('supabase')) {
      // Fix double slashes in Supabase URLs if they exist
      const fixedUrl = imageSource.replace(/\/\/paintings\/\//g, '/paintings/');
      setSrc(fixedUrl);
      setLoading(false);
      return;
    }

    // Handle relative paths for local images
    if (!imageSource.startsWith('http')) {
      // Check for spaces and special characters in the filename and encode if needed
      const encodedFileName = encodeURIComponent(imageSource);
      setSrc(`/images/${encodedFileName}`);
      setLoading(false);
      return;
    }

    // Handle other URLs
    setSrc(imageSource);
    setLoading(false);
  }, [imageSource, fallbackSrc]);

  const handleError = () => {
    console.error(`Error loading image: ${src}`);
    
    if (retryCount < maxRetries) {
      // Try one more time with a slight delay
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        // Force re-render with the same source to retry loading
        const currentSrc = src;
        setSrc('');
        setTimeout(() => setSrc(currentSrc), 10);
      }, 500);
    } else {
      setError(true);
      setSrc(fallbackSrc);
    }
  };

  // Compute final className
  const computedClassName = `${className} ${
    preserveAspectRatio ? 'w-auto h-auto' : ''
  }`.trim();
  
  // Compute style with objectFit
  const imageStyle = {
    objectFit,
  };

  return (
    <>
      {loading ? (
        <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <img
          src={error ? fallbackSrc : src}
          alt={alt}
          className={computedClassName}
          style={imageStyle}
          onError={handleError}
          onLoad={() => setLoading(false)}
          loading="lazy" // Add lazy loading for performance
        />
      )}
    </>
  );
};

export default ImageHandler;