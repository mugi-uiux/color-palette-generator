import { formatHex, modeLch, modeRgb, useMode, converter, parse, wcagContrast } from 'culori';
import type { Color } from 'culori';

useMode(modeLch);
useMode(modeRgb);

const toLch = converter('lch');
const toOklch = converter('oklch');

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
