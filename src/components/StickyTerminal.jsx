import React, { useState, useEffect } from 'react';
import { TerminalSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import InteractiveTerminal from './InteractiveTerminal';

const StickyTerminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [vvpStyle, setVvpStyle] = useState({ height: '100dvh', top: 0 });

  // Lock body scroll when terminal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent iOS bounce
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Track Visual Viewport for perfect keyboard-safe sizing on mobile
  useEffect(() => {
    if (!window.visualViewport) return;
    
    const updateVvp = () => {
      setVvpStyle({
        height: `${window.visualViewport.height}px`,
        top: `${window.visualViewport.offsetTop}px`
      });
    };

    window.visualViewport.addEventListener('resize', updateVvp);
    window.visualViewport.addEventListener('scroll', updateVvp);
    updateVvp();

    return () => {
      window.visualViewport.removeEventListener('resize', updateVvp);
      window.visualViewport.removeEventListener('scroll', updateVvp);
    };
  }, [isOpen]);

  return (
    <>
      {/* Desktop Floating Button (Left Sidebar Bottom) */}
      <motion.button 
        onClick={() => setIsOpen(true)}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`hidden md:flex absolute bottom-8 left-12 z-50 p-4 bg-surface/80 backdrop-blur-md border border-accent text-accent hover:bg-accent hover:text-bg transition-colors shadow-[0_0_15px_rgba(var(--color-accent),0.3)] reticle-sm clip-notch ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <TerminalSquare size={24} />
      </motion.button>

      {/* Mobile Floating Action Button (Bottom Right above Nav) */}
      <motion.button 
        onClick={() => setIsOpen(true)}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={`flex md:hidden absolute bottom-24 right-4 z-[60] p-3 bg-surface/80 backdrop-blur-md border border-accent/50 text-accent hover:bg-accent hover:text-bg transition-colors shadow-[0_0_15px_rgba(var(--color-accent),0.3)] clip-notch-sm ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <TerminalSquare size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop to catch clicks and dim background completely */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-[65] cursor-pointer md:hidden"
            />
            
            {/* --- MOBILE SAFE CONTAINER --- */}
            <div 
              className="fixed left-0 w-full z-[70] p-2 flex flex-col justify-end pointer-events-none md:hidden"
              style={{ height: vvpStyle.height, top: vvpStyle.top }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full bg-bg border border-border shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col pointer-events-auto max-h-full"
              >
                {/* Header matching RAW_DATA_STREAM aesthetic */}
                <div className="w-full px-4 py-3 bg-bg border-b border-border flex items-center justify-between z-20 shrink-0">
                  <span className="text-[10px] font-tertiary tracking-widest text-accent flex items-center gap-2">
                    <TerminalSquare size={14} /> [ COMMAND_TERMINAL ]
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
                    <button onClick={() => setIsOpen(false)} className="text-muted hover:text-accent p-1">
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Scanning Laser Effect */}
                <div className="absolute top-[41px] left-0 w-full h-[2px] bg-accent shadow-[0_0_15px_rgba(var(--color-accent),1)] z-10 anim-scan-vertical pointer-events-none opacity-50" />

                {/* Terminal Content */}
                <div className="p-4 bg-transparent relative h-[300px] shrink flex flex-col overflow-hidden">
                  <InteractiveTerminal />
                </div>
              </motion.div>
            </div>

            {/* --- DESKTOP CONTAINER --- */}
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="hidden md:flex absolute bottom-28 left-12 z-[70] w-[450px] border border-border bg-surface/95 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden flex-col group"
            >
              <div className="w-full px-4 py-3 bg-bg border-b border-border flex items-center justify-between z-20">
                <span className="text-[10px] font-tertiary tracking-widest text-accent flex items-center gap-2">
                  <TerminalSquare size={14} /> [ COMMAND_TERMINAL ]
                </span>
                <div className="flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
                  <button onClick={() => setIsOpen(false)} className="text-muted hover:text-accent">
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="absolute top-[41px] left-0 w-full h-[2px] bg-accent shadow-[0_0_15px_rgba(var(--color-accent),1)] z-10 anim-scan-vertical pointer-events-none opacity-50" />
              <div className="p-4 bg-transparent relative h-[300px] flex">
                <InteractiveTerminal />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StickyTerminal;
