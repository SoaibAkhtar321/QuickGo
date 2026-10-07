import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl font-extrabold',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  };

  return (
    <div className={`flex flex-col select-none ${className}`}>
      <div className="flex items-center gap-2">
        {/* Custom Brand Symbol */}
        <div
          className={`${iconSizes[size]} rounded-xl bg-gradient-to-tr from-[#DC2626] to-[#E11D48] flex items-center justify-center shadow-sm text-white font-bold p-1`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>

        {/* Wordmark */}
        <span className={`font-bold tracking-tight text-[#171717] ${sizeClasses[size]}`}>
          Quick<span className="text-[#16A34A]">Fresh</span>
        </span>
      </div>

      {showTagline && (
        <span className="text-[11px] font-medium text-neutral-500 tracking-wide mt-0.5">
          Everything delivered. Simply.
        </span>
      )}
    </div>
  );
};
