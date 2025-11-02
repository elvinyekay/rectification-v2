import React, { useCallback, useEffect, useRef, useState } from "react";

type SplitViewProps = {
    left: React.ReactNode;
    right: React.ReactNode;
    initial?: number;
    minLeft?: number;
    minRight?: number;
    className?: string;
    reversed?: boolean;
};

const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));

export default function SplitView({
                                      left,
                                      right,
                                      initial = 50,
                                      minLeft = 20,
                                      minRight = 20,
                                      className = "",
                                      reversed = false,
                                  }: SplitViewProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [pct, setPct] = useState(clamp(initial, minLeft, 100 - minRight));
    const draggingRef = useRef(false);

    const startDrag = useCallback(() => (draggingRef.current = true), []);
    const stopDrag = useCallback(() => (draggingRef.current = false), []);

    // pct həmişə SOL fiziki panelin enidir
    const onMove = useCallback(
        (clientX: number) => {
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const next = ((clientX - rect.left) / rect.width) * 100;
            setPct(clamp(next, minLeft, 100 - minRight));
        },
        [minLeft, minRight]
    );

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!draggingRef.current) return;
            onMove(e.clientX);
        };
        const onTouchMove = (e: TouchEvent) => {
            if (!draggingRef.current) return;
            if (e.touches[0]) onMove(e.touches[0].clientX);
        };
        const onUp = () => stopDrag();

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchend", onUp);
        window.addEventListener("touchcancel", onUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchend", onUp);
            window.removeEventListener("touchcancel", onUp);
        };
    }, [onMove, stopDrag]);

    // Fiziki SOL panel (md və yuxarıda pct%, mobil stacked)
    const LeftPane = ({ children }: { children: React.ReactNode }) => (
        <div
            className="md:h-full h-1/2 md:overflow-auto overflow-hidden bg-white dark:bg-gray-900"
            style={{
                width: "100%",
                ...(typeof window !== "undefined" && window.innerWidth >= 768
                    ? { width: `${pct}%` }
                    : {}),
            }}
        >
            {children}
        </div>
    );

    // Fiziki SAĞ panel (həmişə dividerdən sonra, border-l burada)
    const RightPane = ({ children }: { children: React.ReactNode }) => (
        <div
            className="md:h-full h-1/2 md:overflow-auto overflow-hidden bg-white dark:bg-gray-900 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800"
            style={{
                width: "100%",
                ...(typeof window !== "undefined" && window.innerWidth >= 768
                    ? { width: `${100 - pct}%` }
                    : {}),
            }}
        >
            {children}
        </div>
    );

    return (
        <div
            ref={containerRef}
            className={`w-full h-full flex flex-col md:flex-row ${className}`}
        >
            {/* reversed=false: left → divider → right */}
            {/* reversed=true : (RIGHT content solda) → divider → (LEFT content sağda) */}
            {!reversed ? (
                <>
                    <LeftPane>{left}</LeftPane>

                    <div
                        role="separator"
                        aria-orientation="vertical"
                        tabIndex={0}
                        onMouseDown={startDrag}
                        onTouchStart={startDrag}
                        className="hidden md:block relative w-[6px] cursor-col-resize bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                    >
                        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1 h-10 rounded bg-gray-400/70 dark:bg-gray-500/70" />
                    </div>

                    <RightPane>{right}</RightPane>
                </>
            ) : (
                <>
                    {/* reversed: RIGHT content solda (pct%) */}
                    <LeftPane>{right}</LeftPane>

                    <div
                        role="separator"
                        aria-orientation="vertical"
                        tabIndex={0}
                        onMouseDown={startDrag}
                        onTouchStart={startDrag}
                        className="hidden md:block relative w-[6px] cursor-col-resize bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                    >
                        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1 h-10 rounded bg-gray-400/70 dark:bg-gray-500/70" />
                    </div>

                    {/* reversed: LEFT content sağda (100-pct%) */}
                    <RightPane>{left}</RightPane>
                </>
            )}
        </div>
    );
}
