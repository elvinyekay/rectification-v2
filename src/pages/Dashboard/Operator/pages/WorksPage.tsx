import { useState, useMemo } from "react";
import {
    Filter as FilterIcon,
    Eye,
    Clock,
    CheckCircle,
    XCircle,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { CompletedTask, PRIORITY_LABELS, STATUS_LABELS } from "../../../../types/document.ts";
import { MOCK_COMPLETED_TASKS } from "../../../../mocks/mockDocuments.ts";
import Button from "../../../../components/ui/button/Button.tsx";
import Badge from "../../../../components/ui/badge/Badge.tsx";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../../components/ui/table";
import { Accordion, AccordionItem } from "../../../../components/ui/accordion";
import Filter from "../../../../components/WorkDocsFilter.tsx";

type SortableField = "completedAt" | "processingTime" | "applicantName" | "status" | "priority";
type SortField = SortableField | null;
type SortDirection = "asc" | "desc";

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

export default function Worktable() {
    const [tasks] = useState<CompletedTask[]>(MOCK_COMPLETED_TASKS);
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const [filters, setFilters] = useState<Filters>({
        search: "",
        status: [],
        category: [],
        priority: [],
        dateRange: {},
    });

    const filteredAndSortedTasks = useMemo(() => {
        const filtered = tasks.filter((task) => {
            // Search filter - handle separate name and document search
            if (filters.search) {
                const [nameSearch = "", documentSearch = ""] = filters.search.split("|");
                let matchesSearch = false;

                // Check name search
                if (nameSearch) {
                    const nameMatch = task.applicantName
                        .toLowerCase()
                        .includes(nameSearch.toLowerCase());
                    if (nameMatch) matchesSearch = true;
                }

                // Check document search
                if (documentSearch) {
                    const documentMatch =
                        task.documentNumber.toLowerCase().includes(documentSearch.toLowerCase()) ||
                        task.documentType.toLowerCase().includes(documentSearch.toLowerCase());
                    if (documentMatch) matchesSearch = true;
                }

                // If both searches are provided, both must match
                if (nameSearch && documentSearch) {
                    const nameMatch = task.applicantName
                        .toLowerCase()
                        .includes(nameSearch.toLowerCase());
                    const documentMatch =
                        task.documentNumber.toLowerCase().includes(documentSearch.toLowerCase()) ||
                        task.documentType.toLowerCase().includes(documentSearch.toLowerCase());
                    matchesSearch = nameMatch && documentMatch;
                }

                if (!matchesSearch) return false;
            }

            // Status filter
            if (filters.status.length > 0 && !filters.status.includes(task.status)) {
                return false;
            }

            // Category filter
            if (filters.category.length > 0 && !filters.category.includes(task.category)) {
                return false;
            }

            // Priority filter
            if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
                return false;
            }

            // Date range filter
            if (filters.dateRange.start || filters.dateRange.end) {
                const taskDate = new Date(task.completedAt);
                if (filters.dateRange.start && taskDate < new Date(filters.dateRange.start)) {
                    return false;
                }
                if (filters.dateRange.end && taskDate > new Date(filters.dateRange.end)) {
                    return false;
                }
            }

            return true;
        });

        // Sort if field is set
        if (sortField) {
            filtered.sort((a, b) => {
                if (sortField === "completedAt") {
                    const aTime = new Date(a.completedAt).getTime();
                    const bTime = new Date(b.completedAt).getTime();
                    return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
                }

                if (sortField === "processingTime") {
                    const diff = a.processingTime - b.processingTime;
                    return sortDirection === "asc" ? diff : -diff;
                }

                // applicantName, status, priority -> string sahələr
                const aVal = String(a[sortField]).toLowerCase();
                const bVal = String(b[sortField]).toLowerCase();

                if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
                if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [tasks, filters, sortField, sortDirection]);

    // Pagination
    const paginatedTasks = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredAndSortedTasks.slice(startIndex, startIndex + pageSize);
    }, [filteredAndSortedTasks, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredAndSortedTasks.length / pageSize);

    const handleSort = (field: SortableField) => {
        if (sortField === field) {
            const newDirection: SortDirection = sortDirection === "asc" ? "desc" : "asc";
            setSortDirection(newDirection);
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
        setCurrentPage(1);
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat("az-AZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(dateString));
    };

    const formatProcessingTime = (minutes: number) => {
        if (minutes < 60) return `${minutes} d`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}s ${mins}d` : `${hours}s`;
    };

    const getStatusIcon = (status: CompletedTask["status"]) => {
        switch (status) {
            case "approved":
                return <CheckCircle className="w-4 h-4" />;
            case "rejected":
                return <XCircle className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const getPriorityBadge = (priority: CompletedTask["priority"]) => {
        const priorityConfig = {
            high: { color: "error" as const, icon: "🔴" }, // Red
            medium: { color: "warning" as const, icon: "🟡" }, // Yellow/Orange
            low: { color: "light" as const, icon: "🔘" }, // Light gray
        };

        const config = priorityConfig[priority];

        return (
            <Badge color={config.color} size="sm">
                <div className="flex items-center gap-1">
                    <span className="text-xs">{config.icon}</span>
                    <span>{PRIORITY_LABELS[priority]}</span>
                </div>
            </Badge>
        );
    };

    const SortIcon = ({ field }: { field: SortableField }) => {
        const isCurrentField = sortField === field;

        if (!isCurrentField) {
            return <ArrowUpDown className="w-4 h-4 text-gray-400 ml-1" />;
        }

        if (sortDirection === "asc") {
            return <ArrowUp className="w-4 h-4 text-blue-500 ml-1" />;
        } else {
            return <ArrowDown className="w-4 h-4 text-blue-500 ml-1" />;
        }
    };

    const handleRefresh = () => {
        setSortField(null);
        setSortDirection("desc");
        setCurrentPage(1);
        setFilters({
            search: "",
            status: [],
            category: [],
            priority: [],
            dateRange: {},
        });
    };

    const handleFiltersChange = (newFilters: Filters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setFilters({
            search: "",
            status: [],
            category: [],
            priority: [],
            dateRange: {},
        });
        setCurrentPage(1);
    };

    const hasActiveFilters = (): boolean => {
        return (
            filters.search !== "" ||
            filters.status.length > 0 ||
            filters.category.length > 0 ||
            filters.priority.length > 0 ||
            !!filters.dateRange.start ||
            !!filters.dateRange.end
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Görülmüş İşlər
                    </h1>
                </div>

                {/* Filter Accordion */}
                <div className="mb-6">
                    <Accordion>
                        <AccordionItem
                            title="Filtrlər"
                            icon={<FilterIcon className="w-4 h-4" />}
                            defaultOpen={hasActiveFilters()}
                        >
                            <Filter
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                onClear={handleClearFilters}
                            />
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {
                                        filteredAndSortedTasks.filter(
                                            (t) => t.status === "approved"
                                        ).length
                                    }
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Təsdiqləndi</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-3">
                                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {
                                        filteredAndSortedTasks.filter(
                                            (t) => t.status === "rejected"
                                        ).length
                                    }
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Rədd edildi</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {formatProcessingTime(
                                        filteredAndSortedTasks.reduce(
                                            (sum: number, task: CompletedTask) =>
                                                sum + task.processingTime,
                                            0
                                        )
                                    )}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Ümumi müddət
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                                <FilterIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {filteredAndSortedTasks.length}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Filtrlənmiş
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {filteredAndSortedTasks.length} nəticədən{" "}
                            {paginatedTasks.length} göstərilir
                        </p>

                        <button
                            onClick={handleRefresh}
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            title="Orijinal sıraya qayıt"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Səhifə:</span>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded text-sm ${
                                    currentPage === page
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table className="divide-y divide-gray-200 dark:divide-gray-700">
                            <TableHeader className="bg-gray-50 dark:bg-gray-700">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                                        onClick={() => handleSort("applicantName")}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>Ad</span>
                                            <SortIcon field="applicantName" />
                                        </div>
                                    </TableCell>

                                    <TableCell
                                        isHeader
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                    >
                                        Sənəd
                                    </TableCell>

                                    <TableCell
                                        isHeader
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                                        onClick={() => handleSort("processingTime")}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>Müddət</span>
                                            <SortIcon field="processingTime" />
                                        </div>
                                    </TableCell>

                                    <TableCell
                                        isHeader
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                                        onClick={() => handleSort("completedAt")}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>Tarix</span>
                                            <SortIcon field="completedAt" />
                                        </div>
                                    </TableCell>

                                    <TableCell
                                        isHeader
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                                        onClick={() => handleSort("status")}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>Status</span>
                                            <SortIcon field="status" />
                                        </div>
                                    </TableCell>

                                    <TableCell
                                        isHeader
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                                        onClick={() => handleSort("priority")}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>Prioritet</span>
                                            <SortIcon field="priority" />
                                        </div>
                                    </TableCell>

                                    <TableCell
                                        isHeader
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                    >
                                        Əməliyyatlar
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {paginatedTasks.map((task) => (
                                    <TableRow
                                        key={task.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <TableCell className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text:white">
                                                    {task.applicantName}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {task.documentNumber}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {task.documentType}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {task.category}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {formatProcessingTime(task.processingTime)}
                                        </TableCell>

                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(task.completedAt)}
                                        </TableCell>

                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <Badge
                                                color={
                                                    task.status === "approved" ? "success" : "error"
                                                }
                                            >
                                                <div className="flex items-center">
                                                    {getStatusIcon(task.status)}
                                                    <span className="ml-2 text-sm">
                                                        {STATUS_LABELS[task.status]}
                                                    </span>
                                                </div>
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            {getPriorityBadge(task.priority)}
                                        </TableCell>

                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Bax
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
