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

    // Navigation Hotkeys
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
    form: '📋 Form İdarəetmə',
    pdf: '📄 PDF İdarəetmə',
    navigation: '🚀 Naviqasiya'
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
                        Sistem Qısayol Düymələrini görüntülə və redaktə et
                    </p>
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
                                        className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
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
                        Qeyd
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Keyboard qısayollar Ctrl/Cmd, Shift, Alt kombinasiyaları istifadə edə bilər</li>
                        <li>• Mouse qısayollar sistem tərəfindən təyin edilir və dəyişdirilə bilməz</li>
                        <li>• Bəzi qısayollar sistem təhlükəsizliyi üçün redaktə edilə bilməz</li>
                        <li>• Dəyişikliklər avtomatik yadda saxlanılır</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}