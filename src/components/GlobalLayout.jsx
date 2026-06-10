import React, { useEffect, useState } from 'react';
import { Terminal, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import DecryptedText from './DecryptedText';

const navNodes = [
  { id: 'ID_CORE', label: '[ 01 ] // ID_CORE' },
  { id: 'SYS_ARCH', label: '[ 02 ] // SYS_ARCH' },
  { id: 'DATA_BNK', label: '[ 03 ] // DATA_BNK' },
  { id: 'OPS_LOG', label: '[ 04 ] // OPS_LOG' },
  { id: 'COM_LNK', label: '[ 05 ] // COM_LNK' }
];

const GlobalLayout = ({ children }) => {
  const [time, setTime] = useState(new Date().toISOString());
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('optics_preference') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  });
  const [activeSection, setActiveSection] = useState('ID_CORE');
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toISOString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    const scrollContainer = document.getElementById('scroll-container');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollPos = scrollContainer.scrollTop;
      // Trigger a section when its top boundary crosses the upper 35% of the viewport
      const triggerPoint = scrollPos + (scrollContainer.clientHeight * 0.35);

      let currentActive = navNodes[0].id;

      for (const node of navNodes) {
        const el = document.getElementById(node.id);
        if (el && el.offsetTop <= triggerPoint) {
          currentActive = node.id;
        }
      }

      // If scrolled to absolute bottom, force the last node to be active
      if (scrollContainer.scrollHeight - scrollPos <= scrollContainer.clientHeight + 20) {
        currentActive = navNodes[navNodes.length - 1].id;
      }

      setActiveSection(currentActive);
    };

    // Attach scroll listener
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [children]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('optics_preference', newTheme);
  };

  const scrollToSection = (id) => {
    const scrollContainer = document.getElementById('scroll-container');
    const el = document.getElementById(id);
    if (scrollContainer && el) {
      scrollContainer.scrollTo({
        top: el.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex justify-center p-4 md:p-8 overflow-hidden relative selection:bg-accent selection:text-bg">
      {/* Background grid lines & Active Nodes */}
      <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300" style={{ opacity: theme === 'light' ? 0.4 : 0.2 }}>
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-grid) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-grid) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem'
        }} />
        
        {/* Active Grid Nodes */}
        {[...Array(15)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute text-[10px] font-tertiary text-accent"
            style={{ 
              left: `${Math.floor(Math.random() * 20) * 5}%`, 
              top: `${Math.floor(Math.random() * 20) * 5}%`,
              transform: 'translate(-50%, -50%)'
            }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 2 + Math.random() * 3, 
              delay: Math.random() * 5,
              ease: "linear"
            }}
          >
            +
          </motion.div>
        ))}
      </div>

      {/* Main HUD Container */}
      <div className="w-full max-w-[1400px] border border-muted relative z-10 flex flex-col backdrop-blur-md transition-colors duration-300 shadow-2xl h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 40%, transparent)' }}>
        
        {/* Top Header Bar */}
        <header className="border-b border-muted flex items-center justify-between px-4 py-2 text-xs font-tertiary text-muted shrink-0 relative overflow-hidden" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 80%, transparent)' }}>
          <div className="flex items-center gap-4">
            <span className="text-accent flex items-center gap-2">
              <Terminal size={14} /> 
              <DecryptedText text="SYS.BOOT" speed={40} animateOnMount />
            </span>
            <span className="hidden md:inline-block">
              <DecryptedText text="ID: VY-892 // SECURE CONNECTION" speed={30} delay={500} animateOnMount />
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3">
              <span>UPTIME: {time.split('T')[1].split('.')[0]} Z</span>
              {/* Micro-Diagnostic Ticker */}
              <div className="flex items-end gap-[2px] h-3 w-6 overflow-hidden">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div 
                    key={i}
                    className="w-[2px] bg-accent/70"
                    animate={{ height: ['20%', '100%', '40%', '80%', '20%'] }}
                    transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut", delay: Math.random() }}
                  />
                ))}
              </div>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="group flex items-center gap-4 text-[10px] font-tertiary text-muted transition-colors outline-none"
            >
              <span className="tracking-[0.2em] group-hover:text-accent transition-colors">THEME</span>
              
              {/* Mechanical Switch Track */}
              <div className="relative w-20 h-6 border border-border bg-surface cursor-pointer reticle-sm">
                {/* Hardware Toggle Block */}
                <motion.div 
                  className="absolute top-[2px] left-[2px] w-[34px] h-[18px] bg-accent shadow-[0_0_10px_rgba(var(--color-accent),0.3)] z-0"
                  initial={false}
                  animate={{
                    x: theme === 'dark' ? 0 : 40
                  }}
                  transition={{ type: "tween", ease: [0.0, 0.0, 0.2, 1], duration: 0.15 }}
                />
                
                {/* Text Labels */}
                <div className="absolute inset-0 flex justify-between items-center px-[9px] pointer-events-none text-[9px] tracking-widest font-bold">
                  <span className={`z-10 transition-colors duration-300 ${theme === 'dark' ? 'text-bg' : 'group-hover:text-accent'}`}>DRK</span>
                  <span className={`z-10 transition-colors duration-300 ${theme === 'light' ? 'text-bg' : 'group-hover:text-accent'}`}>LGT</span>
                </div>
              </div>
            </button>

            <span className="flex items-center gap-2 group cursor-default">
              <Activity size={14} className="text-accent animate-pulse" /> 
              <span className="group-hover:anim-glitch-label transition-colors duration-300">ONLINE</span>
            </span>
          </div>
        </header>

        {/* Sidebar + Content Grid */}
        <div className="flex flex-1 flex-col md:flex-row min-h-0">
          
          {/* Left System Navigator (Sticky inside flex layout) */}
          <nav className="w-full md:w-44 lg:w-48 border-b md:border-b-0 md:border-r border-muted flex flex-row md:flex-col items-center md:items-start p-4 md:pl-6 text-[10px] font-tertiary text-muted gap-4 md:gap-6 overflow-x-auto md:overflow-visible scrollbar-hide shrink-0 relative" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)' }}>
            
            {/* Active Wire Node Track (Desktop only) */}
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[1px] bg-border z-0" />

            <div className="hidden md:block w-full mb-4 pl-2 relative z-10">
              <div className="hud-crosshair w-full max-w-[80px]" />
            </div>

            <div className="flex flex-row md:flex-col gap-6 w-full mt-0 md:mt-4 items-start pl-2 md:pl-0 relative z-10">
              {navNodes.map((node) => {
                const isActive = activeSection === node.id;
                const isHovered = hoveredNode === node.id;
                const labelText = node.label.replace('[ ', '').replace(' ]', ''); // Split out brackets
                
                return (
                  <button
                    key={node.id}
                    onClick={() => scrollToSection(node.id)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className={`group relative flex items-center text-left whitespace-nowrap transition-all duration-300 outline-none uppercase tracking-widest ${isActive ? 'reticle-nav reticle-active opacity-100 text-accent font-bold' : 'opacity-40 text-main hover:opacity-100 hover:text-accent'}`}
                  >
                    <span className={`inline-block transition-transform duration-300 ${isActive ? '-translate-x-1 opacity-0' : 'group-hover:-translate-x-1 opacity-100'}`}>[</span>
                    <span className="mx-2 min-w-[80px]">
                      {isHovered && !isActive ? (
                        <DecryptedText text={labelText} speed={60} maxIterations={10} animateOn="view" />
                      ) : (
                        labelText
                      )}
                    </span>
                    <span className={`inline-block transition-transform duration-300 ${isActive ? 'translate-x-1 opacity-0' : 'group-hover:translate-x-1 opacity-100'}`}>]</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth" id="scroll-container">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent -translate-x-[1px] -translate-y-[1px] pointer-events-none z-50" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent translate-x-[1px] -translate-y-[1px] pointer-events-none z-50" />
            
            {children}
            
            {/* Footer Bar inside main content */}
            <footer className="border-t border-muted p-4 mt-16 text-xs font-tertiary text-muted flex justify-between items-center relative overflow-hidden" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 80%, transparent)' }}>
              <span className="flex items-center gap-2 group cursor-default">
                <span className="group-hover:anim-glitch-label transition-colors duration-300">END OF TRANSMISSION</span>
              </span>
              <span className="bracket-hover text-accent cursor-pointer flex items-center group" onClick={() => scrollToSection('ID_CORE')}>
                [ VERIFY_LOG ] <span className="inline-block w-2 h-3 bg-accent ml-2 animate-pulse group-hover:bg-main transition-colors" />
              </span>
              
              {/* Constant Transmission Strip */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent/10">
                <div className="h-full w-1/3 bg-accent/80 anim-transmission" />
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default GlobalLayout;
