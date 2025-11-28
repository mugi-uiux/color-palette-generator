import React from 'react';
import { Download, FileJson, FileCode, FileText } from 'lucide-react';
import type { GeneratedPalette } from '../../types';
import {
    generateCSV,
    generateCSS,
    generateTailwindConfig,
    generateJSON,
    downloadFile,
    generatePDF
} from '../../utils/export';

interface ExportPanelProps {
    palette: GeneratedPalette;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ palette }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
            <div className="p-6 border-b border-zinc-200">
                <h3 className="text-lg font-semibold text-zinc-900">パレットを書き出し (Export)</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                    onClick={() => downloadFile(generateCSV(palette), 'palette.csv', 'text/csv')}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-700 font-medium"
                >
                    <FileText className="w-5 h-5" />
                    CSV
                </button>
                <button
                    onClick={() => generatePDF(palette)}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-700 font-medium"
                >
                    <Download className="w-5 h-5" />
                    PDF
                </button>
                <button
                    onClick={() => downloadFile(generateCSS(palette), 'variables.css', 'text/css')}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-700 font-medium"
                >
                    <FileCode className="w-5 h-5" />
                    CSS
                </button>
                <button
                    onClick={() => downloadFile(generateTailwindConfig(palette), 'tailwind.config.js', 'text/javascript')}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-700 font-medium"
                >
                    <FileCode className="w-5 h-5" />
                    Tailwind Config
                </button>
                <button
                    onClick={() => downloadFile(generateJSON(palette), 'palette.json', 'application/json')}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-700 font-medium col-span-full md:col-span-2 lg:col-span-4"
                >
                    <FileJson className="w-5 h-5" />
                    JSON
                </button>
            </div>
        </div>
    );
};
