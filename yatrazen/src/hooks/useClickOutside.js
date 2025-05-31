import { useEffect, useRef } from 'react';

/**
 * Hook that handles clicks outside of the specified element
 * @param {Function} handler - Function to call when a click outside occurs
 * @returns {Object} ref - Ref to attach to the element
 */
const useClickOutside = (handler) => {
  const ref = useRef();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handler]);
  
  return ref;
};

export default useClickOutside;