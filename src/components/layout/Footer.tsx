import React from 'react';
import { Github, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-zinc-200 bg-zinc-50 mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-sm text-zinc-500">
                        © 2024 配色ジェネレーター All rights reserved.
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
