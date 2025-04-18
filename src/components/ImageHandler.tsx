// src/components/ImageHandler.tsx
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ImageHandlerProps {
  imageSource: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

/**
 * ImageHandler component for consistent image handling across the application
 * This component handles various image source formats:
 * 1. Base64 strings
 * 2. URLs from Supabase storage
 * 3. Local image paths
 */
const ImageHandler: React.FC<ImageHandlerProps> = ({
  imageSource,
  alt,
  className = '',
  fallbackSrc = '/placeholder-image.jpg'
}) => {
  const [src, setSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

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
      setSrc(`/images/${imageSource}`);
      setLoading(false);
      return;
    }

    // Handle other URLs
    setSrc(imageSource);
    setLoading(false);
  }, [imageSource, fallbackSrc]);

  const handleError = () => {
    console.error(`Error loading image: ${src}`);
    setError(true);
    setSrc(fallbackSrc);
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
          className={className}
          onError={handleError}
        />
      )}
    </>
  );
};

export default ImageHandler;