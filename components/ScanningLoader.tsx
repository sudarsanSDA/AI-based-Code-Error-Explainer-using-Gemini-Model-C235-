import React, { useEffect, useState } from 'react';
import { SupportedLanguage } from '../types';
import { Terminal, ShieldCheck, Search, Cpu, Database } from 'lucide-react';

interface ScanningLoaderProps {
  language: SupportedLanguage;
}

const ScanningLoader: React.FC<ScanningLoaderProps> = ({ language }) => {
  const [logs, setLogs] = useState<string[]>([]);
  
  // Language specific analysis steps to make it feel "real"
  const getStepsForLanguage = (lang: SupportedLanguage) => {
    const common = [
      "Initializing environment...",
      "Tokenizing input stream...",
      "Building Abstract Syntax Tree (AST)...",
    ];

    const specific: Record<string, string[]> = {
      python: [
        "Checking indentation levels...",
        "Validating PEP-8 compliance...",
        "Analyzing dynamic typing...",
        "Checking for unhandled exceptions..."
      ],
      javascript: [
        "Verifying scope chain...",
        "Checking for hoisting issues...",
        "Analyzing async/await patterns...",
        "Validating prototype references..."
      ],
      typescript: [
        "Compiling to intermediate representation...",
        "Checking interface compliance...",
        "Verifying type safety...",
        "Analyzing generic constraints..."
      ],
      c: [
        "Checking preprocessor directives...",
        "Verifying pointer arithmetic...",
        "Analyzing stack memory usage...",
        "Checking for buffer overflows..."
      ],
      cpp: [
        "Checking template instantiations...",
        "Verifying RAII compliance...",
        "Checking memory allocation...",
        "Analyzing move semantics..."
      ],
      rust: [
        "Running borrow checker...",
        "Verifying ownership rules...",
        "Checking lifetimes...",
        "Ensuring thread safety..."
      ],
      go: [
        "Checking goroutine leaks...",
        "Validating channel operations...",
        "Analyzing interface implementation...",
        "Running go fmt check..."
      ],
      sql: [
        "Parsing query structure...",
        "Checking foreign key constraints...",
        "Optimizing query execution plan...",
        "Validating index usage..."
      ]
    };

    const langSpecific = specific[lang] || specific['python'];
    
    return [
      ...common,
      ...langSpecific,
      "Consulting Gemini Knowledge Base...",
      "Synthesizing solution...",
      "Finalizing response..."
    ];
  };

  useEffect(() => {
    const steps = getStepsForLanguage(language);
    let currentIndex = 0;
    
    // Clear logs on mount
    setLogs([]);

    const interval = setInterval(() => {
      if (currentIndex < steps.length) {
        setLogs(prev => {
           // Keep only last 6 lines to prevent overflow looking messy
           const newLogs = [...prev, steps[currentIndex]];
           return newLogs.slice(-7);
        });
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 600); // Add a new line every 600ms

    return () => clearInterval(interval);
  }, [language]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-950 rounded-xl border border-gray-800 shadow-2xl overflow-hidden relative">
      {/* Decorative scan line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 animate-scan"></div>
      
      <div className="w-full max-w-md bg-black rounded-lg border border-gray-800 p-4 font-mono text-xs shadow-inner relative overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center space-x-2 border-b border-gray-800 pb-2 mb-3">
          <Terminal className="w-3 h-3 text-gray-500" />
          <span className="text-gray-500">analyser_daemon — zsh — 80x24</span>
        </div>

        {/* Terminal Body */}
        <div className="space-y-1.5 h-48 flex flex-col justify-end">
            {logs.map((log, index) => (
                <div key={index} className="flex items-center space-x-2 text-green-500 animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="opacity-50 text-green-800">➜</span>
                    <span>{log}</span>
                </div>
            ))}
            <div className="flex items-center space-x-2 text-green-500">
                <span className="opacity-50 text-green-800">➜</span>
                <span className="w-2 h-4 bg-green-500 animate-pulse"></span>
            </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-4 w-full max-w-md">
        <div className="flex flex-col items-center space-y-2 animate-pulse">
            <Search className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Parsing</span>
        </div>
        <div className="flex flex-col items-center space-y-2 animate-pulse delay-150">
            <ShieldCheck className="w-5 h-5 text-purple-500" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Safety</span>
        </div>
        <div className="flex flex-col items-center space-y-2 animate-pulse delay-300">
            <Cpu className="w-5 h-5 text-yellow-500" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Logic</span>
        </div>
        <div className="flex flex-col items-center space-y-2 animate-pulse delay-500">
            <Database className="w-5 h-5 text-green-500" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Optimize</span>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 0.5; }
            90% { opacity: 0.5; }
            100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
            animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ScanningLoader;