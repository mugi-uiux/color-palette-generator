import React, { useState, useEffect, useRef } from 'react';
import { formatHex, converter } from 'culori';

const rgbToHsv = converter('hsv');

interface ColorPickerProps {
    color: string;
    onChange: (newColor: string) => void;
    onClose: () => void;
    position: { x: number; y: number };
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, onClose, position }) => {
    const [hsv, setHsv] = useState({ h: 0, s: 0, v: 0 });
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const c = rgbToHsv(color);
        if (c) {
            setHsv({
                h: c.h || 0,
                s: c.s || 0,
                v: c.v || 0
            });
        }
    }, [color]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleChange = (key: 'h' | 's' | 'v', value: number) => {
        const newHsv = { ...hsv, [key]: value };
        setHsv(newHsv);

        const hex = formatHex({ mode: 'hsv', ...newHsv });
        if (hex) {
            onChange(hex);
        }
    };

    // Calculate position to keep in viewport
    const style: React.CSSProperties = {
        position: 'fixed',
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.min(position.y + 10, window.innerHeight - 350),
        zIndex: 50
    };

    return (
        <div
            ref={pickerRef}
            style={style}
            className="bg-white rounded-xl shadow-2xl border border-zinc-200 p-4 w-72 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-100"
        >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <h4 className="font-semibold text-zinc-900">Color Editor</h4>
                <div className="w-6 h-6 rounded-full border border-zinc-200" style={{ backgroundColor: color }} />
            </div>

            <div className="space-y-4">
                {/* Hue */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>Hue</span>
                        <span>{Math.round(hsv.h)}°</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={hsv.h}
                        onChange={(e) => handleChange('h', Number(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
                        }}
                    />
                </div>

                {/* Saturation */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>Saturation</span>
                        <span>{Math.round(hsv.s * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={hsv.s * 100}
                        onChange={(e) => handleChange('s', Number(e.target.value) / 100)}
                        className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                    />
                </div>

                {/* Brightness */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>Brightness</span>
                        <span>{Math.round(hsv.v * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={hsv.v * 100}
                        onChange={(e) => handleChange('v', Number(e.target.value) / 100)}
                        className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                    />
                </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 text-xs text-zinc-400 text-center">
                Click outside to close
            </div>
        </div>
    );
};
