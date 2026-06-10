import React from 'react';
import { motion } from 'motion/react';
import DecryptedText from './DecryptedText';

const operations = [
  {
    id: "OP.01",
    type: "LEADERSHIP",
    title: "Sub-Leader & Coordinator - IoT Professional Training Program",
    organization: "Esoft Metro Campus",
    bullets: [
      "Co-led a 19-member cross-functional team in designing and delivering a full-day IoT workshop across a two-month lifecycle.",
      "Translated complex technical concepts (sensor networks, data analytics) into accessible presentations for senior leadership and non-technical stakeholders.",
      "Orchestrated multi-channel communication strategies using virtual meetings and agile methodologies, resulting in 100% on-time delivery."
    ]
  },
  {
    id: "OP.02",
    type: "EDUCATION",
    title: "Higher National Diploma in Data Analytics",
    organization: "ESOFT University, Colombo",
    bullets: [
      "Pearson-assured UK Standard."
    ]
  },
  {
    id: "OP.03",
    type: "EDUCATION",
    title: "Diploma in Information Technology (DICT)",
    organization: "ESOFT University, Colombo",
    bullets: []
  },
  {
    id: "OP.04",
    type: "EDUCATION",
    title: "Edexcel IGCSE O-Levels",
    organization: "Secondary Education",
    bullets: [
      "Physics, Biology, Chemistry, Mathematics, English, ICT."
    ]
  }
];

const OperationsRecord = () => {
  return (
    <section id="OPS_LOG" className="w-full px-4 md:px-12 lg:px-24 py-16 md:py-24 relative border-t border-border">
      <div className="flex items-end justify-between mb-16">
        <div>
          <h2 className="text-xs tracking-[0.2em] font-tertiary text-accent mb-2">LOG.ARCHIVE</h2>
          <h3 className="text-2xl md:text-4xl font-primary text-main tracking-widest uppercase">
            <DecryptedText text="OPERATIONS_RECORD" speed={40} />
          </h3>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Strict 1px vertical line */}
        <div className="flex flex-col gap-12 relative pb-12">
          {/* Main vertical line now stops at the last element */}
          <div className="absolute left-4 md:left-[120px] top-0 bottom-0 w-[1px] bg-border" />

          {operations.map((op, i) => (
            <motion.div 
              key={op.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.3, delay: i * 0.1, ease: "linear" }}
              className="relative flex items-start group"
            >
              {/* Timeline Info (Left) */}
              <div className="hidden md:block w-[100px] text-right pr-6 pt-1">
                <div className="text-[10px] font-tertiary text-muted transition-colors group-hover:text-white/60">{op.id}</div>
                <div className="text-xs font-primary text-accent tracking-widest uppercase mt-1 group-hover:text-accent transition-colors">{op.type}</div>
              </div>

              {/* Central Node */}
              <div 
                className="absolute left-4 md:left-[120px] top-1.5 -translate-x-1/2 w-4 h-4 border border-border bg-bg flex items-center justify-center transition-all duration-300 group-hover:border-accent z-10" 
                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              >
                <div className="w-1.5 h-1.5 bg-border group-hover:bg-accent transition-colors duration-300" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
              </div>

              {/* Flowchart Content (Right) */}
              <div className="ml-12 flex-1 pt-0 relative">
                {/* Connecting branch to main node */}
                <div className="absolute top-3.5 -left-8 w-6 h-[1px] bg-border group-hover:bg-accent transition-colors duration-300" />
                
                <div className="md:hidden text-[10px] font-tertiary text-accent tracking-widest mb-1">
                  [{op.id}] {op.type}
                </div>
                
                {/* Flowchart Action Block */}
                <div className="inline-block px-4 py-2 bg-surface/50 border border-border group-hover:bg-dbh-active group-hover:clip-notch transition-all duration-300 mb-4 relative z-10">
                  <h4 className="text-sm md:text-base font-primary text-main group-hover:text-white tracking-widest uppercase transition-colors">
                    {op.title}
                  </h4>
                  <div className="text-[10px] font-tertiary text-muted group-hover:text-white/80 mt-1 transition-colors">
                    {op.organization}
                  </div>
                </div>
                
                {/* Bullets sub-tree */}
                {op.bullets.length > 0 && (
                  <ul className="flex flex-col gap-3 relative mt-2">
                    {/* Vertical line connecting bullets to block */}
                    <div className="absolute left-[11px] -top-6 bottom-4 w-[1px] bg-border group-hover:bg-accent/60 transition-colors duration-300" />
                    
                    {op.bullets.map((bullet, j) => (
                      <li key={j} className="text-xs md:text-sm text-muted font-secondary leading-relaxed pl-8 relative group-hover:text-main transition-colors">
                        {/* Flowchart elbow for bullet */}
                        <div className="absolute left-[11px] top-[0.6em] w-4 h-[1px] bg-border group-hover:bg-accent/60 transition-colors duration-300" />
                        <div className="absolute left-[25px] top-[0.5em] w-1 h-1 bg-border group-hover:bg-accent/60" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OperationsRecord;
