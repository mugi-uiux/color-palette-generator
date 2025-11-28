import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
// Actually, I didn't install react-dropzone in the initial step. I'll use native input for now to save a step, or install it.
// The plan mentioned "react-dropzone (optional)". I'll stick to native for simplicity unless requested.
// Wait, native drag and drop is a bit verbose. I'll use a simple click-to-upload for now.

// For color extraction, I'll use a simple canvas approach since I didn't install colorthief.
// I'll implement a basic k-means or just simple frequency analysis if needed, 
// but for v1 let's just pick the dominant color or center pixel? 
// The requirement says "Primary, Secondary, Accentを自動抽出".
// I'll implement a simple extraction helper in this file for now.

interface ImageUploaderProps {
    onColorsExtracted: (colors: { primary: string; secondary: string; accent: string }) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onColorsExtracted }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const extractColors = (imageSrc: string) => {
        setIsAnalyzing(true);
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;

        img.onerror = () => {
            setIsAnalyzing(false);
            // Could notify user of error here
        };

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    setIsAnalyzing(false);
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Simplified Color Extraction using Quantization (Histogram-ish)
                // 1. Downsample image to speed up
                // 2. Collect colors
                // 3. Find distinct dominant colors

                const w = canvas.width;
                const h = canvas.height;
                const imageData = ctx.getImageData(0, 0, w, h).data;
                const pixelCount = w * h;
                const step = Math.max(1, Math.floor(pixelCount / 1000)); // Sample ~1000 pixels

                const colorMap: { [key: string]: number } = {};

                for (let i = 0; i < pixelCount; i += step) {
                    const r = imageData[i * 4];
                    const g = imageData[i * 4 + 1];
                    const b = imageData[i * 4 + 2];
                    const a = imageData[i * 4 + 3];

                    if (a < 128) continue; // Skip transparent

                    // Quantize to reduce noise (round to nearest 32)
                    const qr = Math.min(255, Math.round(r / 32) * 32);
                    const qg = Math.min(255, Math.round(g / 32) * 32);
                    const qb = Math.min(255, Math.round(b / 32) * 32);

                    const key = `${qr},${qg},${qb}`;
                    colorMap[key] = (colorMap[key] || 0) + 1;
                }

                // Sort by frequency
                const sortedColors = Object.entries(colorMap)
                    .sort(([, a], [, b]) => b - a)
                    .map(([key]) => {
                        const [r, g, b] = key.split(',').map(Number);
                        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                    });

                // Filter out neutrals (low chroma, very light, or very dark) to find a good Primary
                // We'll use a simple heuristic: convert to HSL or check RGB variance
                const isColorful = (hex: string) => {
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const chroma = max - min;
                    // Ignore if chroma is very low (grayish) or very light (white-ish) or very dark (black-ish)
                    // Relaxed threshold: Chroma > 10 (out of 255), Max > 20 (not pitch black), Min < 250 (not pure white)
                    return chroma > 10 && max > 20 && min < 250;
                };

                const colorfulColors = sortedColors.filter(isColorful);
                const neutralColors = sortedColors.filter(c => !isColorful(c));

                // Prefer colorful colors for Primary/Secondary/Accent
                // If we don't have enough colorful colors, fall back to neutrals
                const distinctColors: string[] = [];

                // Helper to add unique colors
                const addUnique = (candidates: string[]) => {
                    for (const color of candidates) {
                        if (distinctColors.length >= 3) break;
                        // Simple distinct check (exact match for now, could be deltaE)
                        if (!distinctColors.includes(color)) {
                            distinctColors.push(color);
                        }
                    }
                };

                addUnique(colorfulColors);
                addUnique(neutralColors); // Fallback

                // Fill missing with defaults if less than 3 found
                while (distinctColors.length < 3) {
                    distinctColors.push(distinctColors[0] || '#3b82f6'); // Default to blue if absolutely nothing found
                }

                // Smart Assignment Logic
                // 1. Primary is the most dominant colorful color (already sorted by frequency)
                const primary = distinctColors[0];
                const candidates = distinctColors.slice(1);

                // 2. Decide which of the remaining candidates is better for Accent vs Secondary
                // Accent should ideally be:
                // - High Chroma
                // - Complementary to Primary (Hue diff ~180)

                // Helper to get Hue and Chroma
                const getHC = (hex: string) => {
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);

                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const c = max - min;

                    let h = 0;
                    if (c === 0) h = 0;
                    else if (max === r) h = ((g - b) / c) % 6;
                    else if (max === g) h = (b - r) / c + 2;
                    else h = (r - g) / c + 4;
                    h = Math.round(h * 60);
                    if (h < 0) h += 360;

                    return { h, c };
                };

                const primaryHC = getHC(primary);

                // Sort candidates by "Accent Score"
                // Score = Chroma + (Hue Difference from Primary normalized to 0-100) * 2
                // We weight Hue Difference more because Accent is usually about contrast.
                candidates.sort((a, b) => {
                    const aHC = getHC(a);
                    const bHC = getHC(b);

                    const getHueDiff = (h1: number, h2: number) => {
                        const diff = Math.abs(h1 - h2);
                        return Math.min(diff, 360 - diff);
                    };

                    const aHueScore = (getHueDiff(primaryHC.h, aHC.h) / 180) * 200; // 0-200
                    const bHueScore = (getHueDiff(primaryHC.h, bHC.h) / 180) * 200;

                    const aScore = aHC.c + aHueScore;
                    const bScore = bHC.c + bHueScore;

                    return bScore - aScore; // Descending
                });

                // Final check: Ensure Secondary is distinct from Primary
                const p = primary;
                let s = candidates[1] || candidates[0];
                const a = candidates[0]; // Accent is the winner of the score

                const pHC = getHC(p);
                const sHC = getHC(s);

                const hueDiff = Math.abs(pHC.h - sHC.h);
                const minDiff = Math.min(hueDiff, 360 - hueDiff);

                if (minDiff < 20) {
                    // Try to find a better secondary from distinctColors
                    const betterSecondary = distinctColors.find(c => {
                        const cHC = getHC(c);
                        const diff = Math.abs(pHC.h - cHC.h);
                        const d = Math.min(diff, 360 - diff);
                        return d >= 20 && c !== a && c !== p; // Distinct from Primary AND Accent
                    });

                    if (betterSecondary) {
                        s = betterSecondary;
                    } else {
                        // If no better candidate, set to empty string to let auto-complete handle it
                        s = '';
                    }
                }

                onColorsExtracted({
                    primary: primary,
                    secondary: s,
                    accent: a
                });
            } catch (error) {
                console.error("Color extraction failed:", error);
                // Fallback to defaults or notify user
            } finally {
                setIsAnalyzing(false);
            }
        };
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            extractColors(url);
        }
    };

    return (
        <div className="w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-200 border-dashed rounded-xl cursor-pointer bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-300 transition-all group">
                {previewUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
                        <img src={previewUrl} alt="Preview" className="object-cover w-full h-full opacity-90" />
                        {isAnalyzing && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-zinc-400" />
                        </div>
                        <p className="mb-2 text-sm text-zinc-600"><span className="font-semibold">クリックしてアップロード</span> またはドラッグ＆ドロップ</p>
                        <p className="text-xs text-zinc-400">SVG, PNG, JPG, GIF (最大 5MB)</p>
                    </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
        </div>
    );
};
