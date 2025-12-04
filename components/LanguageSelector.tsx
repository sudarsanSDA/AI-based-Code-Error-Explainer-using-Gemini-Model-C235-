import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SupportedLanguage, LANGUAGE_LABELS } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onChange }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        <span className="text-xs uppercase font-bold tracking-wider">Lang</span>
      </div>
      <select
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value as SupportedLanguage)}
        className="appearance-none bg-gray-800 border border-gray-700 text-white py-2 pl-16 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-48 cursor-pointer hover:bg-gray-750 transition-colors"
      >
        {Object.entries(LANGUAGE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
};

export default LanguageSelector;