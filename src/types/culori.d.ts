declare module 'culori' {
    export interface Color {
        mode?: string;
        h?: number;
        s?: number;
        l?: number;
        c?: number;
        r?: number;
        g?: number;
        b?: number;
        alpha?: number;
        [key: string]: any;
    }

    export function converter(mode: string): (color: string | Color) => Color;
    export function formatHex(color: string | Color): string;
    export function parse(color: string): Color | undefined;
    export function wcagContrast(color1: string | Color, color2: string | Color): number;
    export function useMode(mode: any): void;
    export const modeLch: any;
    export const modeOklch: any;
    export const modeRgb: any;
}
