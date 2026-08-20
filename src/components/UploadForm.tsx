import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Upload, FileText, Briefcase } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { motion } from 'framer-motion';

interface UploadFormProps {
  onSubmit: (file: File, jobDescription: string) => void;
  isLoading: boolean;
}

export function UploadForm({ onSubmit, isLoading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [fileError, setFileError] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type !== 'application/pdf') {
        setFileError('Invalid file type. Please upload a PDF file.');
        setFile(null);
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFileError('File is too large. Maximum size is 5MB.');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (file && !fileError) {
      const trimmedDescription = jobDescription.trim();
      onSubmit(file, trimmedDescription);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="max-w-2xl mx-auto p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Analyze Your Resume</h2>
          <p className="text-slate-300">Upload your PDF resume and optionally paste a job description to get AI-powered insights and rewrite suggestions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div className="relative">
            <label 
              htmlFor="resume-upload" 
              className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                file ? 'border-primary bg-primary/10' : 'border-slate-600 bg-slate-800/50 hover:bg-slate-800'
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {file ? (
                  <>
                    <FileText className="w-12 h-12 text-blue-400 mb-3" />
                    <p className="mb-2 text-sm text-slate-200 font-medium">{file.name}</p>
                    <p className="text-xs text-slate-400">Click to replace file</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-400 mb-3" />
                    <p className="mb-2 text-sm text-slate-200">
                      <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-400">PDF files only (Max 5MB)</p>
                  </>
                )}
              </div>
              <input 
                id="resume-upload" 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                onChange={handleFileChange}
                required
              />
            </label>
            {fileError && (
              <p className="mt-2 text-sm text-red-400 font-medium text-center">{fileError}</p>
            )}
          </div>

          {/* Job Description Area */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-300 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Target Job Description (Optional)
              </label>
              <span className={`text-xs ${jobDescription.length >= 5000 ? 'text-red-400' : 'text-slate-400'}`}>
                {jobDescription.length}/5000
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={5000}
              className="w-full rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-4 transition-all resize-none"
              placeholder="Paste the job description here to tailor the analysis..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={!file || !!fileError || isLoading}
            className="w-full py-4 px-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 flex items-center justify-center"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Resume...
              </span>
            ) : (
              'Analyze with AI'
            )}
          </button>
        </form>
      </GlassCard>
    </motion.div>
  );
}
