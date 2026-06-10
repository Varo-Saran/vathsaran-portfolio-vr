import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import DecryptedText from './DecryptedText';

const skillModules = [
  {
    id: "CORE_ML",
    title: "Machine Learning & Stats",
    span: "md:col-span-8",
    mem: "8192",
    load: 95,
    skills: ["Scikit-Learn", "XGBoost", "Random Forest", "SVM", "KNN", "Gradient Boosting", "Neural Networks", "NLP", "LLMs"]
  },
  {
    id: "AUX_ENG",
    title: "Data Engineering",
    span: "md:col-span-4",
    mem: "4096",
    load: 85,
    skills: ["Python", "SQL", "Pandas", "NumPy", "Git", "Docker"]
  },
  {
    id: "AUX_ANALYTICS",
    title: "Data Analytics",
    span: "md:col-span-4",
    mem: "2048",
    load: 90,
    skills: ["Time-series Forecasting", "RFM Segmentation", "A/B Testing", "Hypothesis Testing"]
  },
  {
    id: "AUX_VIS",
    title: "Visualization",
    span: "md:col-span-4",
    mem: "2048",
    load: 88,
    skills: ["Streamlit", "Tableau", "Matplotlib", "Seaborn"]
  },
  {
    id: "AUX_CLOUD",
    title: "Prog & DB",
    span: "md:col-span-4",
    mem: "1024",
    load: 80,
    skills: ["PostgreSQL", "MongoDB", "AWS", "GCP", "CI/CD Deployment"]
  }
];

const SkillModuleItem = ({ module, i }) => {
  const ref = useRef(null);
  const isCenter = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const active = isMobile && isCenter;
  const filledBlocks = Math.floor((module.load / 100) * 15);
  const dotSequence = ".".repeat((i % 3) + 2);

  return (
    <motion.div
      ref={ref}
      key={module.id}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay: i * 0.1, duration: 0.3 }}
      className={`relative group ${module.span} reticle-md cursor-pointer md:cursor-default`}
    >
      <div className={`h-full border transition-all duration-300 p-5 md:p-6 flex flex-col gap-4 backdrop-blur-md group-hover:bg-dbh-active group-hover:clip-notch group-hover:border-transparent ${active ? 'bg-dbh-active clip-notch border-transparent' : 'bg-surface/80 border-border'}`}>
        {/* Diagnostic Header */}
        <div className={`text-[10px] font-tertiary uppercase border-b pb-2 flex justify-between tracking-widest transition-colors group-hover:text-white group-hover:border-white/30 ${active ? 'text-white border-white/30' : 'text-muted border-border/50'}`}>
          <span>[ MEM_ALLOC: {module.mem}MB ]</span>
          <span className={`transition-all group-hover:text-white group-hover:animate-pulse ${active ? 'text-white animate-pulse' : 'text-accent'}`}>STATUS: NOMINAL</span>
        </div>
        
        {/* Title */}
        <h4 className={`text-lg md:text-xl font-primary tracking-widest uppercase transition-colors group-hover:text-white ${active ? 'text-white' : 'text-main'}`}>
          {module.title}
        </h4>
        
        {/* Segmented Load Bar */}
        <div className="flex flex-col gap-1 mt-2">
          <span className={`text-[10px] font-tertiary tracking-widest transition-colors group-hover:text-white ${active ? 'text-white' : 'text-muted'}`}>SYSTEM_LOAD</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-[2px]">
              {[...Array(15)].map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-4 transition-colors duration-300 ${
                    idx < filledBlocks 
                      ? (active ? 'bg-white animate-pulse' : 'bg-accent group-hover:bg-white animate-pulse')
                      : (active ? 'bg-white/30' : 'bg-border/30 group-hover:bg-white/30')
                  }`} 
                />
              ))}
            </div>
            <span className={`ml-2 text-xs font-tertiary transition-colors group-hover:text-white ${active ? 'text-white' : 'text-accent'}`}>{module.load}%</span>
          </div>
        </div>

        {/* Terminal Readout List (Skills) */}
        <div className="flex flex-col gap-1 mt-4">
          {module.skills.map((skill, idx) => {
            const pid = (idx + 1).toString().padStart(2, '0');
            return (
              <div key={idx} className={`text-[10px] md:text-xs font-tertiary border-l pl-2 py-[2px] transition-colors grid grid-cols-[auto_1fr] gap-3 items-start group-hover:text-white group-hover:border-white/30 ${active ? 'text-white border-white/30' : 'text-muted border-accent/50'}`}>
                <div className="flex items-center whitespace-nowrap">
                  <span className={`mr-2 transition-colors group-hover:text-white ${active ? 'text-white' : 'text-accent'}`}>{`>`}</span>
                  <span className="opacity-60 mr-2">PID:{pid}</span>
                  <span className={`opacity-80 min-w-[85px] inline-block transition-colors group-hover:text-white ${active ? 'text-white' : 'text-accent'}`}>
                    [ RUNNING <span className="inline-block w-4 text-left">{dotSequence}</span> ]
                  </span>
                </div>
                <span className="uppercase">{skill}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const SkillsLoadout = () => {
  return (
    <section id="SYS_ARCH" className="w-full px-4 md:px-12 lg:px-24 py-16 relative border-t border-border">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-xs tracking-[0.2em] font-tertiary text-accent mb-2">NEURAL_CAPABILITIES // RESOURCE_MONITOR</h2>
        <h3 className="text-2xl md:text-4xl font-primary text-main tracking-widest uppercase flex items-center justify-between">
          <DecryptedText text="SYSTEM_ARCHITECTURE" speed={40} />
          <div className="hidden md:flex flex-col items-end gap-1 text-[10px] text-muted font-tertiary">
            <p>HARDWARE_LINK: SECURED</p>
            <p>LOAD_DISTRIBUTION: OPTIMAL</p>
          </div>
        </h3>
        
        {/* Mobile secondary info */}
        <div className="md:hidden mt-4 flex flex-col gap-1 text-[10px] text-muted font-tertiary uppercase">
          <p>HARDWARE_LINK: SECURED</p>
          <p>LOAD_DISTRIBUTION: OPTIMAL</p>
        </div>
      </div>

      {/* Motherboard Grid Container */}
      <div className="relative border border-dashed border-white/10 p-4 md:p-8 bg-bg/50">
        
        {/* Background Circuit Lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10">
          {skillModules.map((module, i) => (
            <SkillModuleItem key={module.id} module={module} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsLoadout;
