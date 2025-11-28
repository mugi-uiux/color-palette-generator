import { modeLch, useMode, formatHex } from 'culori';

import { hexToLch } from './color-conversion';

useMode(modeLch);

// Logic based on requirements:
// Primary only:
//   Secondary: Analogous (20-60 deg shift)
//   Accent: Complementary (180 deg shift) or High Chroma
// Secondary only:
//   Primary: Analogous (reverse shift)
//   Accent: Complementary of Primary
// Primary + Accent:
//   Secondary: Intermediate or Analogous to Primary

export const generateMissingColors = (
    primary?: string,
    secondary?: string,
    accent?: string
): { primary: string; secondary: string; accent: string } => {
    // Default fallback if nothing provided
    let p = primary;
    let s = secondary;
    let a = accent;

    if (!p && !s && !a) {
        p = '#3b82f6'; // Default Blue
    }

    // Helper to ensure minimum chroma
    const ensureChroma = (lch: { l?: number; c?: number; h?: number }, minC: number) => {
        return { ...lch, c: Math.max(lch.c || 0, minC) };
    };

    // Case 1: Only Primary provided (or defaulted)
    if (p && !s && !a) {
        const pLch = hexToLch(p)!;

        // Secondary: Shift Hue by +20 degrees (Analogous)
        // Ensure some chroma so it's not gray
        // If hue is undefined (gray), default to Blue (250)
        const baseH = pLch.h ?? 250;
        const sLch = ensureChroma({ ...pLch, h: baseH + 20 }, 30);
        s = formatHex(sLch);

        // Accent: Shift Hue by +180 degrees (Complementary) and boost Chroma
        const aLch = ensureChroma({ ...pLch, h: baseH + 180, c: Math.min((pLch.c || 0) * 1.5, 130) }, 40);
        a = formatHex(aLch);
    }

    // Case 2: Only Secondary provided
    else if (!p && s && !a) {
        const sLch = hexToLch(s)!;

        // Primary: Shift Hue by -20 degrees (Reverse Analogous)
        const pLch = ensureChroma({ ...sLch, h: (sLch.h || 0) - 20 }, 30);
        p = formatHex(pLch);

        // Accent: Complementary of new Primary
        const aLch = ensureChroma({ ...pLch, h: (pLch.h || 0) + 180, c: Math.min((pLch.c || 0) * 1.5, 130) }, 40);
        a = formatHex(aLch);
    }

    // Case 3: Primary and Accent provided, missing Secondary
    else if (p && !s && a) {
        const pLch = hexToLch(p)!;
        // Secondary: Shift Hue by +20 degrees (Analogous to Primary)
        const sLch = ensureChroma({ ...pLch, h: (pLch.h || 0) + 20 }, 30);
        s = formatHex(sLch);
    }

    // Case 4: Primary and Secondary provided, missing Accent
    else if (p && s && !a) {
        const pLch = hexToLch(p)!;
        // Accent: Complementary of Primary
        const aLch = ensureChroma({ ...pLch, h: (pLch.h || 0) + 180, c: Math.min((pLch.c || 0) * 1.5, 130) }, 40);
        a = formatHex(aLch);
    }

    // Case 5: Secondary and Accent provided, missing Primary
    else if (!p && s && a) {
        const sLch = hexToLch(s)!;
        // Primary: Shift Hue by -20 degrees from Secondary
        const pLch = ensureChroma({ ...sLch, h: (sLch.h || 0) - 20 }, 30);
        p = formatHex(pLch);
    }

    return {
        primary: p!,
        secondary: s!,
        accent: a!
    };
};
