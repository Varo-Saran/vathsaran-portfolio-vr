import React, { useState, useEffect, useRef } from 'react';
import { Terminal, User, FileText, Mail, Activity, Database, MapPin, AlertCircle } from 'lucide-react';

const bootSequence = [
  "SECURE TERMINAL UPLINK ESTABLISHED.",
  "Type 'help' to view available commands."
];

const InteractiveTerminal = () => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [bootIndex, setBootIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const endRef = useRef(null);

  // Boot sequence effect
  useEffect(() => {
    if (!isBooting) return;
    
    let timer;
    if (bootIndex < bootSequence.length) {
      if (charIndex < bootSequence[bootIndex].length) {
        timer = setTimeout(() => {
          setCharIndex(prev => prev + 1);
        }, 20); // Typing speed
      } else {
        timer = setTimeout(() => {
          setHistory(prev => [...prev, { type: 'output', content: bootSequence[bootIndex] }]);
          setBootIndex(prev => prev + 1);
          setCharIndex(0);
        }, 200); // Pause between lines
      }
    } else {
      setIsBooting(false);
    }
    return () => clearTimeout(timer);
  }, [isBooting, bootIndex, charIndex]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, charIndex, input]);

  const handleCommand = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      const cmd = input.trim().toLowerCase();
      let outputNode = null;

      switch (cmd) {
        case 'help':
          outputNode = (
            <div className="flex flex-col gap-1">
              <span className="text-accent font-bold"><Terminal size={12} className="inline mr-1 mb-0.5"/> COMMAND LIST:</span>
              <span className="ml-4"><span className="text-accent">whoami</span>      - display system identity</span>
              <span className="ml-4"><span className="text-accent">status</span>      - view server telemetry</span>
              <span className="ml-4"><span className="text-accent">projects</span>    - list active deployments</span>
              <span className="ml-4"><span className="text-accent">location</span>    - ping host coordinates</span>
              <span className="ml-4"><span className="text-accent">contact</span>     - initiate comms protocol</span>
              <span className="ml-4"><span className="text-accent">download cv</span> - retrieve personnel file</span>
              <span className="ml-4"><span className="text-accent">clear</span>       - purge terminal logs</span>
            </div>
          );
          break;
        case 'whoami':
          outputNode = (
            <div className="flex flex-col">
              <span><User size={12} className="inline text-accent mr-1"/> Identity: <span className="text-main">Vathsaran Yasotharan</span></span>
              <span>Designation: <span className="text-accent">Data Scientist & ML Engineer</span></span>
              <span>Clearance: Level 5</span>
              <span>Status: <span className="text-green-500">Operational</span></span>
            </div>
          );
          break;
        case 'status':
          outputNode = <span><Activity size={12} className="inline text-green-500 mr-1 mb-0.5"/> SYSTEM OPTIMAL. All deployed ML nodes active and responsive.</span>;
          break;
        case 'projects':
          outputNode = <span><Database size={12} className="inline text-accent mr-1 mb-0.5"/> Accessing Data Bank... 5 records found. Refer to [ 03 // DATA_BNK ] for payload.</span>;
          break;
        case 'location':
          outputNode = <span><MapPin size={12} className="inline text-accent mr-1 mb-0.5"/> HOST LOC: <span className="text-main">COLOMBO, SRI LANKA</span>. Coordinates securely locked.</span>;
          break;
        case 'contact':
          outputNode = <span><Mail size={12} className="inline text-accent mr-1 mb-0.5"/> Initiating secure mailto protocol... <span className="text-main">[ varosaran@gmail.com ]</span></span>;
          setTimeout(() => {
            window.location.href = 'mailto:varosaran@gmail.com';
          }, 500);
          break;
        case 'download cv':
          outputNode = <span><FileText size={12} className="inline text-accent mr-1 mb-0.5"/> Accessing secure payload <span className="text-main">[ vathsaran_cv.pdf ]</span>... Payload delivered.</span>;
          const link = document.createElement('a');
          link.href = '/vathsaran_cv.pdf';
          link.download = 'vathsaran_cv.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        default:
          outputNode = <span><AlertCircle size={12} className="inline text-red-500 mr-1 mb-0.5"/> Command not recognized: <span className="text-main">{cmd}</span>.</span>;
      }

      setHistory(prev => [
        ...prev, 
        { type: 'input', content: `> ${cmd}` },
        { type: 'output', content: (
          <div className="flex flex-col gap-2 mt-1">
            {outputNode}
            <span className="text-muted/60 italic text-[11px] mt-2">Type 'help' to view available commands.</span>
          </div>
        )}
      ]);
      setInput('');
    }
  };

  return (
    <div 
      className="text-sm md:text-base text-muted leading-relaxed font-tertiary border-l border-accent/50 pl-4 mt-8 h-40 max-w-[65ch] overflow-y-auto w-full custom-scrollbar flex flex-col justify-start cursor-text" 
      onClick={() => document.getElementById('terminal-input')?.focus()}
    >
      {history.map((log, i) => (
        <div key={i} className={`mb-4 ${log.type === 'input' ? 'text-accent' : 'text-muted'}`}>
          {log.content}
        </div>
      ))}
      
      {isBooting && bootIndex < bootSequence.length && (
        <div className="text-muted">
          <span className="text-accent">{`> `}</span>
          {bootSequence[bootIndex].substring(0, charIndex)}
          <span className="animate-pulse text-accent">_</span>
        </div>
      )}

      {!isBooting && (
        <div className="flex items-center text-accent">
          <span>{`> `}</span>
          <input
            id="terminal-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            autoComplete="off"
            spellCheck="false"
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-accent ml-2 font-tertiary focus:ring-0 p-0 text-sm md:text-base"
          />
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};

export default InteractiveTerminal;
