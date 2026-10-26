import React from 'react';

interface IndoDigitalLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'lockup';
  showTagline?: boolean;
}

export const IndoDigitalLogo: React.FC<IndoDigitalLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showTagline = true,
}) => {
  // Dimension presets
  const iconHeights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  const lockupHeights = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-11 sm:h-12',
    xl: 'h-14 sm:h-16',
  };

  if (variant === 'icon-only') {
    return (
      <img
        src="/assets/aistudio/indo_digital_icon.png"
        alt="INDO DIGITAL Emblem"
        className={`${iconHeights[size]} w-auto object-contain select-none transition-transform duration-200 hover:scale-105 ${className}`}
        style={{ background: 'transparent' }}
      />
    );
  }

  if (variant === 'lockup') {
    return (
      <img
        src="/assets/aistudio/indo_digital_lockup.png"
        alt="INDO DIGITAL"
        className={`${lockupHeights[size]} w-auto object-contain select-none transition-transform duration-200 hover:scale-102 ${className}`}
        style={{ background: 'transparent' }}
      />
    );
  }

  // Variant 'full': High-resolution emblem icon combined with razor-sharp vector typography
  // This guarantees 100% vector sharpness at any screen resolution or DPI with zero tile artifacts!
  return (
    <div
      className={`inline-flex items-center gap-3 select-none group ${className}`}
      style={{ background: 'transparent' }}
    >
      {/* Icon: iD Monogram with cyan/deep blue gradient & orange node arrow */}
      <img
        src="/assets/aistudio/indo_digital_icon.png"
        alt="INDO DIGITAL"
        className={`${iconHeights[size]} w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-200`}
        style={{ background: 'transparent' }}
      />

      {/* Brand Text Block */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline tracking-tight font-black">
          <span className="text-[#1D3582] text-xl sm:text-2xl font-black tracking-tight">
            INDO
          </span>
          <span className="text-[#00A3E0] text-xl sm:text-2xl font-black tracking-tight ml-1">
            DIGITAL
          </span>
        </div>
        {showTagline && (
          <span className="hidden sm:block text-[8.5px] sm:text-[9.5px] font-bold text-[#536B92] tracking-[0.22em] uppercase mt-1">
            INOVASI DIGITAL INDONESIA
          </span>
        )}
      </div>
    </div>
  );
};
