import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        viteSingleFile(),
        viteStaticCopy({
            targets: [
                {
                    src: 'figma-plugin/ui.html',
                    dest: '.'
                },
                {
                    src: 'figma-plugin/manifest.json',
                    dest: '.',
                    transform: (content) => {
                        const manifest = JSON.parse(content);
                        manifest.main = "code.js";
                        return JSON.stringify(manifest, null, 2);
                    }
                }
            ]
        })
    ],
    build: {
        target: 'esnext',
        assetsInlineLimit: 100000000,
        chunkSizeWarningLimit: 100000000,
        cssCodeSplit: false,
        lib: {
            entry: path.resolve(__dirname, 'code.ts'),
            name: 'code',
            fileName: 'code',
            formats: ['es']
        },
        rollupOptions: {
            output: {
                inlineDynamicImports: false,
            },
        },
        outDir: './figma-plugin/dist',
        emptyOutDir: true,
    },
});
