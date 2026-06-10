import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, Database, MapPin, Mail, Globe, ChevronRight, ScanLine } from 'lucide-react';
import TerminalTypewriter from './TerminalTypewriter';
import IconX from './IconX';
import IconLinkedIn from './IconLinkedIn';
import IconGitHub from './IconGitHub';
import IconGmail from './IconGmail';

import identityScan from '../assets/identity-scan.jpeg';

const generateHexStream = (lines) => {
  const chars = '0123456789ABCDEF';
  let stream = '';
  for(let i=0; i<lines; i++) {
    stream += '0x' + chars.charAt(Math.floor(Math.random()*16)) + chars.charAt(Math.floor(Math.random()*16)) + '\n';
  }
  return stream + stream; // Duplicate for smooth looping
};

const hexColumns = Array.from({length: 4}, () => generateHexStream(50));

const bootSequence = [
  "INITIALIZING MAINFRAME...",
  "ESTABLISHING SECURE CONNECTION...",
  "BYPASSING SECURITY PROTOCOLS...",
  "ACCESS GRANTED.",
  "RETRIEVING TARGET PROFILE..."
];

const Hero = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const [showDataOverlay, setShowDataOverlay] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBootComplete(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="ID_CORE" className="min-h-[85vh] w-full flex flex-col justify-center px-4 md:px-12 lg:px-24 pt-12 pb-24 border-b border-border relative">
      {/* Background decoration & Data Drift */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 hidden lg:block text-[20rem] font-primary leading-none">
          VY
        </div>
        
        {/* DBH Forensic Floating Coordinates */}
        <div className="absolute top-[20%] left-[10%] text-accent/30 font-tertiary text-xs animate-pulse tracking-widest">[ 033.1 ]</div>
        <div className="absolute top-[60%] left-[85%] text-accent/20 font-tertiary text-xs animate-[pulse_4s_ease-in-out_infinite] tracking-widest">[ 098.1 ]</div>
        <div className="absolute top-[85%] left-[30%] text-accent/20 font-tertiary text-[10px] animate-[pulse_3s_ease-in-out_infinite] tracking-widest">[ SYS.OK ]</div>
        <div className="absolute top-[15%] left-[75%] w-[1px] h-32 bg-accent/10" />
        <div className="absolute top-[40%] left-[10%] w-32 h-[1px] bg-accent/10" />
        
        {/* Hex Data Drift */}
        <div className="absolute top-0 w-full h-[200%] flex justify-evenly md:justify-between px-4 md:px-24 opacity-[0.03] font-tertiary text-xs md:text-sm text-accent select-none">
          {hexColumns.map((col, idx) => (
            <motion.div
              key={idx}
              className="whitespace-pre leading-loose"
              animate={{ y: [0, '-50%'] }}
              transition={{ repeat: Infinity, duration: 25 + (idx * 5), ease: 'linear' }}
            >
              {col}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl relative z-10 w-full flex flex-col justify-center">
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column (Identity Image Overlay System) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.3 }}
            className="lg:col-span-4 flex flex-col justify-center h-full"
          >
            {/* Image container with geometric clip path and 1px borders */}
            <div className="relative p-2 border border-border bg-surface w-full max-w-sm mx-auto group">
              {/* Corner targeting marks */}
              <div className="absolute -top-[5px] -left-[5px] w-3 h-3 border-t border-l border-accent z-10" />
              <div className="absolute -top-[5px] -right-[5px] w-3 h-3 border-t border-r border-accent z-10" />
              <div className="absolute -bottom-[5px] -left-[5px] w-3 h-3 border-b border-l border-accent z-10" />
              <div className="absolute -bottom-[5px] -right-[5px] w-3 h-3 border-b border-r border-accent z-10" />
              
              <div 
                className="w-full aspect-[3/4] relative overflow-hidden bg-bg"
                style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%, 0% 15%)' }}
              >
                {/* Tactical Image Render */}
                <img 
                  src={identityScan} 
                  alt="Vathsaran Yasotharan Identity Scan"
                  className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                />

                {/* Optics blend layers */}
                <div className="absolute inset-0 bg-accent/20 mix-blend-color z-10 pointer-events-none transition-colors duration-500" />
                <div className="absolute inset-0 bg-bg/10 mix-blend-multiply z-10 pointer-events-none" />
                
                {/* Scanning line animation */}
                <motion.div 
                  className="absolute top-0 left-0 w-full h-1 bg-accent/50 blur-[2px] z-20 pointer-events-none"
                  animate={{ y: ["0%", "400%"] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />

                {/* Target Overlay Button */}
                <motion.button 
                  className="absolute top-6 left-6 z-50 p-2 border border-accent bg-bg/80 text-accent hover:bg-dbh-active hover:text-white transition-colors flex items-center group/btn outline-none shadow-[0_0_10px_rgba(0,0,0,0.5)] clip-notch-sm"
                  onClick={() => setShowDataOverlay(!showDataOverlay)}
                  aria-label="Toggle Telemetry Overlay"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.15, repeatDelay: 2, ease: "linear" }}
                >
                  <ChevronRight size={14} className={`transform transition-transform ${showDataOverlay ? 'rotate-90' : ''}`} />
                </motion.button>

                {/* Telemetry Data Overlay (Interactive Screen) */}
                <AnimatePresence>
                  {showDataOverlay && (
                    <motion.div 
                      initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)', backdropFilter: "blur(0px)" }}
                      animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)', backdropFilter: "blur(16px)" }}
                      exit={{ opacity: 0, clipPath: 'inset(0% 0 100% 0)', backdropFilter: "blur(0px)" }}
                      transition={{ duration: 0.4, ease: "anticipate" }}
                      className="absolute inset-0 z-20 bg-surface/80 border border-border flex flex-col p-6 pt-20 font-tertiary text-[10px]"
                    >
                      <div className="flex flex-col h-full justify-start gap-4">
                        
                        {/* Top Section (Geo-Data) */}
                        <div className="flex flex-col gap-2 group/loc">
                          <div className="flex flex-col gap-1 text-main transition-colors">
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-accent shrink-0" />
                              <span className="uppercase text-xs tracking-widest whitespace-nowrap">LOC: Colombo</span>
                              
                              {/* Dedicated Status Blinker */}
                              <div className="ml-2 flex items-center gap-2 shrink-0">
                                <div className="w-1.5 h-1.5 bg-[#00ff41] animate-pulse rounded-none" />
                                <span className="text-[#00ff41] opacity-80 uppercase tracking-widest text-[9px]">ACTIVE</span>
                              </div>
                            </div>
                            <span className="font-tertiary text-muted/70 pl-6 text-[9px] whitespace-nowrap group-hover/loc:text-accent transition-colors">[ 6.9271° N, 79.8612° E ]</span>
                          </div>

                          {/* Dedicated Map Expand Button */}
                          <div className="pl-6 mt-1">
                            <button 
                              onClick={() => setIsMapExpanded(!isMapExpanded)}
                              className="flex items-center justify-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-bg transition-colors text-[9px] tracking-widest font-tertiary shadow-[0_0_10px_rgba(var(--color-accent),0.1)] w-max reticle-sm"
                            >
                              <ScanLine size={10} className="animate-pulse" />
                              {isMapExpanded ? "COLLAPSE" : "SCAN"}
                            </button>
                          </div>
                        
                          {/* Geo-Location Map Expandable */}
                          <AnimatePresence>
                            {isMapExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "120px", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full overflow-hidden border border-accent/50 mt-2"
                              >
                                <iframe 
                                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585978168!2d79.77380315264878!3d6.921922084534571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1717800000000!5m2!1sen!2sus" 
                                  width="100%" 
                                  height="100%" 
                                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(80%)' }} 
                                  allowFullScreen="" 
                                  loading="lazy" 
                                  referrerPolicy="no-referrer-when-downgrade"
                                  title="Colombo Geo-Location Uplink"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Divider */}
                        <div className="w-full border-t border-dashed border-accent/40" />
                        
                        {/* Bottom Section (Comm-Links) in Grid */}
                        <div className="grid grid-cols-2 gap-2 uppercase mt-2">
                          {[
                            { id: 'EMAIL', icon: <IconGmail size={14} />, href: 'mailto:varosaran@gmail.com' },
                            { id: 'GITHUB', icon: <IconGitHub size={14} />, href: 'https://github.com/vathsaran' },
                            { id: 'LINKEDIN', icon: <IconLinkedIn size={14} />, href: 'https://linkedin.com/in/vathsaran' },
                            { id: 'X_TWITTER', icon: <IconX size={14} />, href: 'https://twitter.com/vathsaran' },
                            { id: 'WEBSITE', icon: <Globe size={14} />, href: 'https://vathsaran.com' }
                          ].map((social, idx) => (
                            <a 
                              key={idx}
                              href={social.href} 
                              target="_blank" 
                              rel="noreferrer" 
                              className={`group/link flex items-center justify-center p-2 border border-border/40 bg-surface/20 hover:bg-surface hover:border-accent/50 transition-all duration-300 relative overflow-hidden cursor-pointer reticle-sm ${social.id === 'WEBSITE' ? 'col-span-2' : ''}`}
                            >
                              <div className="flex items-center justify-center w-full text-muted group-hover/link:text-accent transition-colors z-10 relative gap-2">
                                <span className="text-accent/70 group-hover/link:text-accent">{social.icon}</span>
                                <span className="tracking-widest text-[9px]">{social.id}</span>
                              </div>
                              {/* Glitch hover bg effect */}
                              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover/link:opacity-100 transition-opacity pointer-events-none" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Right Column (Terminal Boot, Title, Bio, Action Buttons) */}
          <div className="lg:col-span-8 flex flex-col justify-start">
            
            {/* Group 1: System Status */}
            <div className="flex flex-col gap-4 mb-4 relative">
              {/* Terminal Boot Sequence */}
              <motion.div layout className="font-tertiary text-xs md:text-sm text-accent flex flex-col gap-1 mt-0 min-h-[120px] relative z-10">
                <AnimatePresence mode="wait">
                  {!bootComplete ? (
                    <motion.div 
                      key="booting"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-1"
                    >
                      {bootSequence.map((text, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.4, duration: 0.1, ease: "linear" }}
                        >
                          {`> ${text}`}
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="complete"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-accent animate-pulse" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                      {`> UPLINK_SECURED // SYSTEM_ONLINE`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Identity Verification Header */}
              <motion.div 
                className="flex items-center gap-3 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.2 }}
              >
                <Fingerprint className="text-accent" size={24} />
                <h2 className="text-xs tracking-[0.2em] font-tertiary text-muted">IDENTITY VERIFIED</h2>
                <div className="flex-1 h-[1px] bg-border ml-4 relative">
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-8 h-[1px] bg-accent" />
                </div>
              </motion.div>
            </div>

            {/* Group 2: The Identity */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.2, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-primary text-main tracking-widest leading-none uppercase animate-hud-glitch">
                Vathsaran<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-muted">
                  Yasotharan
                </span>
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2">
                <h2 className="text-lg md:text-xl font-primary text-muted tracking-widest uppercase flex items-center gap-2">
                  <Database size={18} className="text-accent" />
                  Data Scientist
                </h2>
                <span className="hidden sm:inline-block text-muted/50">|</span>
                <h2 className="text-lg md:text-xl font-primary text-muted tracking-widest uppercase">
                  Machine Learning Engineer
                </h2>
              </div>
            </motion.div>

            {/* Group 3: The Bio */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.2 }}
            >
              <TerminalTypewriter />
            </motion.div>

            {/* Group 4: The Action */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.2 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <button className="bg-accent text-bg font-primary uppercase tracking-widest text-sm px-6 py-3 hover:bg-dbh-active hover:text-white transition-colors duration-200 flex items-center gap-2 group clip-notch reticle-lg border border-transparent">
                <span className="font-tertiary group-hover:text-white/60">#</span> INITIATE_CONTACT
              </button>
              <a href="/CV_Vathsaran_Yasotharan.pdf" target="_blank" rel="noreferrer" className="border border-accent/50 bg-surface/50 text-accent font-primary uppercase tracking-widest text-sm px-6 py-3 hover:bg-dbh-active hover:text-white hover:border-transparent transition-colors duration-200 flex items-center gap-2 clip-notch reticle-lg">
                DOWNLOAD_DATASET [CV]
              </a>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
