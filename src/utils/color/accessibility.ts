import { wcagContrast, modeLch, useMode, formatHex } from 'culori';

import { hexToLch } from './color-conversion';

useMode(modeLch);

export const MIN_CONTRAST_RATIO = 4.5; // WCAG 2.1 AA for normal text

export const checkContrast = (bgColor: string, textColor: string): number => {
    return wcagContrast(bgColor, textColor);
};

export const isAccessible = (bgColor: string, textColor: string): boolean => {
    return checkContrast(bgColor, textColor) >= MIN_CONTRAST_RATIO;
};

// Adjusts the foreground color lightness to meet the target contrast against the background
export const autoFixColor = (bgColor: string, fgColor: string): string => {
    if (isAccessible(bgColor, fgColor)) return fgColor;

    const bgLch = hexToLch(bgColor);
    const fgLch = hexToLch(fgColor);

    if (!bgLch || !fgLch || bgLch.l === undefined || fgLch.l === undefined) return fgColor;

    // Simple iterative approach: move lightness away from background
    // If bg is light, make fg darker. If bg is dark, make fg lighter.

    let currentFg = { ...fgLch };
    const direction = bgLch.l > 50 ? -1 : 1; // Darken if bg is light, Lighten if bg is dark
    const step = 2;

    for (let i = 0; i < 50; i++) { // Max 50 iterations to prevent infinite loop
        if (currentFg.l === undefined) currentFg.l = 50; // Fallback
        currentFg.l += direction * step;

        // Clamp lightness
        if (currentFg.l < 0) currentFg.l = 0;
        if (currentFg.l > 100) currentFg.l = 100;

        const currentHex = formatHex(currentFg);
        if (checkContrast(bgColor, currentHex) >= MIN_CONTRAST_RATIO) {
            return currentHex;
        }

        if (currentFg.l === 0 || currentFg.l === 100) break;
    }

    // If we can't satisfy with same hue/chroma, fallback to black or white
    const whiteContrast = checkContrast(bgColor, '#ffffff');
    const blackContrast = checkContrast(bgColor, '#000000');

    return whiteContrast > blackContrast ? '#ffffff' : '#000000';
};
