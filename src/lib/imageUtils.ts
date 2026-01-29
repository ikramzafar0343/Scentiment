/**
 * Image compression and optimization utilities
 */

/**
 * Compress an image file to reduce its size
 * @param file - The image file to compress
 * @param maxWidth - Maximum width (default: 800)
 * @param maxHeight - Maximum height (default: 800)
 * @param quality - JPEG quality 0-1 (default: 0.8)
 * @returns Promise<string> - Base64 data URL of compressed image
 */
export function compressImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Check if a data URL is too large (over 1MB)
 * @param dataUrl - Base64 data URL
 * @returns boolean - True if data URL is too large
 */
export function isDataUrlTooLarge(dataUrl: string, maxSizeMB: number = 1): boolean {
  // Approximate size: base64 is ~33% larger than binary
  const sizeInBytes = (dataUrl.length * 3) / 4;
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return sizeInMB > maxSizeMB;
}

/**
 * Get a placeholder image URL for products
 * @param productName - Name of the product
 * @returns string - Placeholder image URL
 */
export function getPlaceholderImageUrl(productName: string): string {
  // For now, return a simple placeholder
  // In production, you might want to use an image service or generate thumbnails
  return `https://placehold.co/600x400?text=${encodeURIComponent(productName)}`;
}
