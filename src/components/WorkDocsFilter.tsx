import React, { useState, useEffect } from 'react';
import { Search, Calendar, Tag, AlertCircle, X } from "lucide-react";
import {MOCK_COMPLETED_TASKS} from "../mocks/mockDocuments.ts";
import {PRIORITY_LABELS, STATUS_LABELS} from "../types/document.ts";
import Button from "./ui/button/Button.tsx";
import Badge from "./ui/badge/Badge.tsx";
import Select from "./ui/Select.tsx";
import DateRangePicker from "./ui/DateRangePicker.tsx";

interface Filters {
    search: string;
    status: string[];
    category: string[];
    priority: string[];
    dateRange: {
        start?: string;
        end?: string;
    };
}

interface FilterProps {
    filters: Filters;
    onFiltersChange: (newFilters: Filters) => void;
    onClear: () => void;
}

const Filter: React.FC<FilterProps> = ({ filters, onFiltersChange, onClear }) => {
    // Local state for all changes (not applied until search button is clicked)
    const [localFilters, setLocalFilters] = useState<Filters>({
        search: '',
        status: [],
        category: [],
        priority: [],
        dateRange: {}
    });

    // Separate state for search inputs
    const [nameSearch, setNameSearch] = useState('');
    const [documentSearch, setDocumentSearch] = useState('');

    // Sync local state with applied filters when they change externally (like clear)
    useEffect(() => {
        const [name = '', document = ''] = filters.search.split('|');
        setNameSearch(name);
        setDocumentSearch(document);
        setLocalFilters(filters);
    }, [filters]);

    // Get unique categories from mock data
    const uniqueCategories = Array.from(new Set(MOCK_COMPLETED_TASKS.map(task => task.category)));

    // Update local filters
    const updateLocalFilters = (key: keyof Filters, value: Filters[keyof Filters]) => {
        setLocalFilters({
            ...localFilters,
            [key]: value
        });
    };

    // Handle select changes - store in local state
    const handleSelectChange = (key: 'status' | 'category' | 'priority', value: string) => {
        if (value === '') {
            updateLocalFilters(key, []);
        } else {
            updateLocalFilters(key, [value]);
        }
    };

    // Apply all changes when search button is clicked
    const handleSearch = () => {
        const combinedSearch = `${nameSearch}|${documentSearch}`;

        const updatedFilters = {
            ...localFilters,
            search: combinedSearch
        };

        onFiltersChange(updatedFilters);
    };

    // Clear everything
    const handleClearAll = () => {
        setNameSearch('');
        setDocumentSearch('');
        setLocalFilters({
            search: '',
            status: [],
            category: [],
            priority: [],
            dateRange: {}
        });
        onClear();
    };

    // Check if there are any changes that need to be applied
    const hasUnAppliedChanges = (): boolean => {
        // Check search inputs
        const [currentName = '', currentDocument = ''] = filters.search.split('|');
        if (nameSearch !== currentName || documentSearch !== currentDocument) return true;

        // Check select filters
        if (JSON.stringify(localFilters.status) !== JSON.stringify(filters.status)) return true;
        if (JSON.stringify(localFilters.category) !== JSON.stringify(filters.category)) return true;
        if (JSON.stringify(localFilters.priority) !== JSON.stringify(filters.priority)) return true;
        return JSON.stringify(localFilters.dateRange) !== JSON.stringify(filters.dateRange);


    };

    const hasActiveFilters = (): boolean => {
        return filters.search !== '' ||
            filters.status.length > 0 ||
            filters.category.length > 0 ||
            filters.priority.length > 0 ||
            !!filters.dateRange.start ||
            !!filters.dateRange.end;
    };

    // Parse current search for display
    const getCurrentSearchValues = () => {
        if (!filters.search) return { name: '', document: '' };
        const [name = '', document = ''] = filters.search.split('|');
        return { name, document };
    };

    const currentSearch = getCurrentSearchValues();

    // Prepare options for CustomSelect
    const statusOptions = [
        { value: '', label: 'Hamısı' },
        ...Object.entries(STATUS_LABELS || {}).map(([key, label]) => ({
            value: key,
            label: label,
            icon: key === 'approved' ? '✅' : '❌'
        }))
    ];

    const priorityOptions = [
        { value: '', label: 'Hamısı' },
        ...Object.entries(PRIORITY_LABELS || {}).map(([key, label]) => ({
            value: key,
            label: label,
            icon: key === 'high' ? '🔴' : key === 'medium' ? '🟡' : key === 'low' ? '🔘' : '🔘'
        }))
    ];

    const categoryOptions = [
        { value: '', label: 'Hamısı' },
        ...(uniqueCategories || []).map(category => ({
            value: category,
            label: category,
            icon: '📂'
        }))
    ];

    return (
        <div className="space-y-4">
            {/* Search Filter - Two inputs */}
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ad və soyad
                        </label>
                        <input
                            type="text"
                            placeholder="Ad və soyad..."
                            value={nameSearch}
                            onChange={(e) => setNameSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && hasUnAppliedChanges() && handleSearch()}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Sənəd Məlumatı
                        </label>
                        <input
                            type="text"
                            placeholder="Sənəd nömrəsi və ya tipi..."
                            value={documentSearch}
                            onChange={(e) => setDocumentSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && hasUnAppliedChanges() && handleSearch()}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Two Column Layout for Selects */}
            <div className="grid grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <AlertCircle className="w-4 h-4 inline mr-2" />
                        Status
                    </label>
                    <Select
                        options={statusOptions}
                        value={localFilters.status[0] || ''}
                        placeholder="Status seçin"
                        onChange={(value) => handleSelectChange('status', value)}
                    />
                </div>

                {/* Priority Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Tag className="w-4 h-4 inline mr-2" />
                        Prioritet
                    </label>
                    <Select
                        options={priorityOptions}
                        value={localFilters.priority[0] || ''}
                        placeholder="Prioritet seçin"
                        onChange={(value) => handleSelectChange('priority', value)}
                    />
                </div>
            </div>

            {/* Two Column Layout for Category and Date */}
            <div className="grid grid-cols-2 gap-4">
                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Tag className="w-4 h-4 inline mr-2" />
                        Kateqoriya
                    </label>
                    <Select
                        options={categoryOptions}
                        value={localFilters.category[0] || ''}
                        placeholder="Kateqoriya seçin"
                        onChange={(value) => handleSelectChange('category', value)}
                    />
                </div>

                {/* Date Range Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Tarix
                    </label>
                    <DateRangePicker
                        value={localFilters.dateRange}
                        onChange={(range) => updateLocalFilters('dateRange', range)}
                        placeholder="Tarix aralığı seçin"
                    />
                </div>
            </div>

            {/* Active Filters Summary with Search Button */}
            {(hasActiveFilters() || hasUnAppliedChanges()) && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Aktiv filtrlər
                        </span>
                        <div className="flex items-center gap-2">
                            {/* Search Button - shows when there are unapplied changes */}
                            {hasUnAppliedChanges() && (
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-xs font-medium"
                                >
                                    <Search className="w-3 h-3" />
                                    Axtar
                                </button>
                            )}

                            {/* Clear All Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearAll}
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs px-2 py-1"
                            >
                                <X className="w-3 h-3 mr-1" />
                                Hamısını təmizlə
                            </Button>
                        </div>
                    </div>

                    {/* Display active filters */}
                    {hasActiveFilters() && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {currentSearch.name && (
                                <Badge color="info" size="sm">
                                    Ad: "{currentSearch.name}"
                                </Badge>
                            )}
                            {currentSearch.document && (
                                <Badge color="info" size="sm">
                                    Sənəd: "{currentSearch.document}"
                                </Badge>
                            )}
                            {filters.status.length > 0 && (
                                <Badge color="success" size="sm">
                                    {STATUS_LABELS?.[filters.status[0] as keyof typeof STATUS_LABELS] || filters.status[0]}
                                </Badge>
                            )}
                            {filters.priority.length > 0 && (
                                <Badge color="warning" size="sm">
                                    {PRIORITY_LABELS?.[filters.priority[0] as keyof typeof PRIORITY_LABELS] || filters.priority[0]}
                                </Badge>
                            )}
                            {filters.category.length > 0 && (
                                <Badge color="light" size="sm">
                                    {filters.category[0]}
                                </Badge>
                            )}
                            {filters.dateRange.start && (
                                <Badge color="info" size="sm">
                                    Başlanğıc: {filters.dateRange.start}
                                </Badge>
                            )}
                            {filters.dateRange.end && (
                                <Badge color="info" size="sm">
                                    Son: {filters.dateRange.end}
                                </Badge>
                            )}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default Filter;