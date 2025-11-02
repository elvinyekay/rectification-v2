import SplitView from "../../../components/SplitView";
import {
    useGetNextDocumentQuery,
    useSubmitDocumentMutation,
} from "../../../store/services/documentsApi";
import {NextDoc, NextDocResponse} from "../../../types/document.ts";
import Button from "../../../components/ui/button/Button.tsx";
import { useEffect, useRef, useState} from "react";
import {ReverseIcon} from "../../../icons";
import {Maximize2, Minimize2, MoreHorizontal} from "lucide-react";
import PDFViewer from "../../../components/PDFViewer";
import FormSide from "./FormSide.tsx";

const OperatorHome = () => {
    const [reversed, setReversed] = useState(false);
    const [fullPane, setFullPane] = useState<"left" | "right" | null>(null);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [compactMode, setCompactMode] = useState(false);
    const leftContainerRef = useRef<HTMLDivElement>(null);
    const rightContainerRef = useRef<HTMLDivElement>(null);
    const lastPaneRef = useRef<"left" | "right" | null>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const {data, isLoading, isFetching} = useGetNextDocumentQuery();
    const [, {isLoading: isSubmitting}] = useSubmitDocumentMutation();

    const hasDoc = (r: NextDocResponse): r is NextDoc =>
        r && !r.done && !!r.document;

    const isLoadingState = isLoading || isFetching;

    // Responsive toolbar detection
    useEffect(() => {
        const handleResize = () => {
            if (toolbarRef.current) {
                const width = toolbarRef.current.offsetWidth;
                setCompactMode(width < 500);
            }
        };

        const resizeObserver = new ResizeObserver(handleResize);
        if (toolbarRef.current) {
            resizeObserver.observe(toolbarRef.current);
        }

        handleResize(); // Initial check

        return () => resizeObserver.disconnect();
    }, []);

    // Responsive Bottom Toolbar Component
    const ResponsiveToolbar = () => (
        <div
            ref={toolbarRef}
            className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-2"
        >
            <div className="flex items-center justify-between gap-2">
                {/* Layout Controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setReversed(v => !v)}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Panelləri çevir"
                    >
                        <ReverseIcon className="w-4 h-4" />
                    </button>

                    {!compactMode && (
                        <>
                            <button
                                onClick={() => setFullPane(fullPane === "left" ? null : "left")}
                                className={`flex items-center gap-1 px-3 py-2 text-xs rounded-lg border transition-all ${
                                    fullPane === "left"
                                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                                title="PDF tam ekran"
                            >
                                {fullPane === "left" ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                PDF {fullPane === "left" ? "Bərpa" : "Tam"}
                            </button>

                            <button
                                onClick={() => setFullPane(fullPane === "right" ? null : "right")}
                                className={`flex items-center gap-1 px-3 py-2 text-xs rounded-lg border transition-all ${
                                    fullPane === "right"
                                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                                title="Form tam ekran"
                            >
                                {fullPane === "right" ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                Form {fullPane === "right" ? "Bərpa" : "Tam"}
                            </button>
                        </>
                    )}

                    {compactMode && (
                        <div className="relative">
                            <button
                                onClick={() => setShowActionsMenu(!showActionsMenu)}
                                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Layout seçimləri"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {showActionsMenu && (
                                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[150px]">
                                    <button
                                        onClick={() => {
                                            setFullPane(fullPane === "left" ? null : "left");
                                            setShowActionsMenu(false);
                                        }}
                                        className={`w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg ${
                                            fullPane === "left" ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' : ''
                                        }`}
                                    >
                                        {fullPane === "left" ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                        PDF {fullPane === "left" ? "Bərpa" : "Tam"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFullPane(fullPane === "right" ? null : "right");
                                            setShowActionsMenu(false);
                                        }}
                                        className={`w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 last:rounded-b-lg ${
                                            fullPane === "right" ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' : ''
                                        }`}
                                    >
                                        {fullPane === "right" ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                        Form {fullPane === "right" ? "Bərpa" : "Tam"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                    {compactMode ? (
                        // Compact mode: Only primary action visible
                        <>
                            <Button
                                variant="gradient"
                                color="green"
                                size="xs"
                                disabled={isSubmitting}
                            >
                                Təsdiqlə
                            </Button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        // Full mode: All buttons visible
                        <>
                            <Button
                                variant="gradient"
                                color="cyan"
                                size="xs"
                                disabled={isSubmitting}
                            >
                                Keç
                            </Button>
                            <Button
                                variant="gradient"
                                color="red"
                                size="xs"
                                disabled={isSubmitting}
                            >
                                Rədd et
                            </Button>
                            <Button
                                variant="gradient"
                                color="green"
                                size="xs"
                                disabled={isSubmitting}
                            >
                                Təsdiqlə & Növbəti
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    const renderLeft = (fullscreen: boolean) => (
        <div
            ref={leftContainerRef}
            className="h-full flex flex-col"
            onMouseEnter={() => (lastPaneRef.current = "left")}
            onFocusCapture={() => (lastPaneRef.current = "left")}
        >
            {!fullscreen && (
                <div className="flex items-center justify-between px-3 py-1">
                    <span className="text-xs text-gray-500">
                        {isLoadingState ? "Yüklənir..." : ""}
                    </span>
                </div>
            )}

            <div className="flex-1 overflow-auto">
                {data && hasDoc(data) ? (
                    data.document.fileUrl ? (
                        <PDFViewer url={data.document.fileUrl}/>
                    ) : data.document.imageUrl ? (
                        <img src={data.document.imageUrl} alt="document" className="max-h-full w-full object-contain"/>
                    ) : (
                        <div className="grid h-full place-items-center text-sm text-gray-500">Fayl yoxdur</div>
                    )
                ) : (
                    <div className="grid h-full place-items-center text-sm text-gray-500">Növbə boşdur</div>
                )}
            </div>
        </div>
    );

    const renderRight = (fullscreen: boolean) => (
        <div
            ref={rightContainerRef}
            className="h-full flex flex-col"
            onMouseEnter={() => (lastPaneRef.current = "right")}
            onFocusCapture={() => (lastPaneRef.current = "right")}
        >
            {!fullscreen && (
                <div className="flex items-center justify-end px-3 py-1">
                    {/* Header space for non-fullscreen mode */}
                </div>
            )}
            <div className="flex-1 overflow-auto">
                <FormSide isSubmitting={isSubmitting} hideActionButtons={true} />
            </div>
        </div>
    );

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!(event.ctrlKey || event.metaKey) || event.shiftKey || event.altKey) return;
            if (event.key.toLowerCase() !== "f") return;
            event.preventDefault();

            const active = document.activeElement as Node | null;
            const inLeft = active ? leftContainerRef.current?.contains(active) ?? false : false;
            const inRight = active ? rightContainerRef.current?.contains(active) ?? false : false;

            const desired: "left" | "right" = inRight && !inLeft
                ? "right"
                : inLeft && !inRight
                    ? "left"
                    : (lastPaneRef.current ?? "left");

            setFullPane((prev) => {
                return prev === desired ? null : desired;
            });
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowActionsMenu(false);
        };

        if (showActionsMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showActionsMenu]);

    return (
        <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex flex-col">
            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                {fullPane ? (
                    <div className="h-full">
                        {fullPane === "left" ? renderLeft(true) : renderRight(true)}
                    </div>
                ) : (
                    <SplitView
                        left={renderLeft(false)}
                        right={renderRight(false)}
                        initial={56}
                        minLeft={30}
                        minRight={28}
                        reversed={reversed}
                    />
                )}
            </div>

            {/* Responsive Bottom Toolbar */}
            <ResponsiveToolbar />
        </div>
    );
}

export default OperatorHome;