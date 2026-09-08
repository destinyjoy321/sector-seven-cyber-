import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const LogoIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = 'h-10 w-auto',
}) => {
  return (
    <img 
      src="/images/image.png" 
      alt="Sector Seven Cyber Emblem" 
      className={`object-contain mix-blend-multiply ${className}`}
    />
  );
};

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  showText = true, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Exact User Uploaded Logo Image */}
      <img 
        src="/images/image.png" 
        alt="Sector Seven Cyber Official Logo" 
        className={`${sizeClasses[size]} w-auto object-contain mix-blend-multiply transition-transform hover:scale-[1.03] duration-200`}
      />
    </div>
  );
};
