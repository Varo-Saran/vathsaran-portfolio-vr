import React, { useEffect, useState } from 'react';
import { Terminal, Activity, Fingerprint, Database, Mail, FolderGit2, Sun, Moon, Cloud, CloudRain, CloudLightning, CloudSnow, CloudFog, MapPin, Clock, Route, Crosshair, Battery, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import DecryptedText from './DecryptedText';
import StickyTerminal from './StickyTerminal';
import { audioSystem } from '../utils/audioSystem';

// Geolocation Helper
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const navNodes = [
  { id: 'ID_CORE', label: '[ 01 ] // ID_CORE', icon: Fingerprint },
  { id: 'SYS_ARCH', label: '[ 02 ] // SYS_ARCH', icon: Terminal },
  { id: 'DATA_BNK', label: '[ 03 ] // DATA_BNK', icon: Database },
  { id: 'OPS_LOG', label: '[ 04 ] // OPS_LOG', icon: FolderGit2 },
  { id: 'COM_LNK', label: '[ 05 ] // COM_LNK', icon: Mail }
];

const GlobalLayout = ({ children }) => {
  const [time, setTime] = useState(new Date().toISOString());
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('optics_preference') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  });
  const [activeSection, setActiveSection] = useState('ID_CORE');
  const [hoveredNode, setHoveredNode] = useState(null);
  const [weather, setWeather] = useState(null);
  const [trackingStatus, setTrackingStatus] = useState('AWAITING_LOC_DATA');
  const [uptime, setUptime] = useState(0);
  const [battery, setBattery] = useState(null);
  const [osInfo, setOsInfo] = useState('UNKNOWN_OS');

  // Load theme preference on mount

  useEffect(() => {
    // Play boot sound on initial mount
    audioSystem.playBootSound();

    // Fetch live weather for Colombo
    fetch('https://api.open-meteo.com/v1/forecast?latitude=6.9271&longitude=79.8612&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if(data && data.current_weather) {
          setWeather(data.current_weather);
        }
      })
      .catch(err => console.error("Weather fetch failed", err));

    // Geolocation tracking
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Colombo, Sri Lanka coordinates: 6.9271° N, 79.8612° E
          const distance = getDistanceFromLatLonInKm(
            position.coords.latitude, 
            position.coords.longitude, 
            6.9271, 
            79.8612
          );
          setTrackingStatus(`${distance.toLocaleString(undefined, { maximumFractionDigits: 0 })} KM FROM HOST`);
        },
        () => {
          setTrackingStatus('LOC_UNAVAILABLE');
        }
      );
    } else {
      setTrackingStatus('LOC_DISABLED');
    }

    const timer = setInterval(() => {
      setTime(new Date().toISOString());
    }, 1000);

    // OS Detection
    const ua = navigator.userAgent;
    if (ua.includes('Win')) setOsInfo('WINDOWS_NT');
    else if (ua.includes('Mac')) setOsInfo('MACOS');
    else if (ua.includes('Linux')) setOsInfo('LINUX_KERNEL');
    else if (ua.includes('Android')) setOsInfo('ANDROID_OS');
    else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) setOsInfo('APPLE_IOS');

    // Battery API
    if ('getBattery' in navigator) {
      navigator.getBattery().then(bat => {
        setBattery({ level: Math.round(bat.level * 100), charging: bat.charging });
        
        bat.addEventListener('levelchange', () => {
          setBattery(prev => ({ ...prev, level: Math.round(bat.level * 100) }));
        });
        bat.addEventListener('chargingchange', () => {
          setBattery(prev => ({ ...prev, charging: bat.charging }));
        });
      });
    }

    // Uptime Timer
    const uptimeInterval = setInterval(() => {
      setUptime(Math.floor(performance.now() / 1000));
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(uptimeInterval);
    };
  }, []);

  const formatUptime = (secs) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

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

      setActiveSection((prev) => {
        if (prev !== currentActive) {
          audioSystem.playSonarPing();
        }
        return currentActive;
      });
    };

    // Attach scroll listener
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [children]);

  const toggleTheme = () => {
    audioSystem.playThemeSwitch();
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

  // Format time to 12hr Colombo time
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Colombo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(new Date(time));

  const colomboHour = parseInt(new Intl.DateTimeFormat('en-US', { 
    timeZone: 'Asia/Colombo', 
    hour: 'numeric', 
    hourCycle: 'h23' 
  }).format(new Date(time)), 10);
  
  const isDaytime = colomboHour >= 6 && colomboHour < 18;
  const TimeIcon = isDaytime ? Sun : Moon;

  // Determine Weather Icon
  let WeatherIcon = TimeIcon;
  if (weather) {
    const code = weather.weathercode;
    if (code >= 1 && code <= 3) WeatherIcon = Cloud;
    else if (code === 45 || code === 48) WeatherIcon = CloudFog;
    else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) WeatherIcon = CloudRain;
    else if ((code >= 71 && code <= 77) || code === 85 || code === 86) WeatherIcon = CloudSnow;
    else if (code >= 95) WeatherIcon = CloudLightning;
  }

  return (
    <div className="min-h-[100dvh] w-full flex justify-center p-0 md:p-4 lg:p-8 overflow-hidden relative selection:bg-accent selection:text-bg">

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
      <div className="w-full max-w-[1400px] border-x-0 md:border md:border-muted relative z-10 flex flex-col backdrop-blur-md transition-colors duration-300 shadow-2xl h-[100dvh] md:h-[calc(100vh-2rem)] lg:h-[calc(100vh-4rem)]" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 40%, transparent)' }}>
        
        {/* Top Header Bar */}
        <header className="border-b border-muted flex items-center justify-between px-4 pb-2 text-xs font-tertiary text-muted shrink-0 relative overflow-hidden z-20" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 80%, transparent)', paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
          <div className="flex items-center gap-4">
            <span className="text-accent hidden md:flex items-center gap-2">
              <Terminal size={14} /> 
              <DecryptedText text="SYS.BOOT // PORTFOLIO" speed={40} animateOnMount />
            </span>
            
            {/* Mobile Telemetry */}
            <div className="flex md:hidden items-center gap-3 text-[10px]">
                {weather && (
                  <span className="flex items-center gap-1.5 text-accent font-secondary">
                    <WeatherIcon size={12} strokeWidth={2.5} />
                    {Math.round(weather.temperature)}°C
                  </span>
                )}
                {battery && (
                  <>
                    <span className="text-muted/40">//</span>
                    <span className="flex items-center gap-1.5 opacity-80">
                      <Battery size={10} className={battery.charging ? 'text-green-400' : 'text-accent'} />
                      {battery.level}%
                    </span>
                  </>
                )}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4 text-[10px]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                  <MapPin size={12} className="text-accent" />
                  LOC: COLOMBO
                </span>
                <span className="text-muted/40">//</span>
                <span className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                  <TimeIcon size={12} className="text-accent" />
                  [ {formattedTime} ]
                </span>
                <span className="text-muted/40">//</span>
                {weather ? (
                  <span className="flex items-center gap-1.5 text-accent opacity-80 hover:opacity-100 transition-opacity font-secondary">
                    <WeatherIcon size={14} strokeWidth={2.5} />
                    {Math.round(weather.temperature)}°C
                  </span>
                ) : (
                  <span className="opacity-80">FETCHING WX...</span>
                )}
                <span className="text-muted/40">//</span>
                <span className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                  <Route size={12} className="text-accent" />
                  {trackingStatus}
                </span>
              </div>
              
              {/* Added Real Stats */}
              <div className="hidden lg:flex items-center gap-3">
                <span className="text-muted/40">//</span>
                <span className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                  <Activity size={12} className="text-accent" />
                  UP: {formatUptime(uptime)}
                </span>
                <span className="text-muted/40">//</span>
                <span className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                  <Cpu size={12} className="text-accent" />
                  {osInfo}
                </span>
                {battery && (
                  <>
                    <span className="text-muted/40">//</span>
                    <span className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                      <Battery size={12} className={battery.charging ? 'text-green-400' : 'text-accent'} />
                      PWR: {battery.level}%
                    </span>
                  </>
                )}
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

            <span className="hidden md:flex items-center gap-2 group cursor-default">
              <Activity size={14} className="text-accent animate-pulse" /> 
              <span className="group-hover:anim-glitch-label transition-colors duration-300">ONLINE</span>
            </span>
          </div>
        </header>

        {/* Sidebar + Content Grid */}
        <div className="flex flex-1 flex-col md:flex-row min-h-0">
          
          {/* System Navigator (Left Sidebar Desktop / Bottom Dock Mobile) */}
          <nav className="fixed bottom-0 inset-x-0 z-50 md:static md:w-44 lg:w-48 border-t md:border-t-0 md:border-r border-muted flex flex-row md:flex-col items-center md:items-start justify-around md:justify-start px-2 py-3 md:p-4 md:pl-6 text-[10px] font-tertiary text-muted md:gap-6 shrink-0 backdrop-blur-md md:backdrop-blur-none" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 85%, transparent)', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
            
            {/* Active Wire Node Track (Desktop only) */}
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[1px] bg-border z-0" />

            <div className="hidden md:block w-full mb-4 pl-2 relative z-10">
              <div className="hud-crosshair w-full max-w-[80px]" />
            </div>

            <div className="flex flex-row md:flex-col gap-2 md:gap-6 w-full justify-around md:justify-start mt-0 md:mt-4 items-center md:items-start pl-0 md:pl-2 relative z-10">
              {navNodes.map((node) => {
                const isActive = activeSection === node.id;
                const isHovered = hoveredNode === node.id;
                const labelText = node.label.replace('[ ', '').replace(' ]', '');
                const Icon = node.icon;
                
                return (
                  <button
                    key={node.id}
                    onClick={() => scrollToSection(node.id)}
                    onMouseEnter={() => {
                      setHoveredNode(node.id);
                      audioSystem.playHover();
                    }}
                    onMouseLeave={() => setHoveredNode(null)}
                    className={`group relative z-20 flex flex-col md:flex-row items-center md:items-center text-center md:text-left transition-all duration-300 outline-none uppercase tracking-widest ${isActive ? 'reticle-nav md:reticle-active opacity-100 text-accent font-bold' : 'opacity-60 md:opacity-40 text-main hover:opacity-100 hover:text-accent'}`}
                  >
                    {/* Desktop Hover Brackets */}
                    <span className={`hidden md:inline-block transition-transform duration-300 ${isActive ? '-translate-x-1 opacity-0' : 'group-hover:-translate-x-1 opacity-100'}`}>[</span>
                    
                    {/* Mobile Icon */}
                    <Icon size={20} strokeWidth={1.5} className={`mb-1 md:hidden transition-colors ${isActive ? 'text-accent' : ''}`} />
                    
                    <span className="md:mx-2 min-w-auto md:min-w-[80px] text-[8px] md:text-[10px]">
                      {/* Mobile Label */}
                      <span className="md:hidden opacity-80">{node.id.split('_')[0]}</span>
                      
                      {/* Desktop Label */}
                      <span className="hidden md:inline-block">
                        {isHovered && !isActive ? (
                          <DecryptedText text={labelText} speed={60} maxIterations={10} animateOn="view" />
                        ) : (
                          labelText
                        )}
                      </span>
                    </span>
                    
                    {/* Desktop Hover Brackets */}
                    <span className={`hidden md:inline-block transition-transform duration-300 ${isActive ? 'translate-x-1 opacity-0' : 'group-hover:translate-x-1 opacity-100'}`}>]</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth pb-24 md:pb-0" id="scroll-container">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent -translate-x-[1px] -translate-y-[1px] pointer-events-none z-50 hidden md:block" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent translate-x-[1px] -translate-y-[1px] pointer-events-none z-50 hidden md:block" />
            
            {children}
            
            {/* Footer Bar inside main content */}
            <footer className="border-t border-muted p-4 mt-16 text-[10px] md:text-xs font-tertiary text-muted flex justify-between items-center relative overflow-hidden" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 80%, transparent)' }}>
              <span className="flex items-center gap-2 group cursor-default">
                <span className="group-hover:anim-glitch-label transition-colors duration-300">END OF TRANSMISSION</span>
              </span>
              <span className="bracket-hover text-accent cursor-pointer flex items-center group text-right" onClick={() => scrollToSection('ID_CORE')}>
                <span className="hidden md:inline">[ VERIFY_LOG ]</span>
                <span className="md:hidden">[ TOP ]</span>
                <span className="inline-block w-2 h-3 bg-accent ml-2 animate-pulse group-hover:bg-main transition-colors" />
              </span>
              
              {/* Constant Transmission Strip */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent/10">
                <div className="h-full w-1/3 bg-accent/80 anim-transmission" />
              </div>
            </footer>
          </main>
        </div>
        <StickyTerminal />
      </div>
    </div>
  );
};

export default GlobalLayout;
