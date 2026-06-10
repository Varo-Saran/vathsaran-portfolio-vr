import React, { useState } from 'react';

const HoloInput = ({ id, label, type = "text", placeholder, isTextArea = false, required = false, rows = 5 }) => {
  const [isFocused, setIsFocused] = useState(false);

  const InputElement = isTextArea ? 'textarea' : 'input';

  return (
    <div className="relative flex flex-col gap-2 group w-full">
      {/* Glitch Label */}
      <label 
        htmlFor={id} 
        className={`text-[10px] font-tertiary tracking-widest uppercase transition-colors duration-300 relative inline-block w-max ${isFocused ? 'text-accent anim-glitch-label' : 'text-accent/70'}`}
      >
        {label}
        {isFocused && (
          <span className="absolute -right-3 top-0 animate-pulse text-[8px] text-accent opacity-70">
            *
          </span>
        )}
      </label>

      {/* Main Input Container */}
      <div className="relative">
        {/* Outer Glow */}
        <div 
          className={`absolute inset-0 transition-all duration-500 pointer-events-none opacity-0 ${isFocused ? 'opacity-20' : 'group-hover:opacity-10'}`}
          style={{ boxShadow: '0 0 20px var(--color-accent)' }}
        />

        {/* Input Field */}
        <InputElement
          type={!isTextArea ? type : undefined}
          id={id}
          name={id}
          required={required}
          rows={isTextArea ? rows : undefined}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-surface/40 backdrop-blur-md border px-4 py-3 text-sm font-tertiary text-main placeholder-muted/40 focus:outline-none transition-all duration-300 ${isTextArea ? 'resize-none' : ''} ${isFocused ? 'border-accent' : 'border-border group-hover:border-accent/50'}`}
          style={{ WebkitBoxShadow: 'none', boxShadow: 'none' }}
        />

        {/* Scanline Effect (Only visible on focus) */}
        {isFocused && (
          <div className="absolute left-0 top-0 w-full h-[2px] input-scanline anim-scan-vertical pointer-events-none opacity-50 z-10" />
        )}

        {/* Corner Reticles */}
        <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors duration-300 pointer-events-none ${isFocused ? 'border-accent' : 'border-border group-hover:border-accent/50'}`} />
        <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors duration-300 pointer-events-none ${isFocused ? 'border-accent' : 'border-border group-hover:border-accent/50'}`} />
        <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors duration-300 pointer-events-none ${isFocused ? 'border-accent' : 'border-border group-hover:border-accent/50'}`} />
        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors duration-300 pointer-events-none ${isFocused ? 'border-accent' : 'border-border group-hover:border-accent/50'}`} />

        {/* Vertical Data Stream (Right Edge) */}
        {isFocused && (
          <div className="absolute right-1 top-2 bottom-2 w-1 flex flex-col justify-around items-center pointer-events-none overflow-hidden opacity-50">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="w-full h-1 bg-accent stream-bar" 
                style={{ '--i': i }} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HoloInput;
