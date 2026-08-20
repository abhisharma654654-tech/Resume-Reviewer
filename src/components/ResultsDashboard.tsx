import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, Copy, Sparkles, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GlassCard } from './ui/GlassCard';
import type { AnalysisResponse } from '../types';

interface ResultsDashboardProps {
  data: AnalysisResponse;
  onReset: () => void;
}

export function ResultsDashboard({ data, onReset }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'rewrites' | 'interview' | 'resume'>('overview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.rewrittenResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'rewrites', label: 'Rewrite Suggestions' },
    { id: 'interview', label: 'Interview Prep' },
    { id: 'resume', label: 'Rewritten Resume' },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
        <button 
          onClick={onReset}
          className="text-slate-400 hover:text-white transition-colors"
        >
          Start Over
        </button>
      </div>

      <div className="flex space-x-2 bg-slate-900/50 p-1 rounded-xl backdrop-blur-sm overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-blue-600/20 text-blue-400 shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard className="p-8 flex flex-col items-center justify-center text-center">
              <h3 className="text-slate-300 font-medium mb-4">ATS Match Score</h3>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                  <motion.circle 
                    initial={{ strokeDasharray: "0 1000" }}
                    animate={{ strokeDasharray: `${(data.atsScore / 100) * 377} 1000` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    className={getScoreColor(data.atsScore)} 
                  />
                </svg>
                <span className={`absolute text-4xl font-bold ${getScoreColor(data.atsScore)}`}>
                  {data.atsScore}%
                </span>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6 md:col-span-2">
              <h3 className="text-lg font-medium text-white mb-4">Skill Gap Analysis</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Matched Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skillGap.matched.map((skill, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-400 mb-3 flex items-center">
                    <XCircle className="w-4 h-4 mr-2" /> Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skillGap.missing.map((skill, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'rewrites' && (
          <div className="space-y-4">
            {data.rewriteSuggestions.map((suggestion, idx) => (
              <GlassCard key={idx} className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Original</h4>
                    <p className="text-slate-300 text-sm bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">{suggestion.before}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" /> Improved
                    </h4>
                    <p className="text-white text-sm bg-blue-900/20 p-3 rounded-lg border border-blue-800/30">{suggestion.after}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-start p-3 bg-indigo-900/10 rounded-lg border border-indigo-500/20">
                  <ChevronRight className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 shrink-0" />
                  <p className="text-indigo-200 text-sm"><span className="font-medium">Impact:</span> {suggestion.impact}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="space-y-4">
            {data.interviewPrep.map((prep, idx) => (
              <GlassCard key={idx} className="p-6 border-l-4 border-l-purple-500">
                <h4 className="text-lg font-medium text-white mb-4 flex items-start">
                  <MessageSquare className="w-5 h-5 mr-3 mt-1 text-purple-400 shrink-0" />
                  {prep.question}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-800/40 p-4 rounded-lg">
                    <span className="font-semibold text-purple-400 block mb-1">Situation</span>
                    <p className="text-slate-300">{prep.situation}</p>
                  </div>
                  <div className="bg-slate-800/40 p-4 rounded-lg">
                    <span className="font-semibold text-purple-400 block mb-1">Task</span>
                    <p className="text-slate-300">{prep.task}</p>
                  </div>
                  <div className="bg-slate-800/40 p-4 rounded-lg">
                    <span className="font-semibold text-purple-400 block mb-1">Action</span>
                    <p className="text-slate-300">{prep.action}</p>
                  </div>
                  <div className="bg-slate-800/40 p-4 rounded-lg">
                    <span className="font-semibold text-purple-400 block mb-1">Result</span>
                    <p className="text-slate-300">{prep.result}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {activeTab === 'resume' && (
          <GlassCard className="p-0 overflow-hidden">
            <div className="bg-slate-800/50 p-4 border-b border-slate-700/50 flex justify-between items-center">
              <h3 className="text-white font-medium">AI Rewritten Resume</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={handleCopy}
                  className="flex items-center px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="p-8 bg-white text-slate-900 prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-xl prose-h2:border-b-2 prose-h2:border-slate-200 prose-h2:pb-2 prose-a:text-blue-600">
              <ReactMarkdown>{data.rewrittenResume.replace(/\\n/g, '\n').replace(/\n/g, '  \n')}</ReactMarkdown>
            </div>
          </GlassCard>
        )}
      </div>
    </motion.div>
  );
}
