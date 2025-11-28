export type ColorRole = 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error';

export type ColorPalette = {
    [key in ColorRole]: string;
};

export type GeneratedPalette = {
    [key in ColorRole]: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };
};

export type InputMode = 'image' | 'manual';
