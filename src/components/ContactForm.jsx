import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, TerminalSquare } from 'lucide-react';
import DecryptedText from './DecryptedText';
import HoloInput from './HoloInput';
import IconX from './IconX';
import IconLinkedIn from './IconLinkedIn';
import IconGitHub from './IconGitHub';
import IconGmail from './IconGmail';

// Utility to generate random hex string
const generateHex = (length) => {
  const chars = '0123456789ABCDEF';
  let result = '0x';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Utility to generate binary stream
const generateBinaryStream = (rows, cols) => {
  let stream = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      stream += Math.random() > 0.5 ? '1' : '0';
    }
    stream += '\n';
  }
  return stream;
};

const ContactForm = () => {
  const [status, setStatus] = useState('');
  const [encryptionKey, setEncryptionKey] = useState(generateHex(12));
  const [dataStream, setDataStream] = useState(generateBinaryStream(15, 12));
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  useEffect(() => {
    // Live Encryption Key Interval
    const keyInterval = setInterval(() => {
      setEncryptionKey(generateHex(12));
    }, 100);

    // Live Data Stream Interval
    const streamInterval = setInterval(() => {
      setDataStream(generateBinaryStream(15, 12));
    }, 150);

    return () => {
      clearInterval(keyInterval);
      clearInterval(streamInterval);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    
    fetch(form.action, {
      method: form.method,
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        setStatus("SUCCESS");
        form.reset();
      } else {
        setStatus("ERROR");
      }
    }).catch(error => {
      setStatus("ERROR");
    });
  };

  return (
    <section id="COM_LNK" className="w-full px-4 md:px-12 lg:px-24 py-16 md:py-24 relative border-t border-border overflow-hidden">
      <div className="flex items-end justify-between mb-16 relative z-10">
        <div>
          <h2 className="text-xs tracking-[0.2em] font-tertiary text-accent mb-2">COMM.PROTOCOL [SECURE]</h2>
          <h3 className="text-2xl md:text-4xl font-primary text-main tracking-widest uppercase">
            <DecryptedText text="SECURE_UPLINK" speed={40} />
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Terminal System Log */}
            <div className="font-tertiary text-xs md:text-sm text-muted leading-loose mb-12 bg-surface p-4 border border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/20" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent/20" />
              
              <div className="flex gap-2">
                <span className="text-accent">{`>`}</span>
                <DecryptedText text="INITIALIZING SECURE COMMS..." speed={20} animateOn="view" />
              </div>
              <div className="flex gap-2">
                <span className="text-accent">{`>`}</span>
                <DecryptedText text="RSA-4096 ENCRYPTION VERIFIED" speed={20} delay={800} animateOn="view" />
              </div>
              <div className="flex gap-2">
                <span className="text-accent">{`>`}</span>
                <DecryptedText text="AWAITING USER PAYLOAD" speed={20} delay={1600} animateOn="view" />
                <span className="animate-pulse text-accent">_</span>
              </div>
            </div>

            {/* Social Nodes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'EMAIL', label: 'varosaran@gmail.com', icon: IconGmail, href: 'mailto:varosaran@gmail.com' },
                { id: 'LOC', label: 'Colombo, LK', icon: MapPin, href: null },
                { id: 'LINKEDIN', label: 'LINKEDIN_PROFILE', icon: IconLinkedIn, href: 'https://linkedin.com/in/vathsaran' },
                { id: 'GITHUB', label: 'GITHUB_ACCESS', icon: IconGitHub, href: 'https://github.com/vathsaran' },
                { id: 'X_NET', label: 'X_TRANSMISSION', icon: IconX, href: 'https://twitter.com/vathsaran' }
              ].map((social) => {
                const Icon = social.icon;
                const inner = (
                  <div 
                    className="group flex flex-col p-4 border border-border/50 bg-surface/30 hover:bg-surface hover:border-accent/50 transition-all duration-300 relative cursor-pointer h-[80px] justify-between reticle-sm"
                    onMouseEnter={() => setHoveredSocial(social.id)}
                    onMouseLeave={() => setHoveredSocial(null)}
                  >
                    {/* Brackets logic */}
                    <div className="flex items-center justify-between text-muted group-hover:text-accent transition-colors">
                      <span className="flex items-center gap-2 text-[10px] tracking-widest font-tertiary">
                        <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">[</span>
                        {social.id}
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">]</span>
                      </span>
                      <Icon size={14} />
                    </div>
                    
                    <div className="text-xs font-tertiary text-main truncate mt-2">
                      {hoveredSocial === social.id ? (
                        <DecryptedText text={social.label} speed={40} animateOnMount />
                      ) : (
                        social.label
                      )}
                    </div>
                  </div>
                );

                if (social.href) {
                  return (
                    <a href={social.href} target="_blank" rel="noreferrer" className="block outline-none" key={social.id}>
                      {inner}
                    </a>
                  );
                }
                return <div key={social.id}>{inner}</div>;
              })}
            </div>
          </div>
          
        </div>

        <div className="lg:col-span-7">
          {/* Encryption Header */}
          <div className="mb-6 font-tertiary text-[10px] text-accent tracking-widest border-b border-accent/30 pb-2">
            [ RSA-4096 HANDSHAKE ] // KEY: {encryptionKey}
          </div>

          <form 
            action="https://formspree.io/f/myzygevq" 
            method="POST" 
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <HoloInput 
                id="name" 
                label="IDENTIFIER" 
                type="text" 
                placeholder="[ INPUT_SENDER_ID ]" 
                required={true} 
              />
              <HoloInput 
                id="email" 
                label="RETURN_ADDRESS" 
                type="email" 
                placeholder="[ INPUT_EMAIL ]" 
                required={true} 
              />
            </div>

            <div className="mt-4">
              <HoloInput 
                id="message" 
                label="PAYLOAD" 
                isTextArea={true} 
                rows={5} 
                placeholder="[ ENTER_TRANSMISSION_DATA ]" 
                required={true} 
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-xs font-tertiary text-muted">
                {status === 'SUCCESS' && <span className="text-green-500">TRANSMISSION_SUCCESSFUL</span>}
                {status === 'ERROR' && <span className="text-red-500">TRANSMISSION_FAILED. RETRY.</span>}
              </div>
              <button 
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="bg-accent text-bg font-primary uppercase tracking-widest text-sm px-8 py-4 hover:bg-main hover:text-bg transition-colors duration-200 flex items-center gap-2 border border-transparent reticle-lg min-w-[240px] justify-center"
              >
                {isHovered ? (
                  <span className="flex items-center">
                    {`>`} TRANSMIT_PAYLOAD<span className="animate-pulse">_</span>
                  </span>
                ) : (
                  "INITIATE_DATA_TRANSFER"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
