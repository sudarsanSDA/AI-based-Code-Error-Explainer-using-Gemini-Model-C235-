import React from 'react';
import { SupportedLanguage } from '../types';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: SupportedLanguage;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language }) => {
  return (
    <div className="relative flex flex-col h-full bg-gray-900 rounded-lg border border-gray-700 overflow-hidden shadow-inner">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
           <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
           </div>
           <span className="ml-3 text-xs text-gray-400 font-mono">input.{language === 'c' || language === 'cpp' ? 'cpp' : language}</span>
        </div>
        <span className="text-xs text-gray-500">Editor</span>
      </div>
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-4 bg-[#0d1117] text-gray-300 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 leading-relaxed"
          placeholder={`Paste your ${language} code here...`}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default CodeEditor;