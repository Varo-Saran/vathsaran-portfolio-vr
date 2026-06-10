import React, { useState, useEffect, useRef } from 'react';

const bootSequence = [
  "Data Scientist transforming complex datasets into production-ready models.",
  "Track record of processing 541k+ records with 90%+ model accuracy.",
  "Revenue intelligence initiatives driving £5.81M in impact.",
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
          setHistory(prev => [...prev, { type: 'output', text: bootSequence[bootIndex] }]);
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
      let output = '';

      switch (cmd) {
        case 'help':
          output = "Commands:\n  whoami      - display system identity\n  contact     - initiate comms protocol\n  download cv - retrieve personnel file\n  clear       - purge terminal logs";
          break;
        case 'whoami':
          output = "Identity: Vathsaran Yasotharan\nDesignation: Data Scientist & ML Engineer\nClearance: Level 5\nStatus: Operational";
          break;
        case 'contact':
          output = "Initiating secure mailto protocol... [varosaran@gmail.com]";
          setTimeout(() => {
            window.location.href = 'mailto:varosaran@gmail.com';
          }, 500);
          break;
        case 'download cv':
          output = "Accessing secure payload [ vathsaran_cv.pdf ]... Payload delivered.";
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
          output = `Command not recognized: ${cmd}. Type 'help' for available commands.`;
      }

      setHistory(prev => [
        ...prev, 
        { type: 'input', text: `> ${cmd}` },
        { type: 'output', text: output }
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
        <div key={i} className={`whitespace-pre-wrap mb-2 ${log.type === 'input' ? 'text-accent' : 'text-muted'}`}>
          {log.text}
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
