import { useState } from "react";
import { Search, Edit2, Save, X, RotateCw, Maximize2, ZoomIn, ZoomOut, MousePointer, Keyboard } from "lucide-react";
import Button from "../../components/ui/button/Button";

interface Hotkey {
    id: string;
    category: 'form' | 'pdf' | 'navigation';
    action: string;
    description: string;
    key: string;
    modifiers: string[];
    type: 'keyboard' | 'mouse';
    isCustomizable: boolean;
    icon?: React.ReactNode;
}

const DEFAULT_HOTKEYS: Hotkey[] = [
    // Form Navigation Hotkeys - Dynamic Chapter/Tab System
    {
        id: 'nav-sidebar-toggle',
        category: 'navigation',
        action: 'toggle_sidebar',
        description: 'Sidebar-ı aç/bağla',
        key: 'Enter',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Edit2 className="w-4 h-4" />
    },
    {
        id: 'nav-sidebar-close',
        category: 'navigation',
        action: 'close_sidebar',
        description: 'Sidebar-ı bağla',
        key: 'Escape',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <X className="w-4 h-4" />
    },

    // Chapter Navigation
    {
        id: 'nav-chapter1',
        category: 'navigation',
        action: 'goto_chapter1',
        description: '1-ci fəsilə keç',
        key: '1',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Keyboard className="w-4 h-4" />
    },
    {
        id: 'nav-chapter2',
        category: 'navigation',
        action: 'goto_chapter2',
        description: '2-ci fəsilə keç',
        key: '2',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Keyboard className="w-4 h-4" />
    },
    {
        id: 'nav-chapter3',
        category: 'navigation',
        action: 'goto_chapter3',
        description: '3-cü fəsilə keç',
        key: '3',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Keyboard className="w-4 h-4" />
    },

    // Chapter 1 Tab Combinations
    {
        id: 'nav-tab-1q',
        category: 'navigation',
        action: 'goto_tab_1q',
        description: '1-ci fəsil, 1-ci tab (Əsas səhifə)',
        key: '1+Q',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Keyboard className="w-4 h-4" />
    },
    {
        id: 'nav-tab-1w',
        category: 'navigation',
        action: 'goto_tab_1w',
        description: '1-ci fəsil, 2-ci tab (Sənədlər-əsaslar)',
        key: '1+W',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Keyboard className="w-4 h-4" />
    },
    {
        id: 'nav-tab-1e',
        category: 'navigation',
        action: 'goto_tab_1e',
        description: '1-ci fəsil, 3-cü tab (Məhdudiyyətlər)',
        key: '1+E',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Keyboard className="w-4 h-4" />
    },
    {
        id: 'nav-tab-1r',
        category: 'navigation',
        action: 'goto_tab_1r',
        description: '1-ci fəsil, 4-cü tab (Arxiv)',
        key: '1+R',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Keyboard className="w-4 h-4" />
    },
    {
        id: 'nav-tab-1t',
        category: 'navigation',
        action: 'goto_tab_1t',
        description: '1-ci fəsil, 5-ci tab (Passport)',
        key: '1+T',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Keyboard className="w-4 h-4" />
    },

    // Chapter 2 Tab Combinations
    {
        id: 'nav-tab-2q',
        category: 'navigation',
        action: 'goto_tab_2q',
        description: '2-ci fəsil, 1-ci tab (Verilmiş sənədlər)',
        key: '2+Q',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Keyboard className="w-4 h-4" />
    },
    {
        id: 'nav-tab-2w',
        category: 'navigation',
        action: 'goto_tab_2w',
        description: '2-ci fəsil, 2-ci tab (Hüquqlar)',
        key: '2+W',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Keyboard className="w-4 h-4" />
    },
    {
        id: 'nav-tab-2e',
        category: 'navigation',
        action: 'goto_tab_2e',
        description: '2-ci fəsil, 3-cü tab (Fiziki şəxslər)',
        key: '2+E',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Keyboard className="w-4 h-4" />
    },
    {
        id: 'nav-tab-2r',
        category: 'navigation',
        action: 'goto_tab_2r',
        description: '2-ci fəsil, 4-cü tab (Hüquqi şəxslər)',
        key: '2+R',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Keyboard className="w-4 h-4" />
    },

    // Chapter 3 Tab Combinations
    {
        id: 'nav-tab-3q',
        category: 'navigation',
        action: 'goto_tab_3q',
        description: '3-cü fəsil, 1-ci tab (Məhdudiyyətlər)',
        key: '3+Q',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Keyboard className="w-4 h-4" />
    },
    {
        id: 'nav-tab-3w',
        category: 'navigation',
        action: 'goto_tab_3w',
        description: '3-cü fəsil, 2-ci tab (Məlumatlar)',
        key: '3+W',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Keyboard className="w-4 h-4" />
    },

    // Form Hotkeys
    {
        id: 'form-double-click',
        category: 'form',
        action: 'toggle_check',
        description: 'Checkbox-ı işarələ/işarəni götür',
        key: 'DoubleClick',
        modifiers: [],
        type: 'mouse',
        isCustomizable: false,
        icon: <MousePointer className="w-4 h-4" />
    },
    {
        id: 'form-right-click',
        category: 'form',
        action: 'context_menu',
        description: 'Edit menyusunu aç',
        key: 'RightClick',
        modifiers: [],
        type: 'mouse',
        isCustomizable: false,
        icon: <Edit2 className="w-4 h-4" />
    },
    {
        id: 'form-enter',
        category: 'form',
        action: 'confirm_edit',
        description: 'Editi təsdiqlə',
        key: 'Enter',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Save className="w-4 h-4" />
    },
    {
        id: 'form-escape',
        category: 'form',
        action: 'cancel_edit',
        description: 'Editdən imtina et',
        key: 'Escape',
        modifiers: [],
        type: 'keyboard',
        isCustomizable: true,
        icon: <X className="w-4 h-4" />
    },

    // PDF Hotkeys
    {
        id: 'pdf-double-left-click',
        category: 'pdf',
        action: 'zoom_in',
        description: 'PDF-i yaxınlaşdır',
        key: 'DoubleClick',
        modifiers: [],
        type: 'mouse',
        isCustomizable: false,
        icon: <ZoomIn className="w-4 h-4" />
    },
    {
        id: 'pdf-double-right-click',
        category: 'pdf',
        action: 'zoom_out',
        description: 'PDF-i uzaqlaşdır',
        key: 'DoubleRightClick',
        modifiers: [],
        type: 'mouse',
        isCustomizable: false,
        icon: <ZoomOut className="w-4 h-4" />
    },
    {
        id: 'pdf-rotate',
        category: 'pdf',
        action: 'rotate_180',
        description: 'PDF-i 180° çevir',
        key: 'R',
        modifiers: ['Ctrl'],
        type: 'keyboard',
        isCustomizable: true,
        icon: <RotateCw className="w-4 h-4" />
    },

    // Other Navigation Hotkeys
    {
        id: 'nav-fullscreen-form',
        category: 'navigation',
        action: 'toggle_fullscreen',
        description: 'Panel tam ekran/normal',
        key: 'F',
        modifiers: ['Ctrl'],
        type: 'keyboard',
        isCustomizable: true,
        icon: <Maximize2 className="w-4 h-4" />
    }
];

const CATEGORY_LABELS = {
    form: 'Form İdarəetmə',
    pdf: 'PDF İdarəetmə',
    navigation: 'Naviqasiya'
};

export default function HotkeyManagementPage() {
    const [hotkeys, setHotkeys] = useState<Hotkey[]>(DEFAULT_HOTKEYS);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingHotkey, setEditingHotkey] = useState<Partial<Hotkey>>({});

    // Filter hotkeys based on search and category
    const filteredHotkeys = hotkeys.filter(hotkey => {
        const matchesSearch = hotkey.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotkey.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotkey.key.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = activeCategory === 'all' || hotkey.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    // Group hotkeys by category
    const groupedHotkeys = filteredHotkeys.reduce((acc, hotkey) => {
        if (!acc[hotkey.category]) {
            acc[hotkey.category] = [];
        }
        acc[hotkey.category].push(hotkey);
        return acc;
    }, {} as Record<string, Hotkey[]>);

    const formatHotkey = (hotkey: Hotkey) => {
        if (hotkey.type === 'mouse') {
            return hotkey.key;
        }

        // Handle combination keys like "1+Q"
        if (hotkey.key.includes('+')) {
            return hotkey.key;
        }

        const parts = [];
        if (hotkey.modifiers.includes('Ctrl')) parts.push('Ctrl');
        if (hotkey.modifiers.includes('Shift')) parts.push('Shift');
        if (hotkey.modifiers.includes('Alt')) parts.push('Alt');
        parts.push(hotkey.key);

        return parts.join(' + ');
    };

    const startEditing = (hotkey: Hotkey) => {
        if (!hotkey.isCustomizable) return;
        setEditingId(hotkey.id);
        setEditingHotkey({ ...hotkey });
    };

    const saveEdit = () => {
        if (!editingId || !editingHotkey.key) return;

        setHotkeys(prev => prev.map(h =>
            h.id === editingId
                ? { ...h, ...editingHotkey } as Hotkey
                : h
        ));

        setEditingId(null);
        setEditingHotkey({});
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingHotkey({});
    };

    const resetToDefaults = () => {
        setHotkeys(DEFAULT_HOTKEYS);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Qısayol İdarəetmə
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Sistem qısayol düymələrini görüntülə və redaktə et
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Naviqasiya</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {hotkeys.filter(h => h.category === 'navigation').length}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <Keyboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Form</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {hotkeys.filter(h => h.category === 'form').length}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                <Edit2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">PDF</p>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {hotkeys.filter(h => h.category === 'pdf').length}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                <ZoomIn className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Hotkey axtar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                activeCategory === 'all'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            Hamısı
                        </button>
                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setActiveCategory(key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeCategory === key
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="mb-6 flex justify-between items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {filteredHotkeys.length} hotkey tapıldı
                    </div>
                    <Button
                        onClick={resetToDefaults}
                        variant="outline"
                        size="sm"
                    >
                        Standart qiymətlərə sıfırla
                    </Button>
                </div>

                {/* Hotkey List */}
                <div className="space-y-6">
                    {Object.entries(groupedHotkeys).map(([category, categoryHotkeys]) => (
                        <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {categoryHotkeys.map((hotkey) => (
                                    <div
                                        key={hotkey.id}
                                        className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                {hotkey.icon}
                                            </div>

                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {hotkey.description}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {hotkey.action}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {editingId === hotkey.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={editingHotkey.key || ''}
                                                        onChange={(e) => setEditingHotkey(prev => ({ ...prev, key: e.target.value }))}
                                                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                                                        placeholder="Key"
                                                    />
                                                    <button
                                                        onClick={saveEdit}
                                                        className="p-1 text-green-600 hover:text-green-700"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="p-1 text-gray-500 hover:text-gray-600"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        {hotkey.type === 'keyboard' && <Keyboard className="w-4 h-4 text-gray-400" />}
                                                        {hotkey.type === 'mouse' && <MousePointer className="w-4 h-4 text-gray-400" />}
                                                        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                                                            {formatHotkey(hotkey)}
                                                        </code>
                                                    </div>

                                                    {hotkey.isCustomizable && (
                                                        <button
                                                            onClick={() => startEditing(hotkey)}
                                                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                            title="Redaktə et"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Help Section */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Qeyd və İstifadə
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• <strong>Fəsil Navigation:</strong> 1, 2, 3 düymələri ilə fəsillər arası keçid</li>
                        <li>• <strong>Tab Combination:</strong> 1+Q, 1+W, 2+Q kimi kombinasiyalar ilə direct tab keçidi</li>
                        <li>• <strong>Dynamic System:</strong> Fəsil və tab sayları artıqca avtomatik genişlənir</li>
                        <li>• <strong>Mouse Actions:</strong> Sistem tərəfindən təyin edilir və dəyişdirilə bilməz</li>
                        <li>• <strong>Keyboard Shortcuts:</strong> Ctrl/Cmd, Shift, Alt kombinasiyaları dəstəklənir</li>
                        <li>• <strong>Auto-save:</strong> Bütün dəyişikliklər avtomatik saxlanılır</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}