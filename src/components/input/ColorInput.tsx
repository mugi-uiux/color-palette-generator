import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { generateMissingColors } from '../../utils/color/auto-complete';
import { isValidHex } from '../../utils/color/color-conversion';

interface ColorInputProps {
    colors: { primary: string; secondary: string; accent: string };
    onChange: (colors: { primary: string; secondary: string; accent: string }) => void;
}

export const ColorInput: React.FC<ColorInputProps> = ({ colors, onChange }) => {
    const [localColors, setLocalColors] = useState(colors);

    useEffect(() => {
        setLocalColors(colors);
    }, [colors]);

    const handleChange = (role: 'primary' | 'secondary' | 'accent', value: string) => {
        const newColors = { ...localColors, [role]: value };
        setLocalColors(newColors);

        // Only propagate if valid hex
        if (isValidHex(value)) {
            onChange(newColors);
        }
    };

    const handleAutoFill = () => {
        // Determine which are "empty" or invalid, or just use what's there to regenerate missing
        // For this tool, let's treat empty string as missing.
        const filled = generateMissingColors(
            localColors.primary || undefined,
            localColors.secondary || undefined,
            localColors.accent || undefined
        );
        setLocalColors(filled);
        onChange(filled);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(['primary', 'secondary', 'accent'] as const).map((role) => (
                    <div key={role} className="space-y-3">
                        <label className="block text-sm font-medium text-zinc-700 capitalize flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                            {role} Color
                        </label>
                        <div className="flex gap-3">
                            <div className="relative flex-shrink-0">
                                <input
                                    type="color"
                                    value={localColors[role] || '#ffffff'}
                                    onChange={(e) => handleChange(role, e.target.value)}
                                    className="h-11 w-11 rounded-lg border border-zinc-200 cursor-pointer p-1 bg-white"
                                />
                            </div>
                            <input
                                type="text"
                                value={localColors[role]}
                                onChange={(e) => handleChange(role, e.target.value)}
                                placeholder="#000000"
                                className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-mono text-zinc-600 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none transition-all placeholder:text-zinc-300"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleAutoFill}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    自動補完 (Auto-complete)
                </button>
            </div>
        </div>
    );
};
