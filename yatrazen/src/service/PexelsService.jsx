/**
 * Service for fetching images from Pexels API - a free image provider
 */

// Pexels API key from environment variables
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

// Warn if API key is missing
if (!PEXELS_API_KEY) {
  console.warn('No Pexels API key found. Image fetching will likely fail. Set VITE_PEXELS_API_KEY in your .env.local file.');
}

// Cache constants
const CACHE_KEY = 'yatrazen_pexels_cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Simple cache with localStorage persistence
export const imageCache = {
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
 * Helper function to retry failed requests
 */
async function fetchWithRetry(url, options, retries = 2) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries <= 0) throw error;
    
    // Wait before retrying (exponential backoff)
    await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
    
    // Retry with one less retry attempt
    return fetchWithRetry(url, options, retries - 1);
  }
}

/**
 * Fetch a travel-related image for a location
 * @param {string} location - The location name to search for
 * @param {Object} options - Additional options
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
    
    // Fetch from Pexels with CORS proxy
    const apiUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=${options.orientation || 'landscape'}`;
    
    // Use CORS proxy to avoid CORS errors
    const corsProxyUrl = 'https://corsproxy.io/?';
    
    // Try with proxy
    const response = await fetchWithRetry(corsProxyUrl + encodeURIComponent(apiUrl), {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.photos || data.photos.length === 0) {
      throw new Error('No images found');
    }
    
    // Get the medium size image (good balance of quality and load time)
    const imageUrl = data.photos[0].src.large;
    
    // Cache the result
    imageCache.set(cacheKey, imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error("Error fetching location image:", error);
    return getPlaceholderImage(location, options.type);
  }
}

/**
 * Generate a placeholder image with text when API fails
 */
function getPlaceholderImage(text, type = 'place') {
  // Use placeholder.com to generate colored placeholder with text
  const size = type === 'trip' ? '800x400' : '400x300';
  const bgColor = type === 'hotel' ? 'e0f2fe' : (type === 'place' ? 'f0fdf4' : 'f1f5f9');
  const textColor = '1e293b';
  
  return `https://placehold.co/${size}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
}

/**
 * Batch fetch images for multiple items
 */
export async function batchFetchImages(items, getNameFn, type = 'place') {
  // First check cache for all items
  const uncachedItems = [];
  const results = new Array(items.length);
  
  // Define query options based on type
  const options = { type };
  if (type === 'hotel') {
    options.query = 'hotel building';
  } else if (type === 'place') {
    options.query = 'tourist attraction';  
  } else {
    options.query = 'city skyline travel';
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
  const BATCH_SIZE = 3; // Reduced batch size for better reliability
  
  for (let i = 0; i < uncachedItems.length; i += BATCH_SIZE) {
    const batch = uncachedItems.slice(i, i + BATCH_SIZE);
    
    // Create a batch of promises with more robust error handling
    const promises = batch.map(({ name }) => {
      return fetchLocationImage(name, options)
        .catch(error => {
          console.warn(`Failed to fetch image for "${name}":`, error);
          return getPlaceholderImage(name, type);
        });
    });
    
    try {
      // Wait for all promises in this batch
      const batchResults = await Promise.all(promises);
      
      // Assign results to the correct positions
      batch.forEach((item, batchIndex) => {
        const imageUrl = batchResults[batchIndex];
        results[item.index] = imageUrl;
        
        // Cache the result if it's valid
        if (imageUrl && !imageUrl.includes('placehold.co')) {
          const cacheKey = `${item.name}-${options.query || ''}-${options.orientation || ''}`;
          imageCache.set(cacheKey, imageUrl);
        }
      });
      
    } catch (error) {
      console.error("Batch processing error:", error);
      // Fill remaining results with placeholders on catastrophic failure
      batch.forEach(({ index, name }) => {
        if (!results[index]) {
          results[index] = getPlaceholderImage(name, type);
        }
      });
    }
    
    // Add a longer delay between batches
    if (i + BATCH_SIZE < uncachedItems.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return results;
}