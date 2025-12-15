import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import { REPORT_OUTLINE, GeneratedContent } from './types';
import { generateSectionContent } from './services/geminiService';
import ChartSection from './components/ChartSection';
import ProjectSimulator from './components/ProjectSimulator';
import Timeline from './components/Timeline';
import { Menu, Loader2, Share2, Info } from 'lucide-react';

const App: React.FC = () => {
  const [currentSectionId, setCurrentSectionId] = useState<string>('intro');
  const [contentCache, setContentCache] = useState<Record<string, GeneratedContent>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Ref to track which sections are currently being fetched to avoid duplicates
  const fetchingRef = useRef<Set<string>>(new Set());

  const fetchSectionData = async (id: string) => {
    if (contentCache[id] || fetchingRef.current.has(id)) return;
    
    fetchingRef.current.add(id);
    const section = REPORT_OUTLINE.find(item => item.id === id);
    if (!section) return;

    try {
      // console.log("Fetching section:", id); // Debug
      const data = await generateSectionContent(section.title, section.subItems || []);
      setContentCache(prev => ({ ...prev, [id]: data }));
    } catch (error) {
      console.error("Failed to load section", error);
    } finally {
      fetchingRef.current.delete(id);
    }
  };

  // Initial Data for Intro
  useEffect(() => {
    if (!contentCache['intro']) {
       loadSection('intro');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prefetching Logic: Automatically fetch the NEXT section
  useEffect(() => {
    const currentIndex = REPORT_OUTLINE.findIndex(item => item.id === currentSectionId);
    if (currentIndex !== -1 && currentIndex < REPORT_OUTLINE.length - 1) {
      const nextId = REPORT_OUTLINE[currentIndex + 1].id;
      // Small delay to prioritize the current render/interaction
      const timer = setTimeout(() => {
        if (!contentCache[nextId]) {
          fetchSectionData(nextId);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentSectionId, contentCache]);

  const loadSection = useCallback(async (id: string) => {
    setSidebarOpen(false); // Close mobile sidebar on select
    setCurrentSectionId(id);

    if (contentCache[id]) {
      // Already cached, instant transition
      return;
    }

    setLoading(true);
    await fetchSectionData(id);
    setLoading(false);
  }, [contentCache]);

  const currentSectionData = contentCache[currentSectionId];
  const currentSectionMeta = REPORT_OUTLINE.find(i => i.id === currentSectionId);

  // Render markdown content safely
  const renderMarkdown = (text: string) => {
    // Basic markdown parsing for the demo (in production, use react-markdown)
    let html = text
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-cyan-100 mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-10 mb-6 pb-2 border-b border-slate-700">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="text-cyan-300 font-semibold">$1</strong>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc marker:text-cyan-500 pl-2 mb-2 text-slate-300">$1</li>')
      .replace(/\n/gim, '<br />');
      
    return { __html: html };
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar 
        currentSectionId={currentSectionId} 
        onSelectSection={loadSection} 
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              <Menu />
            </button>
            <h2 className="text-lg font-medium text-slate-200 truncate max-w-[200px] md:max-w-none">
              {currentSectionMeta?.title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-2 text-slate-400 hover:text-cyan-400 transition-colors" title="Share Report">
               <Share2 size={18} />
             </button>
             <button className="p-2 text-slate-400 hover:text-cyan-400 transition-colors" title="About">
               <Info size={18} />
             </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
               <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mb-4" />
               <p className="animate-pulse font-mono text-sm">AI Research Agent is analyzing data...</p>
             </div>
          ) : currentSectionData ? (
            <article className="animate-fade-in pb-20">
              <div 
                className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={renderMarkdown(currentSectionData.markdown)} 
              />
              
              {/* Dynamic Timeline - Shown if data exists (likely in project-society or conclusion) */}
              {currentSectionData.timelineEvents && currentSectionData.timelineEvents.length > 0 && (
                <Timeline events={currentSectionData.timelineEvents} />
              )}

              {/* Dynamic Chart */}
              {currentSectionData.chartData && (
                <ChartSection data={currentSectionData} />
              )}

              {/* Project Simulator Module */}
              {currentSectionId === 'project-society' && (
                <ProjectSimulator />
              )}
            </article>
          ) : (
             <div className="text-center text-slate-500 mt-20">
               <p>Select a chapter to begin.</p>
             </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;