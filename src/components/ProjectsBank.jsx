import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import DecryptedText from './DecryptedText';
import { audioSystem } from '../utils/audioSystem';

const projects = [
  {
    id: "SYS.PRJ.01",
    title: "E-commerce Revenue Intelligence Platform",
    metric: "£5.81M Impact",
    description: "Engineered an RFM segmentation model analyzing 541k transactions to identify VIP customers, driving £5.81M in impact. Deployed an interactive Streamlit dashboard for real-time segmentation and optimized inventory strategy through seasonality analysis.",
    tags: ["RFM Segmentation", "Streamlit", "Python", "Predictive Analytics"]
  },
  {
    id: "SYS.PRJ.02",
    title: "Clinical Heart Disease Prediction System",
    metric: "90.16% Acc",
    description: "Built a Random Forest classifier achieving 90.16% accuracy for early heart disease detection. Reduced the feature space from 13 to 8 using Recursive Feature Elimination (RFE) while maintaining model performance.",
    tags: ["Random Forest", "RFE", "Healthcare Analytics"]
  },
  {
    id: "SYS.PRJ.03",
    title: "Autonomous Vehicle Public Perception Study",
    metric: "91.9% Var",
    description: "Conducted mixed-methods analysis and statistical modeling to understand safety perception, utilizing regression models to explain 91.9% variance. Identified multi-modal sensor fusion as the primary trust driver.",
    tags: ["Regression Models", "Mixed-methods", "Sensor Fusion"]
  },
  {
    id: "SYS.PRJ.04",
    title: "Drone Fleet Predictive Analytics Dashboard",
    metric: "100% Data",
    description: "Developed a 4-page Streamlit analytics platform utilizing Prophet time-series forecasting for sales and maintenance optimization. Processed a 1k-record dataset achieving 100% data completeness, revealing Africa as the top market (23% share).",
    tags: ["Prophet", "Time-series", "Streamlit", "Data Eng"]
  },
  {
    id: "SYS.PRJ.05",
    title: "Titanic Survival Ensemble Model",
    metric: "83.8% CV Acc",
    description: "Implemented a soft-voting ensemble (Random Forest, SVM, KNN) achieving 83.8% cross-validation accuracy. Engineered custom features and managed multicollinearity via VIF analysis, predicting a 36.12% survival rate on unseen test data.",
    tags: ["Ensemble Methods", "SVM", "KNN", "VIF Analysis"]
  }
];

const EqualizerCanvas = () => (
  <div className="w-full h-32 md:h-full min-h-[120px] relative border border-border bg-bg/50 overflow-hidden flex items-center justify-center reticle-md">
    <svg viewBox="0 0 100 100" className="w-full h-full text-accent opacity-80" preserveAspectRatio="none">
      {[10, 30, 50, 70, 90].map((x, i) => (
        <motion.rect
          key={i}
          x={x}
          y="20"
          width="8"
          height="60"
          fill="currentColor"
          animate={{ y: [60, 20, 60], height: [20, 60, 20] }}
          transition={{ repeat: Infinity, duration: 1 + i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </svg>
    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)', backgroundSize: '1rem 1rem', opacity: 0.2 }} />
  </div>
);

const EkgCanvas = () => (
  <div className="w-full h-32 md:h-full min-h-[120px] relative border border-border bg-bg/50 overflow-hidden flex items-center justify-center reticle-md">
    <svg viewBox="0 0 200 100" className="w-full h-full text-accent" preserveAspectRatio="xMidYMid slice">
      <path d="M0 50 H40 L50 20 L60 80 L70 40 L80 50 H200" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <motion.path
        d="M0 50 H40 L50 20 L60 80 L70 40 L80 50 H200"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)', backgroundSize: '1rem 1rem', opacity: 0.2 }} />
  </div>
);

const RadarCanvas = () => (
  <div className="w-full h-32 md:h-full min-h-[120px] relative border border-border bg-bg/50 overflow-hidden flex items-center justify-center reticle-md">
    <svg viewBox="0 0 100 100" className="w-full h-full text-accent p-2">
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      
      <g className="animate-spin origin-center" style={{ animationDuration: '4s', transformOrigin: '50px 50px' }}>
        <path d="M50,50 L50,10 A40,40 0 0,1 84.6,30 Z" fill="currentColor" opacity="0.4" />
      </g>
    </svg>
    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)', backgroundSize: '1rem 1rem', opacity: 0.2 }} />
  </div>
);

const SineWaveCanvas = () => (
  <div className="w-full h-32 md:h-full min-h-[120px] relative border border-border bg-bg/50 overflow-hidden flex items-center justify-center reticle-md">
    <svg viewBox="0 0 200 100" className="w-full h-full text-accent" preserveAspectRatio="none">
      <motion.path
        d="M 0 50 C 25 10, 75 90, 100 50 C 125 10, 175 90, 200 50 C 225 10, 275 90, 300 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        animate={{ x: -100 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      />
      <motion.path
        d="M 0 50 C 25 90, 75 10, 100 50 C 125 90, 175 10, 200 50 C 225 90, 275 10, 300 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
        animate={{ x: -100 }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />
    </svg>
    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)', backgroundSize: '1rem 1rem', opacity: 0.2 }} />
  </div>
);

const DecisionTreeCanvas = () => (
  <div className="w-full h-32 md:h-full min-h-[120px] relative border border-border bg-bg/50 overflow-hidden flex items-center justify-center reticle-md">
    <svg viewBox="0 0 100 100" className="w-full h-full text-accent p-2">
      <line x1="50" y1="20" x2="25" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="50" y1="20" x2="75" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="25" y1="50" x2="15" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="25" y1="50" x2="35" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="75" y1="50" x2="65" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="75" y1="50" x2="85" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      {[
        {x: 50, y: 20}, {x: 25, y: 50}, {x: 75, y: 50}, 
        {x: 15, y: 80}, {x: 35, y: 80}, {x: 65, y: 80}, {x: 85, y: 80}
      ].map((node, i) => (
        <motion.circle
          key={i}
          cx={node.x}
          cy={node.y}
          r="4"
          fill="currentColor"
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
        />
      ))}
    </svg>
    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)', backgroundSize: '1rem 1rem', opacity: 0.2 }} />
  </div>
);

const ProjectsBank = () => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderTelemetry = (id) => {
    switch (id) {
      case "SYS.PRJ.01": return <EqualizerCanvas />;
      case "SYS.PRJ.02": return <EkgCanvas />;
      case "SYS.PRJ.03": return <RadarCanvas />;
      case "SYS.PRJ.04": return <SineWaveCanvas />;
      case "SYS.PRJ.05": return <DecisionTreeCanvas />;
      default: return <SineWaveCanvas />;
    }
  };

  return (
    <section id="DATA_BNK" className="w-full px-4 md:px-12 lg:px-24 py-16 md:py-24 relative border-t border-border overflow-hidden bg-bg">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-xs tracking-[0.2em] font-tertiary text-accent mb-2">INDEX.QUERY [PROJECTS]</h2>
          <h3 className="text-2xl md:text-4xl font-primary text-main tracking-widest uppercase">
            <DecryptedText text="PROJECT_DATA_BANK" speed={40} />
          </h3>
        </div>
        <div className="hidden md:block text-xs font-tertiary text-muted text-right">
          <p>RECORDS_FOUND: {projects.length}</p>
        </div>
      </div>

      <div className="border border-border bg-surface">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 border-b border-border p-4 text-[10px] font-tertiary text-muted tracking-widest uppercase bg-bg">
          <div className="col-span-3 md:col-span-2">INDEX_ID</div>
          <div className="col-span-6 md:col-span-8">DATASET_TITLE</div>
          <div className="col-span-3 md:col-span-2 text-right">PRI_METRIC</div>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col">
          {projects.map((project) => {
            const isExpanded = expandedId === project.id;

            return (
              <div 
                key={project.id} 
                className="group border-b border-border last:border-b-0 hover:bg-border/20 transition-colors reticle-md"
                onClick={() => toggleExpand(project.id)}
                onMouseEnter={() => audioSystem.playHover()}
              >
                {/* Main Row */}
                <div className={`grid grid-cols-12 gap-4 p-4 items-center transition-all duration-300 ${isExpanded ? 'bg-dbh-active clip-notch shadow-[0_0_15px_rgba(19,56,87,0.5)]' : 'group-hover:bg-dbh-hover group-hover:clip-notch'}`}>
                  <div className={`col-span-3 md:col-span-2 text-xs font-tertiary transition-colors ${isExpanded ? 'text-white' : 'text-muted group-hover:text-white'}`}>
                    <span>{project.id}</span>
                  </div>
                  <div className={`col-span-6 md:col-span-8 font-primary text-sm md:text-lg tracking-widest flex items-center gap-2 transition-colors ${isExpanded ? 'text-white' : 'text-main group-hover:text-white'}`}>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2, ease: "linear" }}
                      className={isExpanded ? 'text-white' : 'text-accent group-hover:text-white'}
                    >
                      <ChevronRight size={16} />
                    </motion.div>
                    {project.title}
                  </div>
                  <div className={`col-span-3 md:col-span-2 text-xs md:text-sm font-tertiary text-right transition-colors ${isExpanded ? 'text-white opacity-80' : 'text-accent group-hover:text-white'}`}>
                    {project.metric}
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "linear" }}
                      className="overflow-hidden bg-bg"
                    >
                      <div className="p-4 md:p-8 md:ml-16 border-l-2 border-accent my-4 mr-4 md:mr-8 grid grid-cols-1 md:grid-cols-12 gap-8 relative">
                        {/* Flowchart-style connector line overlay */}
                        <div className="absolute top-0 -left-[2px] w-4 h-4 border-t-2 border-l-2 border-accent" />
                        
                        <div className="md:col-span-8 text-sm text-muted font-secondary leading-relaxed">
                          <p className="mb-6">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, i) => (
                              <span 
                                key={i}
                                className="text-[10px] font-tertiary px-3 py-1 border border-border text-muted clip-notch-sm bg-surface"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="md:col-span-4">
                          {renderTelemetry(project.id)}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsBank;
