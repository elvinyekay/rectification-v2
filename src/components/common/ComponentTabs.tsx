import React, {Children, isValidElement, KeyboardEvent, useEffect, useMemo, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {ComponentTabProps} from "./ComponentTab.tsx";


export type ComponentTabsProps = {
    children: React.ReactNode; // one or more <ComponentTab>
    defaultValue?: string;
    onChange?: (value: string) => void;
    className?: string;
    contentClassName?: string;
};



export function ComponentTabs({
                                  children,
                                  defaultValue,
                                  onChange,
                                  className = "",
                                  contentClassName = "",
                              }: ComponentTabsProps) {
    const scopeId =useRef(`tabs-${Math.random().toString(36).slice(2)}`).current;
    const tabs = useMemo(() => {
        const list: ComponentTabProps[] = [];
        Children.forEach(children, (child) => {
            if (isValidElement(child)) {
                const props = child.props as ComponentTabProps;
                if (props && typeof props.value === "string") list.push(props);
            }
        });
        return list;
    }, [children]);

    const enabledTabs = useMemo(() => tabs.filter(t => !t.disabled), [tabs]);

    const [active, setActive] = useState<string>(
        defaultValue ?? enabledTabs[0]?.value
    );

    useEffect(() => {
        // If current active becomes disabled or missing, fallback to first enabled
        if (!tabs.find(t => t.value === active && !t.disabled)) {
            const next = enabledTabs[0]?.value;
            if (next) setActive(next);
        }
    }, [active, tabs, enabledTabs]);

    const setActiveSafe = (v: string) => {
        setActive(v);
        onChange?.(v);
    };

    // Keyboard nav support
    const listRef = useRef<HTMLDivElement>(null);
    const focusIndex = (idx: number) => {
        const nodes = listRef.current?.querySelectorAll<HTMLButtonElement>(
            '[role="tab"]:not([aria-disabled="true"])'
        );
        if (!nodes || nodes.length === 0) return;
        const i = ((idx % nodes.length) + nodes.length) % nodes.length;
        nodes[i].focus();
    };

    const onKeys = (e: KeyboardEvent<HTMLDivElement>) => {
        const nodes = listRef.current?.querySelectorAll<HTMLButtonElement>(
            '[role="tab"]:not([aria-disabled="true"])'
        );
        if (!nodes || nodes.length === 0) return;
        const current = Array.from(nodes).findIndex(n => n === document.activeElement);
        switch (e.key) {
            case "ArrowRight": e.preventDefault(); focusIndex(current + 1); break;
            case "ArrowLeft": e.preventDefault(); focusIndex(current - 1); break;
            case "Home": e.preventDefault(); focusIndex(0); break;
            case "End": e.preventDefault(); focusIndex(nodes.length - 1); break;
            case "Enter":
            case " ": {
                if (current >= 0) setActiveSafe(enabledTabs[current].value);
                break;
            }
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Tablist */}
            <div
                ref={listRef}
                role="tablist"
                aria-label="Tabs"
                onKeyDown={onKeys}
                className="relative mx-auto w-full max-w-5xl rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 px-2 py-1"
            >
                <div className="flex flex-wrap items-center gap-1 gap-y-2">
                    {tabs.map((t) => {
                        const isActive = t.value === active;
                        const isDisabled = !!t.disabled;
                        return (
                            <button
                                key={t.value}
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`panel-${t.value}`}
                                aria-disabled={isDisabled}
                                disabled={isDisabled}
                                onClick={() => !isDisabled && setActiveSafe(t.value)}
                                className={`relative px-6 py-2 text-[13px] font-medium rounded-xl outline-none transition-colors whitespace-nowrap
                  ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  ${isActive ? "text-slate-700" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId={`tab-pill-${scopeId}`}
                                        className="absolute inset-0 rounded-xl bg-white pointer-events-none z-0"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 inline-flex items-center gap-2">
                                    {t.startIcon && <span className="inline-flex">{t.startIcon}</span>}
                                    <span>{t.label}</span>
                                    {t.endIcon && <span className="inline-flex">{t.endIcon}</span>}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Panels */}
            <div className={`relative mx-auto mt-1 w-full max-w-5xl ${contentClassName}`}>
                <AnimatePresence mode="wait">
                    {tabs.map((t) => {
                        const isActive = t.value === active;
                        return (
                            isActive && (
                                <motion.section
                                    key={t.value}
                                    role="tabpanel"
                                    id={`panel-${t.value}`}
                                    aria-labelledby={t.value}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="rounded-2xl border border-slate-50 bg-white p-3 shadow-xs"
                                >
                                    {t.children}
                                </motion.section>
                            )
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}

