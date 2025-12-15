import React from 'react';
import { GeneratedContent, OutlineItem } from '../types';
import ChartSection from './ChartSection';
import ProjectSimulator from './ProjectSimulator';
import Timeline from './Timeline';
import { SkeletonLoader } from './SkeletonLoader';
import { AlertCircle } from 'lucide-react';

interface SectionViewProps {
  item: OutlineItem;
  data?: GeneratedContent;
  isLoading: boolean;
  error?: string;
}

const SectionView: React.FC<SectionViewProps> = ({ item, data, isLoading, error }) => {
  // Markdown renderer with adjusted header sizes to fit the report hierarchy
  const renderMarkdown = (text: string) => {
    let html = text
      // Downgrade AI generated headers to avoid conflict with Section Title
      .replace(/^### (.*$)/gim, '<h4 class="text-lg font-bold text-cyan-200 mt-6 mb-3 flex items-center gap-2"><span class="w-1 h-4 bg-cyan-500 rounded"></span>$1</h4>')
      .replace(/^## (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-8 mb-4">$1</h3>')
      .replace(/^# (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-8 mb-4">$1</h3>') // Treat H1 as H3 inside section
      .replace(/\*\*(.*)\*\*/gim, '<strong class="text-cyan-300 font-medium">$1</strong>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc marker:text-cyan-600 pl-1 mb-1.5 text-slate-300 leading-relaxed">$1</li>')
      .replace(/\n/gim, '<br />');
    return { __html: html };
  };

  return (
    <section id={item.id} className="min-h-[60vh] py-20 border-b border-slate-900/50 scroll-mt-20">
      <div className="mb-10 pb-4 border-b border-slate-800">
        <h2 className="text-xs font-mono text-cyan-500 mb-3 uppercase tracking-widest opacity-80">
            Chapter 0{item.id === 'intro' ? '1' : 'X'} — {item.id.toUpperCase()}
        </h2>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
          {item.title}
        </h1>
        {item.subItems && (
            <div className="mt-4 flex flex-wrap gap-2">
                {item.subItems.map((sub, i) => (
                    <span key={i} className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        {sub}
                    </span>
                ))}
            </div>
        )}
      </div>

      {isLoading ? (
        <SkeletonLoader />
      ) : error ? (
        <div className="p-4 border border-red-900/50 bg-red-900/10 rounded-lg flex items-center gap-3 text-red-400">
           <AlertCircle />
           <p>리포트 생성 실패. 잠시 후 다시 시도해주세요.</p>
        </div>
      ) : data ? (
        <div className="animate-fade-in">
          <div 
            className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={renderMarkdown(data.markdown)} 
          />
          
          {/* Visual Components */}
          {data.timelineEvents && data.timelineEvents.length > 0 && (
            <Timeline events={data.timelineEvents} />
          )}

          {data.chartData && (
            <ChartSection data={data} />
          )}

          {item.id === 'project-society' && (
            <ProjectSimulator />
          )}
        </div>
      ) : null}
    </section>
  );
};

export default SectionView;