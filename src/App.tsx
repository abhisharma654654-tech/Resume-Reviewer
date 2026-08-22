import { useState } from 'react';
import axios from 'axios';
import { UploadForm } from './components/UploadForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import type { AnalysisResponse } from './types';

// Use a simple gradient text for the logo/header
function Header() {
  return (
    <header className="py-6 px-8 flex justify-between items-center max-w-7xl mx-auto w-full">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white font-bold text-xl leading-none">R</span>
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Resume Reviewer
        </h1>
      </div>
    </header>
  );
}

function App() {
  const [appState, setAppState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAnalyze = async (file: File, jobDescription: string) => {
    setAppState('loading');
    setErrorMsg('');
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription) {
        formData.append('jobDescription', jobDescription);
      }

      // In production, this would be an environment variable or relative path
      const API_URL = 'http://localhost:3001/api/analyze';
      
      const response = await axios.post<AnalysisResponse>(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setAnalysisData(response.data);
      setAppState('success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || err.message || 'An error occurred during analysis');
      setAppState('error');
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setAnalysisData(null);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center p-6 relative z-10 w-full">
        {appState === 'error' && (
          <div className="w-full max-w-2xl mx-auto mb-8 bg-red-900/30 border border-red-500/50 p-4 rounded-xl backdrop-blur-md text-red-200 flex justify-between items-center">
            <p>{errorMsg}</p>
            <button onClick={() => setAppState('idle')} className="text-red-400 hover:text-red-300">
              Dismiss
            </button>
          </div>
        )}

        {(appState === 'idle' || appState === 'error' || appState === 'loading') && (
          <div className="w-full">
            <UploadForm onSubmit={handleAnalyze} isLoading={appState === 'loading'} />
          </div>
        )}

        {appState === 'success' && analysisData && (
          <ResultsDashboard data={analysisData} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}

export default App;
