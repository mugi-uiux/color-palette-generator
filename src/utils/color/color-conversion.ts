```typescript
import { formatHex, modeLch, modeRgb, useMode } from 'culori';
import type { Color } from 'culori';

// Define types for our color objects if needed, but culori's Color type is usually sufficient.
// We will primarily work with Hex strings for UI and LCH/OKLCH for calculations.

const toLch = converter('lch');
const toOklch = converter('oklch');
const toRgb = converter('rgb');

export const hexToLch = (hex: string) => {
    const color = parse(hex);
    return color ? toLch(color) : null;
};

export const hexToOklch = (hex: string) => {
    const color = parse(hex);
    return color ? toOklch(color) : null;
};

export const lchToHex = (lch: Color | string) => {
    return formatHex(lch);
};

export const getContrast = (color1: string, color2: string) => {
    return wcagContrast(color1, color2);
};

export const isValidHex = (hex: string): boolean => {
    return !!parse(hex);
};
