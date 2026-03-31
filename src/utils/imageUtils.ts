/**
 * Utility functions for handling image URLs
 */

export const getProductImage = (image?: string | null, fallbackSize?: string) => {
  const defaultFallback = fallbackSize || 'seed/product/600/800';
  if (!image) return `https://picsum.photos/${defaultFallback}`;
  
  let imageUrl = image.trim();
  if (imageUrl.startsWith('ttps://')) {
    imageUrl = 'https://' + imageUrl.substring(7);
  } else if (imageUrl.startsWith('ttps//')) {
    imageUrl = 'https://' + imageUrl.substring(6);
  } else if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    imageUrl = `https://${imageUrl}`;
  }
  
  try {
    new URL(imageUrl);
    return imageUrl;
  } catch {
    return `https://picsum.photos/${defaultFallback}`;
  }
};
