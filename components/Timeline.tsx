import React, { useState } from 'react';
import { TimelineEvent } from '../types';
import { ChevronRight, Clock } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!events || events.length === 0) return null;

  return (
    <div className="my-12 relative animate-fade-in">
      <div className="absolute top-0 left-8 h-full w-0.5 bg-gradient-to-b from-cyan-500/20 via-cyan-500/50 to-transparent"></div>
      
      <h3 className="text-xl font-semibold text-slate-200 mb-8 flex items-center gap-3 pl-2">
        <Clock className="w-6 h-6 text-cyan-400" />
        <span>Future Scenarios (2035-2050)</span>
      </h3>

      <div className="space-y-8">
        {events.map((event, index) => (
          <div 
            key={index} 
            className="relative pl-16 group cursor-pointer"
            onClick={() => setActiveIdx(activeIdx === index ? null : index)}
          >
            {/* Dot on timeline */}
            <div 
              className={`absolute left-[28px] top-1 w-3 h-3 rounded-full border-2 transition-all duration-300 z-10 
              ${activeIdx === index 
                ? 'bg-slate-950 border-cyan-400 scale-125 shadow-[0_0_10px_rgba(34,211,238,0.6)]' 
                : 'bg-slate-900 border-slate-600 group-hover:border-cyan-400'}`}
            ></div>

            {/* Content Card */}
            <div 
              className={`relative bg-slate-900/50 border rounded-xl p-5 transition-all duration-300
              ${activeIdx === index 
                ? 'border-cyan-500/40 bg-slate-800/80 shadow-lg' 
                : 'border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex items-center justify-between mb-2">
                 <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${activeIdx === index ? 'bg-cyan-900/30 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                    {event.year}
                 </span>
                 <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${activeIdx === index ? 'rotate-90 text-cyan-400' : ''}`} />
              </div>
              
              <h4 className={`text-lg font-bold mb-2 transition-colors ${activeIdx === index ? 'text-white' : 'text-slate-300'}`}>
                {event.title}
              </h4>
              
              <p className={`text-slate-400 leading-relaxed overflow-hidden transition-all duration-500 ${activeIdx === index ? 'max-h-40 opacity-100' : 'max-h-12 line-clamp-2 opacity-80'}`}>
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;