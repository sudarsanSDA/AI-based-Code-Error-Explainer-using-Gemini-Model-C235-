import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LanguageSelector from './components/LanguageSelector';
import CodeEditor from './components/CodeEditor';
import AnalysisResult from './components/AnalysisResult';
import { analyzeCode } from './services/geminiService';
import { AnalysisResponse, SupportedLanguage, DEFAULT_SNIPPETS } from './types';
import { Play, RotateCcw, AlertOctagon } from 'lucide-react';

const App: React.FC = () => {
  const [language, setLanguage] = useState<SupportedLanguage>(SupportedLanguage.PYTHON);
  const [code, setCode] = useState<string>(DEFAULT_SNIPPETS[SupportedLanguage.PYTHON]);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset code snippet when language changes if the code matches the previous default
    // Or just set the new default for simplicity in this demo
    setCode(DEFAULT_SNIPPETS[language]);
    setResult(null);
    setError(null);
  }, [language]);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError("Please enter some code to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const apiKey = process.env.API_KEY || '';
      if (!apiKey) {
        throw new Error("API Key is not configured in the environment.");
      }
      
      const analysis = await analyzeCode(code, language, apiKey);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCode(DEFAULT_SNIPPETS[language]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col font-sans text-gray-100">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
             <LanguageSelector selectedLanguage={language} onChange={setLanguage} />
             <div className="h-6 w-px bg-gray-800 hidden sm:block"></div>
             <p className="text-sm text-gray-500 hidden sm:block">
               {language === 'python' ? 'Indentation matters!' : 'Don\'t forget semicolons!'}
             </p>
          </div>

          <div className="flex space-x-3 w-full sm:w-auto">
             <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors flex items-center justify-center space-x-2 border border-gray-700"
              disabled={loading}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-white text-sm font-semibold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center space-x-2
                ${loading 
                  ? 'bg-blue-600/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95'
                }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Analyze & Fix</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center space-x-3 animate-pulse">
            <AlertOctagon className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
          
          {/* Left: Code Input */}
          <div className="flex flex-col h-full">
            <CodeEditor code={code} onChange={setCode} language={language} />
            <div className="mt-2 flex justify-between text-xs text-gray-500 px-1">
                <span>{code.length} chars</span>
                <span>Lines: {code.split('\n').length}</span>
            </div>
          </div>

          {/* Right: Results */}
          <div className="h-full bg-[#161b22] rounded-lg border border-gray-800 p-1 shadow-inner overflow-hidden">
            <AnalysisResult result={result} loading={loading} language={language} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;