import React, { memo, useMemo } from 'react';
import logo_dark from "/images/dark_logo_wbg.png"
import logo from "/images/logo_wbg.png"
const LOGO_SIZES = {
  small: { width: 'w-10 sm:w-12', height: 'h-10 sm:h-12' },
  medium: { width: 'w-12 sm:w-14', height: 'h-12 sm:h-14' },
  large: { width: 'w-14 sm:w-16', height: 'h-14 sm:h-16' }
};
interface LogoProps {
  imgWidth?: number;
  imgHeight?: number;
  textSize?: string;
  showText?: boolean;
  layout?: "vertical" | "horizontal";
  className?: string;
}
const Logo: React.FC<LogoProps> = memo(({
  imgWidth = 50,
  imgHeight = 48,
  textSize = "1rem",
  showText = true,
  layout = "horizontal",
  className = ""
}) => {
  // Memoize responsive sizes with predefined classes
  const sizeClass = useMemo(() => {
    if (imgWidth <= 60) return LOGO_SIZES.small;
    if (imgWidth <= 80) return LOGO_SIZES.medium;
    return LOGO_SIZES.large;
  }, [imgWidth]);
  const responsiveTextSize = useMemo(() => {
    const size = parseFloat(textSize);
    if (size <= 1) return 'text-sm sm:text-base';
    if (size <= 1.25) return 'text-base sm:text-lg';
    if (size <= 1.5) return 'text-lg sm:text-xl';
    return 'text-xl sm:text-2xl';
  }, [textSize]);
  return (
    <div
      className={`
        flex 
        ${layout === "vertical" ? "flex-col" : "flex-row"} 
        items-center 
        justify-center 
        text-center 
        gap-1 sm:gap-2 
        ${className}
      `}
    >
      {/* Light mode logo */}
      <picture>
        <source srcSet={logo_dark} type="image/webp" />
        <img
          className={`dark:hidden object-contain ${sizeClass.width} ${sizeClass.height}`}
          width={imgWidth}
          height={imgHeight}
          src={logo_dark}
          alt="SpaceTechs Logo"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      {/* Dark mode logo */}
      <picture>
        <source srcSet={logo} type="image/webp" />
        <img
          className={`hidden dark:block object-contain ${sizeClass.width} ${sizeClass.height}`}
          width={imgWidth}
          height={imgHeight}
          src={logo}
          alt="SpaceTechs Logo"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      {showText && (
        <h1
          className={`font-bold font-outfit transition-all duration-300 ${responsiveTextSize}`}
          style={{ fontSize: `clamp(0.875rem, ${textSize}, 2rem)` }}
        >
          <span
            className="
              text-transparent 
              bg-clip-text 
              bg-gradient-to-r 
              from-brand-500 
              to-brand-300 
              drop-shadow-sm
              dark:from-brand-300
              dark:to-brand-100
            "
          >
            Space
          </span>
          <span
            className="
              ml-0.5 sm:ml-1
              text-gray-800 
              drop-shadow-sm
              dark:text-gray-100
              transition-colors
            "
          >
            Techs
          </span>
        </h1>
      )}
    </div>
  );
});
Logo.displayName = 'Logo';
export default Logo;