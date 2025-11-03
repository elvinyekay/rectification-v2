import {useEffect, useId, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import Button from "../../../components/ui/button/Button";
import {CheckLineIcon, CloseIcon, PencilIcon} from "../../../icons";
import InputField from "../../../components/form/input/InputField";
import Tooltip from "../../../components/Tooltip.tsx";

type VerifiableFieldProps = {
    label: string;
    originalValue: string;
    placeholder?: string;
    required?: boolean;
    onChange?: (payload: {
        accepted: boolean;
        originalValue: string;
        newValue?: string;
        finalValue: string;
        changed: boolean;
    }) => void;
};

export default function VerifiableFieldEditable({
                                                    label,
                                                    originalValue,
                                                    placeholder = "Yeni dəyəri daxil edin",
                                                    required = false,
                                                    onChange,
                                                }: VerifiableFieldProps) {
    const id = useId();

    const [accepted, setAccepted] = useState(false);
    const [editing, setEditing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // draft (input) və commit (correction)
    const [inputValue, setInputValue] = useState("");
    const [correction, setCorrection] = useState("");

    const correctionExists = correction.trim() !== "";
    const changed = !accepted && correctionExists && correction !== originalValue;
    const finalValue = accepted
        ? originalValue
        : correctionExists
            ? correction
            : originalValue;

    // 🔧 Fixed dark mode classes
    const base =
        "rounded-lg p-4 transition-all duration-200 bg-white dark:bg-gray-800 " +
        "shadow-xs hover:shadow-sm focus-within:shadow-md relative";

    const stateDefault =
        "border border-gray-200 dark:border-gray-600";

    const stateAccepted =
        "border border-emerald-500/80 dark:border-emerald-400/70 " +
        "bg-emerald-500/5 dark:bg-emerald-400/10 " +
        "shadow-sm shadow-emerald-200/30 dark:shadow-emerald-800/30";

    const stateEditing =
        "border border-amber-500/80 dark:border-amber-400/70 " +
        "bg-amber-500/5 dark:bg-amber-400/10 " +
        "shadow-sm shadow-amber-200/30 dark:shadow-amber-800/30";

    const containerClass =
        base +
        " " +
        (accepted ? stateAccepted : (editing || correctionExists ? stateEditing : stateDefault));

    useEffect(() => {
        onChange?.({accepted, originalValue, newValue: correction, finalValue, changed});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accepted, correction]);

    const startEdit = () => {
        setAccepted(false);
        setEditing(true);
        setInputValue((p) => p || correction || originalValue);
    };

    const cancelEdit = () => {
        setEditing(false);
        setInputValue(correction || "");
    };

    const saveEdit = () => {
        const v = inputValue.trim();
        if (required && v === "") return;
        setCorrection(v);
        setEditing(false);
        setAccepted(false);
    };

    const acceptNow = () => {
        if (editing || correctionExists) return;
        setAccepted(prev => !prev);
    };

    const handleContextToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        if (editing) {
            cancelEdit();
        } else {
            startEdit();
        }
    };

    // Enter və Escape key handler
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            saveEdit();
        } else if (e.key === "Escape") {
            e.preventDefault();
            cancelEdit();
        }
    };

    return (
        <div
            className={containerClass}
            onDoubleClick={acceptNow}
            onContextMenu={handleContextToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-start justify-between gap-3">
                {/* 🔧 Fixed dark mode label */}
                <label className="text-[10px] uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400 pb-1">
                    {label}
                </label>

                <div className="absolute top-4 right-4 h-8 w-fit">
                    {isHovered && (
                        <motion.div
                            className="flex items-center gap-2"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.15}}
                        >
                            {/* CHECK */}
                            <Tooltip text={"Təsdiq et"} position={"top"}>
                                <Button
                                    variant={"ghost"}
                                    size={"compact"}
                                    onClick={acceptNow}
                                    color={"minimal"}
                                    disabled={accepted}
                                    className={`${editing ? "opacity-40" : ""}`}
                                >
                                    <CheckLineIcon
                                        className={`w-4 h-4 ${accepted ? "text-emerald-500 dark:text-emerald-400" : ""}`}
                                    />
                                </Button>
                            </Tooltip>

                            {/* EDIT */}
                            <Tooltip text={"Düzəliş et"} position={"top"}>
                                <Button
                                    onClick={startEdit}
                                    disabled={accepted}
                                    size={"compact"}
                                    variant={"ghost"}
                                    color={"minimal"}
                                >
                                    <PencilIcon
                                        className={`w-4 h-4 ${editing ? "text-amber-500 dark:text-amber-400" : ""}`}
                                    />
                                </Button>
                            </Tooltip>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="text-md">
                {/* 🔧 Fixed dark mode original value text */}
                <div className="text-gray-800 dark:text-gray-100 break-words pb-2">
                    {originalValue || "—"}
                </div>

                {/* 🔧 Fixed dark mode correction display */}
                {!accepted && correctionExists && (
                    <motion.div
                        initial={{opacity: 0, y: -5}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -5}}
                        className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-700/50"
                    >
                        <div className="flex items-center gap-2 text-sm">
                            {/* Badge */}
                            <span
                                className="inline-flex select-none px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-200 font-semibold text-xs whitespace-nowrap">
                                Düzəliş
                            </span>
                            {/* Value with highlight */}
                            <span
                                className="text-amber-600 dark:text-amber-100 font-medium break-words bg-amber-50/50 dark:bg-amber-900/30 px-2 py-1 rounded">
                                {correction}
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>

            <AnimatePresence initial={false}>
                {editing && (
                    <motion.div
                        key="edit-field"
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: "auto"}}
                        exit={{opacity: 0, height: 0}}
                        transition={{duration: 0.25, ease: "easeOut"}}
                        className="overflow-hidden space-y-2"
                    >
                        <InputField
                            id={id}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            aria-invalid={required && inputValue.trim() === ""}
                            className={"!px-3 !py-0 !h-9"}
                            autoFocus
                        />

                        <div className="flex items-center gap-2">
                            <Button
                                variant="gradient"
                                color="green"
                                size="xs"
                                onClick={saveEdit}
                                disabled={required && inputValue.trim() === ""}
                            >
                                <CheckLineIcon/>
                            </Button>

                            <Button
                                variant="gradient"
                                color="light"
                                size="compact"
                                onClick={cancelEdit}
                            >
                                <CloseIcon/>
                            </Button>
                        </div>

                        {/* 🔧 Fixed dark mode error text */}
                        {required && inputValue.trim() === "" && (
                            <p className="text-xs text-red-600 dark:text-red-400">Bu sahə məcburidir.</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}