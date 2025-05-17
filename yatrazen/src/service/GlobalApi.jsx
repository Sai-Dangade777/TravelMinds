// Place search using OpenStreetMap Nominatim API
import { fetchLocationImage, batchFetchImages } from './PexelsService';

/**
 * Search for places using OpenStreetMap Nominatim.
 * @param {string} query - The place name or address to search for.
 * @returns {Promise<Array>} - Array of place results.
 */
export const GetPlaceDetails = async (query) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`;
    const response = await fetch(url, {
        headers: {
            'Accept-Language': 'en',
            'User-Agent': 'TravelMinds/1.0 (sai3dangade@gmail.com)'
        }
    });
    return response.json();
};

// Better fallback image URLs that work reliably
export const PHOTO_REF_URL = 'https://placehold.co/300x300/e2e8f0/1e293b?text=Hotel';
export const PLACE_PHOTO_URL = 'https://placehold.co/300x300/e2e8f0/1e293b?text=Place';
export const TRIP_PHOTO_URL = 'https://placehold.co/600x300/e2e8f0/1e293b?text=Trip';

/**
 * Get an image URL for a location, using Unsplash if available
 * @param {string} locationName - Name of the location
 * @param {string} type - Type of image (hotel, place, trip)
 * @returns {Promise<string>} - Image URL
 */
export const getLocationImageUrl = async (locationName, type = 'trip') => {
    try {
        // Define query options based on type
        const options = {};
        
        if (type === 'hotel') {
            options.query = 'hotel accommodation';
            options.orientation = 'landscape';
        } else if (type === 'place') {
            options.query = 'landmark attraction';
            options.orientation = 'landscape';  
        } else {
            // Default trip options
            options.query = 'cityscape skyline travel';
            options.orientation = 'landscape';
        }
        
        const imageUrl = await fetchLocationImage(locationName, options);
        
        if (imageUrl) {
            return imageUrl;
        }
        
        // Fallback to default images
        if (type === 'hotel') return PHOTO_REF_URL;
        if (type === 'place') return PLACE_PHOTO_URL;
        return TRIP_PHOTO_URL;
    } catch (error) {
        console.error(`Failed to get image for ${locationName}:`, error);
        
        // Fallback to default images
        if (type === 'hotel') return PHOTO_REF_URL;
        if (type === 'place') return PLACE_PHOTO_URL;
        return TRIP_PHOTO_URL;
    }
};

// Improved image error handling
export const handleImageError = (event) => {
    const fallbackUrl = event.target.dataset.fallback || PHOTO_REF_URL;
    if (event.target.src !== fallbackUrl) {
        event.target.src = fallbackUrl;
    }
    // Remove loading state if it exists in parent component
    if (event.target.dataset.loadingStateId) {
        try {
            const stateUpdateFn = window.__imageLoadingStateUpdaters?.[event.target.dataset.loadingStateId];
            if (typeof stateUpdateFn === 'function') {
                stateUpdateFn(false);
            }
        } catch (e) {
            console.error("Failed to update loading state:", e);
        }
    }
};

/**
 * Batch process images for multiple items
 * @param {Array} items - Array of items (hotels or places)
 * @param {Function} getNameFn - Function to get the name from an item
 * @param {String} type - Type of image to fetch (hotel, place)
 * @param {Function} setImageFn - Function to set the image URL on an item
 * @returns {Promise<Array>} - Array of items with image URLs
 */
export const batchProcessImages = async (items, getNameFn, type, setImageFn) => {
  if (!items || items.length === 0) return [];
  
  try {
    const imageUrls = await batchFetchImages(items, getNameFn, type);
    
    return items.map((item, index) => {
      const imageUrl = imageUrls[index];
      if (imageUrl) {
        return setImageFn(item, imageUrl);
      }
      return item;
    });
  } catch (error) {
    console.error(`Error batch processing ${type} images:`, error);
    return items; // Return original items if there was an error
  }
};