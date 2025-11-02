import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";

import { useEffect, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Worker, Viewer, RotateDirection } from "@react-pdf-viewer/core";
import { rotatePlugin } from "@react-pdf-viewer/rotate";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import type { RenderZoomInProps, RenderZoomOutProps } from "@react-pdf-viewer/zoom";
import type { RenderRotateProps } from "@react-pdf-viewer/rotate";
import type {
    RenderGoToPageProps,
    RenderCurrentPageLabelProps,
} from "@react-pdf-viewer/page-navigation";
import {RefreshCcw} from "lucide-react";

type PDFViewerProps = {
    url: string;
};

const toolbarButton =
    "p-2 rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none";

const iconProps = {
    width: 16,
    height: 16,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
};

export default function PDFViewer({ url }: PDFViewerProps) {
    const rotatePluginInstance = rotatePlugin();
    const zoomPluginInstance = zoomPlugin();
    const navigationPluginInstance = pageNavigationPlugin();
    const zoomInActionRef = useRef<(() => void) | null>(null);
    const zoomOutActionRef = useRef<(() => void) | null>(null);
    const lastRightClickRef = useRef<number>(0);
    const rotateForwardRef = useRef<(() => void) | null>(null);

    const goToNextPage = () => {
        try {
            navigationPluginInstance.jumpToNextPage?.();
        } catch (error) {
            console.error("jumpToNextPage failed", error);
        }
    };

    const goToPreviousPage = () => {
        try {
            navigationPluginInstance.jumpToPreviousPage?.();
        } catch (error) {
            console.error("jumpToPreviousPage failed", error);
        }
    };

    const prevButton =
        navigationPluginInstance.GoToPreviousPage?.({
            children: ({ isDisabled, onClick }: RenderGoToPageProps) => (
                <button
                    type="button"
                    onClick={onClick}
                    disabled={isDisabled}
                    className={toolbarButton}
                    title="Əvvəlki səhifə"
                >
                    <svg {...iconProps} viewBox="0 0 24 24">
                        <path d="M6 14l6-6 6 6" />
                    </svg>
                </button>
            ),
        }) ?? null;

    const nextButton =
        navigationPluginInstance.GoToNextPage?.({
            children: ({ isDisabled, onClick }: RenderGoToPageProps) => (
                <button
                    type="button"
                    onClick={onClick}
                    disabled={isDisabled}
                    className={toolbarButton}
                    title="Növbəti səhifə"
                >
                    <svg {...iconProps} viewBox="0 0 24 24">
                        <path d="M6 10l6 6 6-6" />
                    </svg>
                </button>
            ),
        }) ?? null;

    const currentPage =
        navigationPluginInstance.CurrentPageLabel?.({
            children: ({ pageLabel, numberOfPages }: RenderCurrentPageLabelProps) => (
                <span>{pageLabel} / {numberOfPages}</span>
            ),
        }) ?? null;

    const zoomOutBtn =
        zoomPluginInstance.ZoomOut?.({
            children: ({ onClick }: RenderZoomOutProps) => {
                zoomOutActionRef.current = onClick;
                return (
                    <button
                        type="button"
                        onClick={onClick}
                        className={toolbarButton}
                        title="Uzaqlaşdır"
                    >
                        <svg {...iconProps} viewBox="0 0 24 24">
                            <path d="M5 12h14" />
                        </svg>
                    </button>
                );
            },
        }) ?? null;

    const zoomPopover = zoomPluginInstance.ZoomPopover?.({}) ?? null;

    const zoomInBtn =
        zoomPluginInstance.ZoomIn?.({
            children: ({ onClick }: RenderZoomInProps) => {
                zoomInActionRef.current = onClick;
                return (
                    <button
                        type="button"
                        onClick={onClick}
                        className={toolbarButton}
                        title="Yaxınlaşdır"
                    >
                        <svg {...iconProps} viewBox="0 0 24 24">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    </button>
                );
            },
        }) ?? null;

    const rotateLeftBtn =
        rotatePluginInstance.Rotate?.({
            direction: RotateDirection.Backward,
            children: ({ onClick }: RenderRotateProps) => (
                <button
                    type="button"
                    onClick={onClick}
                    className={toolbarButton}
                    title="90° sola çevir"
                >
                    <svg {...iconProps} viewBox="0 0 24 24">
                        <path d="M3 2v6h6" />
                        <path d="M21 12a9 9 0 0 0-9-9c-2.5 0-4.9 1-6.7 2.7L3 8" />
                    </svg>
                </button>
            ),
        }) ?? null;

    const rotateRightBtn =
        rotatePluginInstance.Rotate?.({
            direction: RotateDirection.Forward,
            children: ({ onClick }: RenderRotateProps) => (
                (() => {
                    rotateForwardRef.current = onClick;
                    return (
                        <button
                            type="button"
                            onClick={() => {
                                rotateForwardRef.current = onClick;
                                onClick();
                            }}
                            className={toolbarButton}
                            title="90° sağa çevir"
                        >
                            <svg {...iconProps} viewBox="0 0 24 24">
                                <path d="M21 2v6h-6" />
                                <path d="M3 12a9 9 0 0 1 9-9c-2.5 0-4.9 1 6.7 2.7L21 8" />
                            </svg>
                        </button>
                    );
                })()
            ),
        }) ?? null;

    const rotateHalfBtn =
        rotatePluginInstance.Rotate?.({
            direction: RotateDirection.Forward,
            children: ({ onClick }: RenderRotateProps) => (
                (() => {
                    rotateForwardRef.current = onClick;
                    return (
                        <button
                            type="button"
                            onClick={() => {
                                rotateForwardRef.current = onClick;
                                onClick();
                                setTimeout(onClick, 0);
                            }}
                            className={toolbarButton}
                            title="180° çevir"
                        >
                            <RefreshCcw size={16} />
                        </button>
                    );
                })()
            ),
        }) ?? null;

    const handleDoubleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;
        event.preventDefault();
        zoomInActionRef.current?.();
    };

    const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
        if (event.button === 2) {
            event.preventDefault();
            const now = Date.now();
            if (now - lastRightClickRef.current < 350) {
                zoomOutActionRef.current?.();
            }
            lastRightClickRef.current = now;
        }
    };

    const handleContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const key = event.key;
            const isCtrlOrMeta = event.ctrlKey || event.metaKey;
            if (isCtrlOrMeta && !event.shiftKey && !event.altKey) {
                if (key.toLowerCase() === "r") {
                    event.preventDefault();
                    if (rotateForwardRef.current) {
                        rotateForwardRef.current();
                        setTimeout(() => rotateForwardRef.current && rotateForwardRef.current(), 0);
                    }
                    return;
                }
                if (key === "^") {
                    event.preventDefault();
                    goToPreviousPage();
                    return;
                }
            }

            if (!isCtrlOrMeta && !event.altKey) {
                switch (key) {
                    case "ArrowDown":
                    case "PageDown":
                        event.preventDefault();
                        goToNextPage();
                        break;
                    case "ArrowUp":
                        event.preventDefault();
                        goToPreviousPage();
                        break;
                    case "PageUp":
                        event.preventDefault();
                        goToPreviousPage();
                        break;
                }
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div className="flex h-full flex-col">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-white p-2 shadow-sm">
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-1">
                        {prevButton}
                        {nextButton}
                        <span className="px-2 text-sm font-medium text-gray-600">{currentPage}</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-1">
                        {zoomOutBtn}
                        {zoomPopover}
                        {zoomInBtn}
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-1">
                        {rotateLeftBtn}
                        {rotateHalfBtn}
                        {rotateRightBtn}
                    </div>
                </div>

                <div
                    className="flex-1 overflow-hidden"
                    onDoubleClick={handleDoubleClick}
                    onMouseDown={handleMouseDown}
                    onContextMenu={handleContextMenu}
                >
                    <Viewer
                        fileUrl={url}
                        plugins={[rotatePluginInstance, zoomPluginInstance, navigationPluginInstance]}
                    />
                </div>
            </div>
        </Worker>
    );
}
