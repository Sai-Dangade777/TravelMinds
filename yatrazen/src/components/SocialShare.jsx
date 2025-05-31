import React, { useState, useRef } from 'react';
import { Button } from './ui/ui/button';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaWhatsapp, 
  FaLinkedinIn, 
  FaShareAlt 
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { toast } from 'sonner';
import useClickOutside from '../hooks/useClickOutside';

/**
 * Social media sharing component for trips with hover activation
 * @param {Object} props
 * @param {string} props.url - URL to share
 * @param {string} props.title - Title of content to share
 * @param {string} props.description - Description of content
 * @param {string} props.imageUrl - Image URL to share (if supported)
 */
function SocialShare({ url, title, description, imageUrl }) {
  const [showOptions, setShowOptions] = useState(false);
  
  // Close dropdown when clicking outside or when mouse leaves the component
  const dropdownRef = useClickOutside(() => {
    setShowOptions(false);
  });
  
  // Use current URL if none provided
  const shareUrl = url || window.location.href;
  const shareTitle = title || 'Check out my trip on YatraZen!';
  const shareDesc = description || 'I planned this amazing trip with YatraZen AI trip planner!';

  const handleShare = (platform) => {
    let shareLink = '';
    
    switch(platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'whatsapp':
        shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareDesc}\n\n${shareUrl}`)}`;
        break;
      default:
        // Native share API for mobile devices
        if (navigator.share) {
          navigator.share({
            title: shareTitle,
            text: shareDesc,
            url: shareUrl,
          })
          .then(() => toast.success("Shared successfully"))
          .catch((error) => console.log('Error sharing', error));
          return;
        } else {
          toast.info("Link copied to clipboard!");
          navigator.clipboard.writeText(shareUrl);
          return;
        }
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      {/* Main share button (similar to your map button) */}
      <Button
        className="text-sm bg-black hover:bg-gray-800 text-white px-3 py-1 rounded-md flex items-center gap-2"
      >
        <FaShareAlt /> Share
      </Button>
      
      {/* Share options dropdown - visible on hover */}
      {showOptions && (
        <div 
          className="absolute right-0 mt-2 p-3 bg-white rounded-lg shadow-lg z-10 border border-gray-100 min-w-[180px]"
        >
          <div className="grid grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleShare('facebook')}
              className="bg-blue-500 text-white hover:bg-blue-600 h-9 w-9"
              title="Share on Facebook"
            >
              <FaFacebookF />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleShare('twitter')}
              className="bg-sky-500 text-white hover:bg-sky-600 h-9 w-9"
              title="Share on Twitter"
            >
              <FaTwitter />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleShare('whatsapp')}
              className="bg-green-500 text-white hover:bg-green-600 h-9 w-9"
              title="Share on WhatsApp"
            >
              <FaWhatsapp />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleShare('linkedin')}
              className="bg-blue-700 text-white hover:bg-blue-800 h-9 w-9"
              title="Share on LinkedIn"
            >
              <FaLinkedinIn />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleShare('email')}
              className="bg-red-500 text-white hover:bg-red-600 h-9 w-9"
              title="Share via Email"
            >
              <MdEmail />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleShare('copy')}
              className="bg-gray-500 text-white hover:bg-gray-600 h-9 w-9"
              title="Copy Link"
            >
              <FaShareAlt />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SocialShare;