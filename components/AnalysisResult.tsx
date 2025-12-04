import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AnalysisResponse, SupportedLanguage } from '../types';
import { CheckCircle2, AlertTriangle, Lightbulb, Copy, Check, Info, Box, Timer, Activity } from 'lucide-react';
import ScanningLoader from './ScanningLoader';

interface AnalysisResultProps {
  result: AnalysisResponse | null;
  loading: boolean;
  language: SupportedLanguage;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, loading, language }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (result?.correctedCode) {
      navigator.clipboard.writeText(result.correctedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <ScanningLoader language={language} />;
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-900/50 rounded-xl border border-gray-800 border-dashed">
        <div className="p-4 bg-gray-800 rounded-full mb-4">
            <Lightbulb className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Ready to Explain</h3>
        <p className="text-gray-500 text-sm max-w-xs">Paste your code in the editor and click "Analyze & Fix" to get started.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6 animate-in fade-in duration-500 pb-10 custom-scrollbar">
      
      {/* Summary Section */}
      <div className="bg-gray-800 rounded-xl p-5 border-l-4 border-red-500 shadow-lg">
        <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-bold text-white tracking-tight">{result.errorType}</h3>
            </div>
        </div>
        <p className="text-gray-300 leading-relaxed font-medium">{result.summary}</p>
      </div>

      {/* Complexity Cards */}
      {result.complexity && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 flex flex-col">
            <div className="flex items-center space-x-2 mb-2 text-blue-400">
              <Timer className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Time Complexity</span>
            </div>
            <p className="text-gray-200 text-sm font-mono">{result.complexity.time}</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 flex flex-col">
            <div className="flex items-center space-x-2 mb-2 text-purple-400">
              <Box className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Space Complexity</span>
            </div>
            <p className="text-gray-200 text-sm font-mono">{result.complexity.space}</p>
          </div>
        </div>
      )}

      {/* Technical Deep Dive */}
      {result.technicalDetails && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700/50">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Technical Deep Dive
            </h4>
            <div className="prose prose-invert prose-sm max-w-none text-gray-400">
              <ReactMarkdown>{result.technicalDetails}</ReactMarkdown>
            </div>
        </div>
      )}

      {/* Beginner Explanation Section */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h4 className="text-sm font-bold text-yellow-500 uppercase tracking-wider mb-4 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2" />
            Beginner Explanation
        </h4>
        <div className="prose prose-invert prose-sm max-w-none text-gray-300">
          <ReactMarkdown components={{
             code({className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <SyntaxHighlighter
                  // @ts-ignore
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-700 px-1 py-0.5 rounded text-blue-300 font-mono text-xs" {...props}>
                  {children}
                </code>
              )
            }
          }}>{result.detailedExplanation}</ReactMarkdown>
        </div>
      </div>

      {/* Corrected Code Section */}
      <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
             <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Corrected Solution
            </h4>
            <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
            >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
        </div>
        <div className="relative group">
            <SyntaxHighlighter
                language={language === 'c' || language === 'cpp' ? 'cpp' : language}
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: '1.5rem', background: '#0d1117' }}
                showLineNumbers={true}
                lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#4a5568' }}
            >
                {result.correctedCode}
            </SyntaxHighlighter>
        </div>
      </div>

      {/* Best Practices */}
      {result.bestPractices && result.bestPractices.length > 0 && (
        <div className="bg-blue-900/10 rounded-xl p-5 border border-blue-900/30">
           <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center">
             <Info className="w-4 h-4 mr-2" />
             Best Practices & Tips
           </h4>
           <ul className="space-y-3">
             {result.bestPractices.map((tip, idx) => (
               <li key={idx} className="flex items-start space-x-3 text-sm text-blue-200/80">
                 <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                 <span>{tip}</span>
               </li>
             ))}
           </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;