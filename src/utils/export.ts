import type { GeneratedPalette, ColorRole } from '../types';
import { jsPDF } from 'jspdf';
import { checkContrast } from './color/accessibility';

const ROLES: ColorRole[] = ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error'];
const SCALES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export const generateCSV = (palette: GeneratedPalette): string => {
    let csv = 'Role,Scale,Hex,Contrast (vs White),Contrast (vs Black)\n';

    ROLES.forEach(role => {
        SCALES.forEach(scale => {
            const hex = palette[role][scale];
            const contrastWhite = checkContrast(hex, '#ffffff').toFixed(2);
            const contrastBlack = checkContrast(hex, '#000000').toFixed(2);
            csv += `${role},${scale},${hex},${contrastWhite},${contrastBlack}\n`;
        });
    });

    return csv;
};

export const generateCSS = (palette: GeneratedPalette): string => {
    let css = ':root {\n';

    ROLES.forEach(role => {
        SCALES.forEach(scale => {
            css += `  --color-${role}-${scale}: ${palette[role][scale]};\n`;
        });
    });

    css += '}\n';
    return css;
};

export const generateTailwindConfig = (palette: GeneratedPalette): string => {
    const config = {
        theme: {
            extend: {
                colors: {
                    ...ROLES.reduce((acc, role) => {
                        acc[role] = SCALES.reduce((scaleAcc, scale) => {
                            scaleAcc[scale] = palette[role][scale];
                            return scaleAcc;
                        }, {} as any);
                        return acc;
                    }, {} as any)
                }
            }
        }
    };

    return `module.exports = ${JSON.stringify(config, null, 2)};`;
};

export const generateJSON = (palette: GeneratedPalette): string => {
    return JSON.stringify(palette, null, 2);
};

export const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const generatePDF = (palette: GeneratedPalette) => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(20);
    doc.text('UI Color Palette', 20, y);
    y += 15;

    ROLES.forEach((role) => {
        if (y > 250) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(14);
        doc.text(role.charAt(0).toUpperCase() + role.slice(1), 20, y);
        y += 10;

        SCALES.forEach((scale, index) => {
            const hex = palette[role][scale];
            // Adjusted spacing for 10 columns: 15mm width + 2mm gap
            const x = 20 + (index * 17);

            doc.setFillColor(hex);
            doc.rect(x, y, 15, 15, 'F');

            doc.setFontSize(7);
            doc.text(scale.toString(), x, y + 20);
            doc.text(hex, x, y + 24);
        });

        y += 35;
    });

    doc.save('color-palette.pdf');
};
