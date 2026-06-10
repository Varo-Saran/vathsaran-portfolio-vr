import React, { useState } from 'react';
import { TerminalSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import InteractiveTerminal from './InteractiveTerminal';

const StickyTerminal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Floating Button */}
      <motion.button 
        onClick={() => setIsOpen(true)}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`hidden md:flex absolute bottom-6 md:left-[256px] lg:left-[288px] z-50 p-4 bg-surface/80 backdrop-blur-md border border-accent text-accent hover:bg-accent hover:text-bg transition-colors shadow-[0_0_15px_rgba(var(--color-accent),0.3)] reticle-sm clip-notch ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <TerminalSquare size={24} />
      </motion.button>

      {/* Mobile Drawer Tab (Left Edge) */}
      <div className={`absolute left-0 top-1/3 -translate-y-1/2 z-[60] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-surface/80 backdrop-blur-md border border-l-0 border-accent/50 text-accent p-2 py-4 rounded-r-md shadow-[0_0_15px_rgba(var(--color-accent),0.2)] flex flex-col items-center gap-2 group hover:bg-accent hover:text-bg transition-colors"
        >
          <TerminalSquare size={14} className="group-hover:animate-pulse" />
          <span className="text-[10px] tracking-widest font-tertiary uppercase [writing-mode:vertical-lr] rotate-180">
            Terminal
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:absolute md:bottom-24 md:left-[256px] lg:left-[288px] z-[70] md:w-[450px] border border-border bg-surface/95 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col group"
          >
            {/* Header matching RAW_DATA_STREAM aesthetic */}
            <div className="w-full px-4 py-3 bg-bg border-b border-border flex items-center justify-between z-20">
              <span className="text-[10px] font-tertiary tracking-widest text-accent flex items-center gap-2">
                <TerminalSquare size={14} /> [ COMMAND_TERMINAL ]
              </span>
              <div className="flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-muted hover:text-accent transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scanning Laser Effect */}
            <div className="absolute top-[41px] left-0 w-full h-[2px] bg-accent shadow-[0_0_15px_rgba(var(--color-accent),1)] z-10 anim-scan-vertical pointer-events-none opacity-50" />

            {/* Terminal Content */}
            <div className="p-4 bg-transparent relative h-[250px] md:h-[300px] flex">
              <InteractiveTerminal />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StickyTerminal;
