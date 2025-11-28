import React from 'react';
import type { GeneratedPalette } from '../../types';
import { Bell, Search, User, BarChart3, PieChart, Settings, Home } from 'lucide-react';

interface PreviewUIProps {
    palette: GeneratedPalette;
}

export const PreviewUI: React.FC<PreviewUIProps> = ({ palette }) => {
    // We apply styles dynamically using the palette colors
    // In a real app, these would be CSS variables, but inline styles work for this preview.

    const styles = {
        bg: palette.neutral[50],
        surface: palette.neutral[100],
        border: palette.neutral[300],
        textMain: palette.neutral[900],
        textMuted: palette.neutral[500],
        primary: palette.primary[500],
        primaryFg: '#ffffff', // Assuming primary 500 is dark enough, or calculate
        secondary: palette.secondary[500],
        accent: palette.accent[500],
        success: palette.success[500],
        warning: palette.warning[500],
        error: palette.error[500],
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
            <div className="p-6 border-b border-zinc-200">
                <h3 className="text-lg font-semibold text-zinc-900">UIプレビュー (Preview)</h3>
            </div>

            <div className="p-8 bg-zinc-50 overflow-hidden">
                {/* Mock Window */}
                <div
                    className="rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] w-full max-w-5xl mx-auto border"
                    style={{ backgroundColor: styles.bg, borderColor: styles.border }}
                >
                    {/* Sidebar */}
                    <div
                        className="w-64 flex-shrink-0 border-r flex flex-col"
                        style={{ backgroundColor: styles.surface, borderColor: styles.border }}
                    >
                        <div className="p-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: styles.primary }}>
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg" style={{ color: styles.textMain }}>Dashboard</span>
                        </div>

                        <nav className="flex-1 px-4 space-y-1">
                            {[
                                { icon: Home, label: 'ホーム', active: true },
                                { icon: PieChart, label: 'アナリティクス', active: false },
                                { icon: User, label: '顧客管理', active: false },
                                { icon: Settings, label: '設定', active: false },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors`}
                                    style={{
                                        backgroundColor: item.active ? palette.primary[50] : 'transparent',
                                        color: item.active ? styles.primary : styles.textMuted
                                    }}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </div>
                            ))}
                        </nav>

                        <div className="p-4 border-t" style={{ borderColor: styles.border }}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-300"></div>
                                <div>
                                    <div className="text-sm font-medium" style={{ color: styles.textMain }}>山田 太郎</div>
                                    <div className="text-xs" style={{ color: styles.textMuted }}>管理者</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Header */}
                        <header
                            className="h-16 border-b flex items-center justify-between px-6"
                            style={{ backgroundColor: styles.surface, borderColor: styles.border }}
                        >
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: styles.textMuted }} />
                                <input
                                    type="text"
                                    placeholder="検索..."
                                    className="w-full pl-8 pr-4 py-1.5 rounded-md text-sm border focus:outline-none focus:ring-2"
                                    style={{
                                        backgroundColor: styles.bg,
                                        borderColor: styles.border,
                                        color: styles.textMain,
                                        // Note: focus ring color would need dynamic style injection or inline style handling
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="relative p-2 rounded-full hover:bg-black/5">
                                    <Bell className="w-5 h-5" style={{ color: styles.textMuted }} />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: styles.error }}></span>
                                </button>
                            </div>
                        </header>

                        {/* Content Body */}
                        <main className="flex-1 p-6 overflow-y-auto" style={{ backgroundColor: styles.bg }}>
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-bold" style={{ color: styles.textMain }}>概要</h1>
                                <button
                                    className="px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-opacity hover:opacity-90"
                                    style={{ backgroundColor: styles.primary, color: styles.primaryFg }}
                                >
                                    レポート出力
                                </button>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {[
                                    { label: '総売上', value: '¥4,523,189', change: '+20.1%', trend: 'up' },
                                    { label: '新規登録', value: '+2,350', change: '+180.1%', trend: 'up' },
                                    { label: 'アクティブ', value: '+573', change: '+201', trend: 'up' },
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        className="p-6 rounded-xl border shadow-sm"
                                        style={{ backgroundColor: styles.surface, borderColor: styles.border }}
                                    >
                                        <div className="text-sm font-medium mb-2" style={{ color: styles.textMuted }}>{stat.label}</div>
                                        <div className="text-2xl font-bold mb-1" style={{ color: styles.textMain }}>{stat.value}</div>
                                        <div className="text-xs" style={{ color: styles.success }}>{stat.change} 先月比</div>
                                    </div>
                                ))}
                            </div>

                            {/* Content Area */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div
                                    className="p-6 rounded-xl border shadow-sm h-64"
                                    style={{ backgroundColor: styles.surface, borderColor: styles.border }}
                                >
                                    <h3 className="text-base font-semibold mb-4" style={{ color: styles.textMain }}>最近のアクティビティ</h3>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? styles.success : i === 1 ? styles.warning : styles.secondary }}></div>
                                                <div className="flex-1 h-2 rounded bg-zinc-100" style={{ backgroundColor: palette.neutral[100] }}>
                                                    <div className="h-full rounded" style={{ width: `${60 - i * 10}%`, backgroundColor: palette.neutral[400] }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div
                                    className="p-6 rounded-xl border shadow-sm h-64"
                                    style={{ backgroundColor: styles.surface, borderColor: styles.border }}
                                >
                                    <h3 className="text-base font-semibold mb-4" style={{ color: styles.textMain }}>システムステータス</h3>
                                    <div className="space-y-3">
                                        <div className="p-3 rounded-lg border flex items-center justify-between" style={{ borderColor: palette.success[300], backgroundColor: palette.success[50] }}>
                                            <span className="text-sm font-medium" style={{ color: palette.success[900] }}>全システム正常稼働中</span>
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.success[500] }}></span>
                                        </div>
                                        <div className="p-3 rounded-lg border flex items-center justify-between" style={{ borderColor: palette.warning[300], backgroundColor: palette.warning[50] }}>
                                            <span className="text-sm font-medium" style={{ color: palette.warning[900] }}>メンテナンス予定あり</span>
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.warning[500] }}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};
