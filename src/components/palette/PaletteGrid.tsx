import React, { useState } from 'react';
import type { GeneratedPalette, ColorRole } from '../../types';
import { ColorPicker } from '../ui/ColorPicker';

interface PaletteGridProps {
    palette: GeneratedPalette;
    onColorChange?: (role: ColorRole, scale: number, newColor: string) => void;
}

const SCALES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const ROLES: ColorRole[] = ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error'];

export const PaletteGrid: React.FC<PaletteGridProps> = ({ palette, onColorChange }) => {
    const [activeCell, setActiveCell] = useState<{ role: ColorRole; scale: number; color: string; x: number; y: number } | null>(null);

    const handleCellClick = (role: ColorRole, scale: number, color: string, event: React.MouseEvent) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setActiveCell({
            role,
            scale,
            color,
            x: rect.left,
            y: rect.bottom
        });
    };

    const handleColorUpdate = (newColor: string) => {
        if (activeCell && onColorChange) {
            // Update local state for immediate feedback in picker
            setActiveCell({ ...activeCell, color: newColor });
            // Propagate change
            onColorChange(activeCell.role, activeCell.scale, newColor);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden relative">
            <div className="p-6 border-b border-zinc-200">
                <h3 className="text-lg font-semibold text-zinc-900">生成されたパレット (Generated Palette)</h3>
            </div>
            <div className="p-6 overflow-x-auto">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-[100px_repeat(10,1fr)] gap-4 mb-4">
                        <div className="font-medium text-zinc-400 text-sm">Role / Scale</div>
                        {SCALES.map((scale) => (
                            <div key={scale} className="text-center font-medium text-zinc-500 text-sm">
                                {scale}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {ROLES.map((role) => (
                            <div key={role} className="grid grid-cols-[100px_repeat(10,1fr)] gap-4 items-center">
                                <div className="capitalize font-medium text-zinc-700 text-sm">{role}</div>
                                {SCALES.map((scale) => {
                                    const color = palette[role][scale];
                                    const key = `${role}-${scale}`;
                                    return (
                                        <div
                                            key={key}
                                            className="group relative aspect-square rounded-xl transition-transform hover:scale-105 hover:shadow-lg cursor-pointer ring-1 ring-black/5"
                                            style={{ backgroundColor: color }}
                                            title={`${role}-${scale}: ${color}`}
                                            onClick={(e) => handleCellClick(role, scale, color, e)}
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <span
                                                    className="text-xs font-mono bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm"
                                                    style={{ color: '#000' }}
                                                >
                                                    {color}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {activeCell && (
                <ColorPicker
                    color={activeCell.color}
                    onChange={handleColorUpdate}
                    onClose={() => setActiveCell(null)}
                    position={{ x: activeCell.x, y: activeCell.y }}
                />
            )}
        </div>
    );
};
