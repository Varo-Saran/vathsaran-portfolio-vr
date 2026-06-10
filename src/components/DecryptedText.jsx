import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!';

export const DecryptedText = ({ text, speed = 50, delay = 0, className = '', animateOnMount = false }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const containerRef = useRef(null);
  const inViewResult = useInView(containerRef, { once: true, margin: "-10%" });
  const isInView = animateOnMount ? true : inViewResult;

  useEffect(() => {
    if (!isInView) return;

    let timeoutId;
    let intervalId;

    timeoutId = setTimeout(() => {
      setIsDecrypting(true);
      let iteration = 0;
      const maxIterations = text.length;

      intervalId = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iteration) return text[index];
              return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            })
            .join('')
        );

        if (iteration >= maxIterations) {
          clearInterval(intervalId);
          setIsDecrypting(false);
          setDisplayText(text);
        }

        iteration += 1 / 3; // Controls how many cycles each letter takes
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isInView, text, speed, delay]);

  return (
    <span ref={containerRef} className={`${className} inline-block whitespace-pre-wrap`}>
      {displayText || text.replace(/./g, ' ')}
    </span>
  );
};

export default DecryptedText;
