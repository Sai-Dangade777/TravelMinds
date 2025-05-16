/**
 * Service for fetching images from Unsplash API
 */

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const CACHE_KEY = 'yatrazen_image_cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Simple cache with localStorage persistence
const imageCache = {
  cache: {},
  
  init() {
    try {
      const savedCache = localStorage.getItem(CACHE_KEY);
      if (savedCache) {
        const parsedCache = JSON.parse(savedCache);
        // Filter out expired cache entries
        const now = Date.now();
        Object.keys(parsedCache).forEach(key => {
          if (parsedCache[key].expiry < now) {
            delete parsedCache[key];
          }
        });
        this.cache = parsedCache;
      }
    } catch (e) {
      console.error("Failed to load image cache", e);
    }
    return this;
  },
  
  save() {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(this.cache));
    } catch (e) {
      console.error("Failed to save image cache", e);
    }
  },
  
  get(key) {
    const cacheItem = this.cache[key];
    return cacheItem?.url;
  },
  
  set(key, url) {
    this.cache[key] = {
      url,
      expiry: Date.now() + CACHE_EXPIRY
    };
    this.save();
  }
}.init();

/**
 * Fetch a travel-related image for a location
 * @param {string} location - The location name to search for
 * @param {Object} options - Additional options
 * @param {string} options.query - Additional search terms
 * @param {string} options.orientation - Image orientation (landscape, portrait, squarish)
 * @returns {Promise<string>} - URL to an image
 */
export async function fetchLocationImage(location, options = {}) {
  try {
    const cacheKey = `${location}-${options.query || ''}-${options.orientation || ''}`;
    
    // Check cache first
    const cachedUrl = imageCache.get(cacheKey);
    if (cachedUrl) return cachedUrl;
    
    // Build search query
    const query = `${location} ${options.query || 'travel landmark'}`;
    
    // Fetch from Unsplash
    const params = new URLSearchParams({
      query: query,
      per_page: 1,
      orientation: options.orientation || 'landscape',
      content_filter: 'high'
    });
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?${params}`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error('No images found');
    }
    
    const imageUrl = data.results[0].urls.regular;
    
    // Cache the result
    imageCache.set(cacheKey, imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error("Error fetching location image:", error);
    return null;
  }
}

/**
 * Fetch multiple travel-related images for a location
 * @param {string} location - The location name to search for
 * @param {number} count - Number of images to return (max 30)
 * @returns {Promise<Array<string>>} - Array of image URLs
 */
export async function fetchMultipleLocationImages(location, count = 4) {
  try {
    // Build search query
    const query = `${location} travel landmark`;
    const cacheKey = `multi-${location}-${count}`;
    
    // Check cache
    const cachedUrls = imageCache.get(cacheKey);
    if (cachedUrls) return JSON.parse(cachedUrls);
    
    // Limit count to reasonable number
    const safeCount = Math.min(count, 30);
    
    const params = new URLSearchParams({
      query: query,
      per_page: safeCount,
      orientation: 'landscape',
      content_filter: 'high'
    });
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?${params}`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error('No images found');
    }
    
    const imageUrls = data.results.map(result => result.urls.regular);
    
    // Cache the results
    imageCache.set(cacheKey, JSON.stringify(imageUrls));
    
    return imageUrls;
  } catch (error) {
    console.error("Error fetching multiple location images:", error);
    return [];
  }
}

/**
 * Batch fetch images for multiple locations/entities
 * This helps reduce the number of API calls when processing many items
 * 
 * @param {Array<Object>} items - Array of items that need images
 * @param {Function} getNameFn - Function to extract the search term from each item
 * @param {String} type - Type of image to fetch (hotel, place, trip)
 * @returns {Promise<Array<String>>} - Array of image URLs
 */
export async function batchFetchImages(items, getNameFn, type = 'place') {
  // First check cache for all items
  const uncachedItems = [];
  const results = new Array(items.length);
  
  // Define query options based on type
  const options = {};
  if (type === 'hotel') {
    options.query = 'hotel accommodation';
    options.orientation = 'landscape';
  } else if (type === 'place') {
    options.query = 'landmark attraction';
    options.orientation = 'landscape';  
  } else {
    options.query = 'cityscape skyline travel';
    options.orientation = 'landscape';
  }
  
  // Check cache first for each item
  items.forEach((item, index) => {
    const name = getNameFn(item);
    const cacheKey = `${name}-${options.query || ''}-${options.orientation || ''}`;
    const cachedUrl = imageCache.get(cacheKey);
    
    if (cachedUrl) {
      results[index] = cachedUrl;
    } else {
      uncachedItems.push({ item, index, name });
    }
  });
  
  // If all items were cached, return early
  if (uncachedItems.length === 0) {
    return results;
  }
  
  // For uncached items, fetch in batches to avoid rate limiting
  const BATCH_SIZE = 5; // Adjust based on your API limits
  
  for (let i = 0; i < uncachedItems.length; i += BATCH_SIZE) {
    const batch = uncachedItems.slice(i, i + BATCH_SIZE);
    
    // Create a batch of promises
    const promises = batch.map(({ name }) => {
      return fetchLocationImage(name, options)
        .catch(() => null); // Handle individual failures
    });
    
    // Wait for all promises in this batch
    const batchResults = await Promise.all(promises);
    
    // Assign results to the correct positions
    batch.forEach((item, batchIndex) => {
      const imageUrl = batchResults[batchIndex];
      results[item.index] = imageUrl;
      
      // Cache the result if it's valid
      if (imageUrl) {
        const cacheKey = `${item.name}-${options.query || ''}-${options.orientation || ''}`;
        imageCache.set(cacheKey, imageUrl);
      }
    });
    
    // Add a small delay between batches to avoid overwhelming the API
    if (i + BATCH_SIZE < uncachedItems.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return results;
}