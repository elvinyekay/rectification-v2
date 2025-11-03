import { motion } from 'framer-motion';

// Utility function for class names
const cn = (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(" ");

export type StepStatus = "pending" | "active" | "done" | "skipped" | "rejected";
export type Step = {
    id: string;
    label: string;
    kind?: "section" | "subsection"
};

interface ProgressTimelineProps {
    steps: Step[];
    currentIndex: number;
    statuses: Record<string, StepStatus>;
    minimal?: boolean;
    showLabels?: boolean;
    className?: string;
}

export default function ProgressTimeline({
                                             steps,
                                             currentIndex,
                                             statuses,
                                             minimal = true,
                                             showLabels = true,
                                             className,
                                         }: ProgressTimelineProps) {
    const total = steps.length;
    const doneCount = steps.filter(s => statuses[s.id] === "done").length;
    const percent = Math.round((doneCount / Math.max(total, 1)) * 100);

    // Helper functions
    const getStepStatus = (step: Step, idx: number): StepStatus => {
        return statuses[step.id] ?? (idx === currentIndex ? "active" : "pending");
    };

    const getStepSize = (step: Step): number => {
        return step.kind === "section" ? 24 : 18;
    };

    const getBorderClass = (status: StepStatus, isPassed: boolean): string => {
        if (status === "active" || isPassed) return "border-blue-500";
        if (status === "done") return "border-green-500";
        if (status === "rejected") return "border-red-500";
        if (status === "skipped") return "border-gray-400";
        return "border-gray-300 dark:border-gray-600";
    };

    const getBackgroundColor = (status: StepStatus, isPassed: boolean): string => {
        if (isPassed) return "#3b82f6"; // blue-500
        switch (status) {
            case "done": return "#10b981"; // green-500
            case "active": return "#3b82f6"; // blue-500
            case "rejected": return "#ef4444"; // red-500
            case "skipped": return "#9ca3af"; // gray-400
            default: return "#e5e7eb"; // gray-200
        }
    };

    const calculateProgressWidth = (): string => {
        if (total <= 1) return `${percent}%`;

        const baseWidth = (Math.max(currentIndex, doneCount) / (total - 1)) * 100;
        return `${Math.min(baseWidth, 100)}%`;
    };

    console.log('ProgressTimeline render:', {
        currentIndex,
        total,
        doneCount,
        percent,
        currentStepId: steps[currentIndex]?.id,
        currentStepLabel: steps[currentIndex]?.label
    });

    return (
        <div
            className={cn(
                "sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-800",
                "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800",
                "py-3 md:py-4",
                className
            )}
        >
            {/* Progress Info - Only show when not minimal */}
            {!minimal && (
                <div className="flex items-center justify-between px-4 pb-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        Tamamlanma: <span className="font-semibold">{doneCount}</span> / {total} ({percent}%)
                    </div>
                    <div className="text-xs text-gray-500 hidden md:block">
                        {steps[currentIndex]?.label ?? ""}
                    </div>
                </div>
            )}

            {/* Timeline Container */}
            <div className="px-4">
                <div className="relative">
                    {/* Background Line */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded bg-gray-200 dark:bg-gray-700" />

                    {/* Progress Line */}
                    <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600"
                        initial={{ width: 0 }}
                        animate={{ width: calculateProgressWidth() }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />

                    {/* Steps Container */}
                    <div className="relative z-10 flex justify-between items-center">
                        {steps.map((step, idx) => {
                            const status = getStepStatus(step, idx);
                            const size = getStepSize(step);
                            const isPassed = status === "pending" && idx < currentIndex;

                            const borderClass = getBorderClass(status, isPassed);
                            const bgColor = getBackgroundColor(status, isPassed);

                            return (
                                <div key={step.id} className="flex flex-col items-center">
                                    {/* Step Dot - Display Only */}
                                    <motion.div
                                        className={cn(
                                            "rounded-full border-2 shadow-lg transition-all duration-300 flex items-center justify-center relative",
                                            borderClass,
                                            status === "active" && "scale-110 shadow-blue-200 dark:shadow-blue-900"
                                        )}
                                        style={{
                                            width: size,
                                            height: size,
                                            backgroundColor: bgColor,
                                        }}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: idx * 0.1,
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25
                                        }}
                                        title={step.label}
                                    >
                                        {/* Check mark for done steps */}
                                        {status === "done" && (
                                            <motion.svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </motion.svg>
                                        )}

                                        {/* X mark for rejected steps */}
                                        {status === "rejected" && (
                                            <motion.svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </motion.svg>
                                        )}

                                        {/* Skip mark for skipped steps */}
                                        {status === "skipped" && (
                                            <motion.div
                                                className="w-2 h-2 bg-white rounded-full"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            />
                                        )}

                                        {/* Pulse animation for active step */}
                                        {status === "active" && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full bg-blue-500"
                                                animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        )}
                                    </motion.div>

                                    {/* Step Label */}
                                    {showLabels && (
                                        <motion.span
                                            className={cn(
                                                "mt-2 text-xs font-medium text-center transition-colors duration-200 max-w-16 leading-tight",
                                                status === "active"
                                                    ? "text-blue-700 dark:text-blue-300"
                                                    : status === "done"
                                                        ? "text-green-700 dark:text-green-300"
                                                        : status === "rejected"
                                                            ? "text-red-700 dark:text-red-300"
                                                            : "text-gray-600 dark:text-gray-400"
                                            )}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 + 0.2 }}
                                        >
                                            {step.label}
                                        </motion.span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend - Only show when not minimal */}
                {!minimal && (
                    <motion.div
                        className="flex flex-wrap gap-3 mt-4 px-2 text-xs text-gray-500"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <LegendItem color="#10b981" label="Tamam" />
                        <LegendItem color="#3b82f6" label="Aktiv" />
                        <LegendItem color="#ef4444" label="Rədd" />
                        <LegendItem color="#9ca3af" label="Keçildi" />
                        <LegendItem color="#e5e7eb" label="Gözləyir" />
                    </motion.div>
                )}
            </div>

            {/* Progress Summary - Minimal mode */}
            {minimal && (
                <motion.div
                    className="flex justify-between items-center text-xs px-4 pt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                        <span className="font-medium">{percent}% tamamlandı</span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-500">
                        <span>{doneCount} / {total} addım</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// Legend Item Component
function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <span className="inline-flex items-center gap-1">
            <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
            />
            {label}
        </span>
    );
}