import { formatHex, modeLch, useMode } from 'culori';
import type { Color } from 'culori';
import { hexToLch } from './color-conversion';
import type { GeneratedPalette } from '../../types';

useMode(modeLch);

// Target lightness values for each scale step (LCH Lightness 0-100)
// 50 (Background): 99%
// 100 (Surface): 97%
// 200 (Surface Alt): 94%
// 300 (Border/Disabled): 88%
// 400 (Border Strong): 80%
// 500 (Standard/Main): 65%
// 600 (Main Strong): 50%
// 700 (Emphasis/Hover): 35%
// 800 (Text): 20%
// 900 (Heading): 10%

export const generateScale = (baseColor: string): GeneratedPalette['primary'] => {
    const lch = hexToLch(baseColor);
    if (!lch) {
        // Fallback to black scale if invalid
        return {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
        };
    }

    const createStep = (targetL: number, chromaFactor: number = 1) => {
        return formatHex({
            mode: 'lch',
            l: targetL,
            c: (lch.c || 0) * chromaFactor,
            h: lch.h
        });
    };

    return {
        50: createStep(99, 0.2),
        100: createStep(97, 0.5), // Increased slightly from 0.4 for smoother ramp
        200: createStep(94, 0.8), // Reduced from 1.0 to bridge the gap to 100
        300: createStep(88),
        400: createStep(80),
        500: createStep(65),
        600: createStep(50),
        700: createStep(35),
        800: createStep(20),
        900: createStep(10),
    };
};

export const generateNeutralScale = (baseColor: string): GeneratedPalette['neutral'] => {
    const lch = hexToLch(baseColor);
    if (!lch) return generateScale('#808080');

    // For neutrals, we increase chroma slightly to reflect the primary hue more
    // User requested "lower saturation" again, so reducing from 0.2/12 to 0.15/6
    const neutralLch = { ...lch, c: Math.min((lch.c || 0) * 0.15, 6) };

    const createStep = (targetL: number, chromaFactor: number = 1) => {
        return formatHex({
            mode: 'lch',
            l: targetL,
            c: neutralLch.c * chromaFactor,
            h: neutralLch.h
        });
    };

    return {
        50: createStep(99, 0.5),  // Reduced saturation for background
        100: createStep(97, 0.8), // Reduced saturation for surface
        200: createStep(94),
        300: createStep(88),
        400: createStep(80),
        500: createStep(65),
        600: createStep(50),
        700: createStep(35),
        800: createStep(20),
        900: createStep(10),
    };
};
