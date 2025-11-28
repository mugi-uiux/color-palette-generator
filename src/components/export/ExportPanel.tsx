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
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-700 font-medium"
                >
                    <FileJson className="w-5 h-5" />
                    JSON
                </button>
                <button
                    onClick={() => {
                        parent.postMessage({ pluginMessage: { type: 'create-variables', palette } }, '*');
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white border border-transparent rounded-lg transition-colors font-medium col-span-full md:col-span-2 lg:col-span-4"
                >
                    <svg className="w-5 h-5" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38L19 38V28.5Z" fill="#1ABCFE" />
                        <path d="M0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.98044 38 9.5 38H19V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 55.9991 12.0196 57 9.5 57C6.98044 57 4.56408 55.9991 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5Z" fill="#0ACF83" />
                        <path d="M19 0V19H9.5C6.98044 19 4.56408 17.9991 2.78249 16.2175C1.00089 14.4359 0 12.0196 0 9.5C0 6.98044 1.00089 4.56408 2.78249 2.78249C4.56408 1.00089 6.98044 0 9.5 0H19Z" fill="#F24E1E" />
                        <path d="M0 28.5C0 25.9804 1.00089 23.5641 2.78249 21.7825C4.56408 20.0009 6.98044 19 9.5 19H19V38H9.5C6.98044 38 4.56408 36.9991 2.78249 35.2175C1.00089 33.4359 0 31.0196 0 28.5Z" fill="#A259FF" />
                    </svg>
                    Figmaバリアブルとして登録
                </button>
            </div>
        </div>
    );
};
