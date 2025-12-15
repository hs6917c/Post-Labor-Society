import React, { useState } from 'react';
import { evaluateProjectIdea } from '../services/geminiService';
import { Loader2, Sparkles, Zap } from 'lucide-react';

const ProjectSimulator: React.FC = () => {
  const [skill, setSkill] = useState('');
  const [interest, setInterest] = useState('');
  const [result, setResult] = useState<{
    projectName: string;
    description: string;
    energyCredits: number;
    reasoning: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skill || !interest) return;
    
    setLoading(true);
    const data = await evaluateProjectIdea(skill, interest);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="mt-12 p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-cyan-500/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            Project Society 시뮬레이터
        </h3>
        <p className="text-slate-400 mb-6">
          노동이 사라진 사회에서 당신은 어떤 프로젝트를 통해 가치를 창출하시겠습니까? <br/>
          보유한 기술과 관심사를 입력하여 미래의 역할과 에너지 크레딧(EC) 보상을 확인해보세요.
        </p>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">핵심 보유 기술 (예: 코딩, 요리, 글쓰기)</label>
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
              placeholder="당신의 능력을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">관심 분야 (예: 우주, 역사, 환경보호)</label>
            <input
              type="text"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
              placeholder="관심있는 주제를 입력하세요"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading || !skill || !interest}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Zap className="fill-current" />}
              프로젝트 제안 & 에너지 크레딧 평가 받기
            </button>
          </div>
        </form>

        {result && (
          <div className="bg-slate-950/50 rounded-xl p-6 border border-cyan-500/20 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-xl font-bold text-white">{result.projectName}</h4>
                    <p className="text-cyan-400 text-sm mt-1">프로젝트 제안 승인됨</p>
                </div>
                <div className="text-right">
                    <span className="block text-xs text-slate-400 uppercase tracking-wider">Estimated Reward</span>
                    <span className="text-2xl font-black text-yellow-400 flex items-center justify-end gap-1">
                        <Zap className="w-5 h-5 fill-yellow-400" />
                        {result.energyCredits.toLocaleString()} EC
                    </span>
                </div>
            </div>
            
            <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-lg">
                    <h5 className="text-xs text-slate-500 uppercase font-bold mb-2">Project Description</h5>
                    <p className="text-slate-300 leading-relaxed">{result.description}</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg">
                    <h5 className="text-xs text-slate-500 uppercase font-bold mb-2">Why it matters</h5>
                    <p className="text-slate-300 leading-relaxed">{result.reasoning}</p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSimulator;