import React, { useState } from 'react';
import { Image, PenTool } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { ColorInput } from './ColorInput';
import type { InputMode } from '../../types';

interface InputPanelProps {
    colors: { primary: string; secondary: string; accent: string };
    onColorsChange: (colors: { primary: string; secondary: string; accent: string }) => void;
    isAccessibleMode: boolean;
    onAccessibleModeChange: (isAccessible: boolean) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
    colors,
    onColorsChange,
    isAccessibleMode,
    onAccessibleModeChange
}) => {
    const [mode, setMode] = useState<InputMode>('image');

    return (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
            <div className="flex border-b border-zinc-200">
                <button
                    onClick={() => setMode('image')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${mode === 'image'
                            ? 'bg-zinc-50 text-zinc-900 border-b-2 border-zinc-900'
                            : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50/50'
                        }`}
                >
                    <Image className="w-4 h-4" />
                    画像から抽出
                </button>
                <button
                    onClick={() => setMode('manual')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${mode === 'manual'
                            ? 'bg-zinc-50 text-zinc-900 border-b-2 border-zinc-900'
                            : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50/50'
                        }`}
                >
                    <PenTool className="w-4 h-4" />
                    手動入力
                </button>
            </div>

            <div className="p-6">
                {mode === 'image' ? (
                    <ImageUploader onColorsExtracted={onColorsChange} />
                ) : (
                    <ColorInput colors={colors} onChange={onColorsChange} />
                )}

                <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium text-zinc-900">アクセシビリティ自動補正</h4>
                        <p className="text-xs text-zinc-500">WCAG 2.1 AA基準を満たすようにコントラストを自動調整します。</p>
                    </div>
                    <button
                        onClick={() => onAccessibleModeChange(!isAccessibleMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 ${isAccessibleMode ? 'bg-zinc-900' : 'bg-zinc-200'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAccessibleMode ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};
