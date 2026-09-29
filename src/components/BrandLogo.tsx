import React from 'react';

// Single Official Source of Truth for the Website Brand Logo
export const OFFICIAL_LOGO_URL = "https://i.ibb.co.com/Cxp9msL/Picsart-26-09-25-22-06-19-330.jpg";

interface BrandLogoProps {
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = "w-11 h-11 rounded-full object-cover ring-2 ring-[#C9A66B]/80 shadow-sm", 
  alt = "Official Website Logo",
  onClick 
}) => {
  return (
    <img
      src={OFFICIAL_LOGO_URL}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onClick={onClick}
    />
  );
};
