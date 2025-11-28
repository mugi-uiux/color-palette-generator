import React from 'react';
import { Palette } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-900 rounded-lg">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-zinc-900 tracking-tight">配色ジェネレーター</h1>
        </div>
        <div className="text-xs font-medium text-zinc-400 border border-zinc-200 px-2 py-1 rounded-full">
          v1.2
        </div>
      </div>
    </header>
  );
};
