import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { InputPanel } from './components/input/InputPanel';
import { PaletteGrid } from './components/palette/PaletteGrid';
import { PreviewUI } from './components/preview/PreviewUI';
import { ExportPanel } from './components/export/ExportPanel';
import { generateScale, generateNeutralScale } from './utils/color/palette-generator';
import type { GeneratedPalette } from './types';
import { autoFixColor } from './utils/color/accessibility';
import { generateMissingColors } from './utils/color/auto-complete';

function App() {
  const [colors, setColors] = useState({
    primary: '',
    secondary: '',
    accent: ''
  });

  const [isAccessibleMode, setIsAccessibleMode] = useState(false);
  const [palette, setPalette] = useState<GeneratedPalette | null>(null);

  useEffect(() => {
    if (colors.primary) {
      // Auto-complete missing colors or ensure they are distinct
      const filledColors = generateMissingColors(colors.primary, colors.secondary, colors.accent);

      const primaryScale = generateScale(filledColors.primary);
      const secondaryScale = generateScale(filledColors.secondary);
      const accentScale = generateScale(filledColors.accent);
      const neutralScale = generateNeutralScale(filledColors.primary);

      // For Success, Warning, Error, we can generate based on standard hues but using the primary's lightness/chroma characteristics or just standard accessible colors.
      // For v1, let's use standard accessible colors as base.
      const successScale = generateScale('#22c55e'); // Green-500
      const warningScale = generateScale('#eab308'); // Yellow-500
      const errorScale = generateScale('#ef4444');   // Red-500

      let newPalette = {
        primary: primaryScale,
        secondary: secondaryScale,
        accent: accentScale,
        neutral: neutralScale,
        success: successScale,
        warning: warningScale,
        error: errorScale
      };

      if (isAccessibleMode) {
        // Apply accessibility fixes
        // Rule 1: Ensure 500 (Main) has 4.5:1 contrast against White (for buttons)
        // Rule 2: Ensure 900 (Heading) has 4.5:1 contrast against 50 (Background)

        (['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error'] as const).forEach(role => {
          // Fix 500 vs White
          newPalette[role][500] = autoFixColor('#ffffff', newPalette[role][500]);

          // Fix 900 vs 50
          newPalette[role][900] = autoFixColor(newPalette[role][50], newPalette[role][900]);

          // Fix 800 vs 100 (Text vs Surface)
          newPalette[role][800] = autoFixColor(newPalette[role][100], newPalette[role][800]);

          // Fix 700 vs 200 (Optional, for softer contrast)
          newPalette[role][700] = autoFixColor(newPalette[role][200], newPalette[role][700]);
        });
      }

      setPalette(newPalette);
    }
  }, [colors, isAccessibleMode]);

  // Decoupling Effect: If secondary/accent are auto-generated (i.e., were empty but now we have a palette),
  // we should "lock" them into state so they don't re-generate automatically when primary changes.
  // However, we must be careful not to cause infinite loops.
  // We only want to do this if the user hasn't explicitly set them (which is tracked by colors state being empty).
  // BUT, if we set them in state, they are no longer empty.
  // So the flow is:
  // 1. User enters Primary. Secondary is empty.
  // 2. useEffect runs, generates Secondary.
  // 3. We see that colors.secondary is empty, but we generated a valid one.
  // 4. We update colors.secondary with the generated one.
  // 5. Next render, colors.secondary is set. useEffect runs again, but now it uses the "locked" secondary.
  // 6. If user changes Primary, colors.secondary is still set, so it won't be re-generated relative to new Primary.
  // This achieves the "not linked" behavior.

  useEffect(() => {
    if (palette && colors.primary) {
      // Check if we need to lock any colors
      let updates: Partial<typeof colors> = {};

      // If state is empty but palette has a value (and it's not the default fallback/empty)
      // Note: palette.secondary[500] is the seed usually.

      // We need to know if the CURRENT state is empty.
      // If it is, we lock it.

      if (!colors.secondary && palette.secondary[500]) {
        // Wait, palette.secondary[500] might be the generated one.
        // We should use the value returned by generateMissingColors, but we don't have it here easily
        // unless we store it or re-derive it.
        // Or we can just take the 500 value from the palette as the "seed".
        // Let's trust the palette's 500 value is a good representation.
        updates.secondary = palette.secondary[500];
      }

      if (!colors.accent && palette.accent[500]) {
        updates.accent = palette.accent[500];
      }

      if (Object.keys(updates).length > 0) {
        // We need to be careful. If we set state, it triggers re-render.
        // If we set it to the value that was just generated, the next generation will use that value.
        // Since the generation logic (auto-complete) uses the input if present,
        // and falls back to generation if not,
        // passing the generated value back in should result in the SAME palette.
        // So this should be stable.
        setColors(prev => ({ ...prev, ...updates }));
      }
    }
  }, [palette, colors.primary, colors.secondary, colors.accent]); // Run when palette updates, and also when colors change to re-evaluate

  const handleColorChange = (role: keyof GeneratedPalette, scale: number, newColor: string) => {
    if (!palette) return;

    import('./utils/color/color-conversion').then(({ hexToLch }) => {
      import('culori').then(({ formatHex }) => {
        const oldColor = palette[role][scale as keyof typeof palette[typeof role]];
        const oldLch = hexToLch(oldColor);
        const newLch = hexToLch(newColor);

        if (oldLch && newLch) {
          const isSeedRole = ['primary', 'secondary', 'accent'].includes(role);
          const isSeedStep = scale === 500;

          // Helper for local update
          const updateLocal = () => {
            setPalette(prev => prev ? ({
              ...prev,
              [role]: {
                ...prev[role],
                [scale]: newColor
              }
            }) : null);
          };

          if (isSeedRole) {
            if (isSeedStep) {
              // Edit on 500 (Seed) -> Always update seed (propagate everything, including saturation/lightness)
              setColors(prev => ({ ...prev, [role]: newColor }));
            } else {
              // Edit on non-500
              // If new color is low chroma (gray), treat as local edit to avoid desaturating the whole scale
              if ((newLch.c || 0) < 5) {
                updateLocal();
              } else {
                // Check Hue Diff
                const hueDiff = Math.abs((oldLch.h || 0) - (newLch.h || 0));
                const diff = Math.min(hueDiff, 360 - hueDiff);

                if (diff > 10) {
                  // Significant Hue change -> Propagate Hue ONLY
                  // We use the current seed's Chroma/Lightness to avoid messing up the scale
                  // based on the properties of a non-500 step (which might be light/desaturated).
                  const currentSeed = colors[role as 'primary' | 'secondary' | 'accent'];
                  const currentSeedLch = hexToLch(currentSeed);

                  if (currentSeedLch) {
                    const newSeed = formatHex({
                      mode: 'lch',
                      l: currentSeedLch.l,
                      c: currentSeedLch.c,
                      h: newLch.h
                    });
                    setColors(prev => ({ ...prev, [role]: newSeed }));
                  } else {
                    updateLocal();
                  }
                } else {
                  // Only Lightness/Chroma change -> Update specific cell
                  updateLocal();
                }
              }
            }
          } else {
            // Non-seed roles (neutral, success, etc.)
            if (scale === 500) {
              // If 500 is changed, we regenerate the scale
              import('./utils/color/palette-generator').then(({ generateScale, generateNeutralScale }) => {
                const generator = role === 'neutral' ? generateNeutralScale : generateScale;
                const newScale = generator(newColor);
                setPalette(prev => prev ? ({
                  ...prev,
                  [role]: newScale
                }) : null);
              });
            } else {
              // Non-500 -> Local update
              updateLocal();
            }
          }
        }
      });
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          {/* Header text removed as per request */}
        </div>

        <InputPanel
          colors={colors}
          onColorsChange={setColors}
          isAccessibleMode={isAccessibleMode}
          onAccessibleModeChange={setIsAccessibleMode}
        />

        {palette ? (
          <div className="space-y-8">
            <PaletteGrid palette={palette} onColorChange={handleColorChange} />
            <PreviewUI palette={palette} />
            <ExportPanel palette={palette} />
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-zinc-200 text-center">
            <div className="text-zinc-400 font-medium">プライマリカラーを入力するか、画像をアップロードしてパレットを生成してください。</div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
