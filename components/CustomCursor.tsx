
import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      if (cursorRef.current) {
        // Direct movement for the emoji cursor using translate3d for GPU acceleration
        cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
      
      const target = e.target as HTMLElement;
      // Check if the current target or its parents are interactive elements
      const interactive = 
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        !!target.closest('.tactile-card') ||
        !!target.closest('.tactile-btn') ||
        !!target.closest('button');

      setIsPointer(interactive);
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setIsHidden(true);
    const onMouseEnter = () => setIsHidden(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className={`custom-cursor fixed top-0 left-0 pointer-events-none z-[99999] transition-opacity duration-300 select-none flex items-center justify-center -ml-6 -mt-6 w-12 h-12
        ${isHidden ? 'opacity-0' : 'opacity-100'}`}
      style={{ willChange: 'transform' }}
    >
      {/* Outer Feedback Ring */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-300 border-2 
          ${isPointer ? 'scale-125 border-citrus border-solid opacity-100 bg-citrus/5' : 'scale-0 border-transparent opacity-0'}
          ${isMouseDown ? 'scale-150 border-coral bg-coral/10 rotate-45' : 'rotate-0'}`}
      />

      {/* Primary Emoji Content */}
      <div className={`relative transition-transform duration-200 text-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]
        ${isMouseDown ? 'scale-125 rotate-12' : 'scale-100'}
        ${isPointer && !isMouseDown ? 'scale-110' : ''}`}
      >
        {isMouseDown ? '🪄' : '👀'}
      </div>
      
      {/* Interactive Sparkle/Glow Ring */}
      {isPointer && !isMouseDown && (
        <div className="absolute inset-0 border-2 border-dashed border-citrus/40 rounded-full animate-spin-slow"></div>
      )}

      {/* Directional Indicator for Clicks */}
      {isMouseDown && (
        <div className="absolute -top-4 -right-4 w-4 h-4 bg-citrus rounded-full animate-ping opacity-75"></div>
      )}
    </div>
  );
};

export default CustomCursor;
