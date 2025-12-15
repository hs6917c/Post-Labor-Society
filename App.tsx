import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import { REPORT_OUTLINE, GeneratedContent } from './types';
import { generateSectionContent } from './services/geminiService';
import SectionView from './components/SectionView';
import { Menu, Share2, Info, Rocket } from 'lucide-react';

const App: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('intro');
  const [contentCache, setContentCache] = useState<Record<string, GeneratedContent>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // To avoid duplicate fetches
  const fetchQueueRef = useRef<Set<string>>(new Set());

  // Function to fetch a specific section
  const fetchSection = async (id: string) => {
    if (contentCache[id] || fetchQueueRef.current.has(id)) return;
    
    fetchQueueRef.current.add(id);
    setLoadingStates(prev => ({ ...prev, [id]: true }));

    const section = REPORT_OUTLINE.find(item => item.id === id);
    if (!section) return;

    try {
      const data = await generateSectionContent(section.title, section.subItems || []);
      setContentCache(prev => ({ ...prev, [id]: data }));
    } catch (error) {
      console.error(`Failed to load section ${id}`, error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
      fetchQueueRef.current.delete(id);
    }
  };

  // 1. Initial Load & Staggered Fetching Strategy
  useEffect(() => {
    // Immediately fetch the first section
    fetchSection('intro');

    // Stagger fetch the rest to avoid freezing the UI or hitting rate limits instantly
    // We queue them up with delays
    REPORT_OUTLINE.slice(1).forEach((item, index) => {
      setTimeout(() => {
        fetchSection(item.id);
      }, 1500 + (index * 2500)); // Start after 1.5s, then every 2.5s
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Intersection Observer for Scroll Spy
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Active when element is in the top-middle of screen
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSectionId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    REPORT_OUTLINE.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [contentCache]); // Re-run observer when content changes (heights might change)


  // 3. Navigation Handler
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSectionId(id);
      
      // If it's not loaded yet for some reason, force fetch immediately
      if (!contentCache[id] && !loadingStates[id]) {
        fetchSection(id);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar 
        currentSectionId={activeSectionId} 
        onSelectSection={scrollToSection} 
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col relative">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              <Menu />
            </button>
            <div className="flex flex-col">
               <h2 className="text-lg font-medium text-slate-200">
                  Future Civilization Report
               </h2>
               <span className="text-xs text-cyan-500 font-mono">Live Generation Active</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-bold border border-cyan-500/20">
               <Rocket size={14} />
               <span>v2.0 Single View</span>
             </button>
             <button className="p-2 text-slate-400 hover:text-cyan-400 transition-colors" title="Share">
               <Share2 size={18} />
             </button>
          </div>
        </header>

        {/* Content Area - Single Scrollable Page */}
        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
           {REPORT_OUTLINE.map((item) => (
             <SectionView 
               key={item.id}
               item={item}
               data={contentCache[item.id]}
               isLoading={loadingStates[item.id] || (!contentCache[item.id] && !loadingStates[item.id] && false)} // Just show skeleton if loading or waiting
               error={undefined}
             />
           ))}
           
           {/* Footer */}
           <div className="py-20 text-center border-t border-slate-900 mt-20">
              <h3 className="text-2xl font-bold text-slate-700 mb-4">Report End</h3>
              <p className="text-slate-500 text-sm">
                Generated by Gemini 2.5 Flash • 2025 Visionary Report
              </p>
           </div>
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
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default App;