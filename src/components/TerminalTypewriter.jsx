import React, { useState, useEffect } from 'react';

const strings = [
  "Data Scientist transforming complex datasets into production-ready models.",
  "Track record of processing 541k+ records with 90%+ model accuracy.",
  "Revenue intelligence initiatives driving £5.81M in impact."
];

const TerminalTypewriter = () => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentString = strings[index];

    if (isDeleting) {
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(prev => prev.slice(0, -1));
        }, 40); // Slower deletion
      } else {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % strings.length);
      }
    } else {
      if (text.length < currentString.length) {
        timer = setTimeout(() => {
          setText(prev => prev + currentString.charAt(text.length));
        }, 70); // Slower typing
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 5000); // Longer pause for viewing
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, index]);

  return (
    <div className="text-sm md:text-base text-muted leading-relaxed max-w-[65ch] font-tertiary border-l border-accent/50 pl-4 mt-8 min-h-[4rem] md:min-h-[3rem]">
      <span className="text-accent">{`> `}</span>
      {text}
      <span className="animate-pulse text-accent">_</span>
    </div>
  );
};

export default TerminalTypewriter;
