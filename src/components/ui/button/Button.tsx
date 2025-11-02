import { ReactNode } from "react";

interface ButtonProps {
    children?: ReactNode;
    size?: "sm" | "md" | "xs" | "compact";
    variant?: "primary" | "outline" | "gradient" | "pill" | "outline-gradient" | "ghost";
    color?: "default" | "dark" | "green" | "red" | "yellow" | "purple" | "blue" | "cyan" | "teal" | "lime" | "pink" | "alternative" | "light" | "neutral"| "soft-dark" | "minimal" | "muted";
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    title?: string;
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           size = "md",
                                           variant = "primary",
                                           color = "default",
                                           startIcon,
                                           endIcon,
                                           onClick,
                                           className = "",
                                           disabled = false,
                                           type = "button",
                                           title = "",
                                           loading = false,
                                       }) => {
    // Size Classes
    const sizeClasses = {
        xs: "px-3 py-1 text-sm",
        sm: "px-4 py-3 text-sm",
        md: "px-5 py-3.5 text-sm",
        compact: "px-2 py-1.5 text-xs",
    };

    // Ghost Variant Classes
    const ghostClasses = {
        default: "bg-transparent text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30 transition-colors",
        dark: "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 transition-colors",
        green: "bg-transparent text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30 transition-colors",
        red: "bg-transparent text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors",
        yellow: "bg-transparent text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-950/30 transition-colors",
        purple: "bg-transparent text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/30 transition-colors",
        blue: "bg-transparent text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30 transition-colors",
        cyan: "bg-transparent text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-950/30 transition-colors",
        teal: "bg-transparent text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/30 transition-colors",
        lime: "bg-transparent text-lime-600 hover:bg-lime-50 dark:text-lime-400 dark:hover:bg-lime-950/30 transition-colors",
        pink: "bg-transparent text-pink-600 hover:bg-pink-50 dark:text-pink-400 dark:hover:bg-pink-950/30 transition-colors",
        alternative: "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50 transition-colors",
        light: "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50 transition-colors",
        neutral: "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/40 transition-colors",
        "soft-dark": "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-900/30 transition-all",
        muted: "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/20 transition-colors",
        minimal: "bg-transparent text-gray-500 hover:bg-gray-100/50 dark:text-gray-500 dark:hover:bg-gray-700/20 transition-colors",

    };

    // Outline Variant Classes
    const outlineClasses = {
        default: "border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white",
        dark: "border-2 border-gray-800 text-gray-800 bg-transparent hover:bg-gray-800 hover:text-white dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-300 dark:hover:text-gray-900",
        green: "border-2 border-green-700 text-green-700 bg-transparent hover:bg-green-700 hover:text-white dark:border-green-600 dark:text-green-600 dark:hover:bg-green-600 dark:hover:text-white",
        red: "border-2 border-red-600 text-red-600 bg-transparent hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white",
        yellow: "border-2 border-yellow-400 text-yellow-600 bg-transparent hover:bg-yellow-400 hover:text-gray-900 dark:border-yellow-300 dark:text-yellow-300 dark:hover:bg-yellow-300 dark:hover:text-gray-900",
        purple: "border-2 border-purple-600 text-purple-600 bg-transparent hover:bg-purple-600 hover:text-white dark:border-purple-500 dark:text-purple-500 dark:hover:bg-purple-500 dark:hover:text-white",
        blue: "border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white",
        cyan: "border-2 border-cyan-500 text-cyan-600 bg-transparent hover:bg-cyan-500 hover:text-white dark:border-cyan-400 dark:text-cyan-400 dark:hover:bg-cyan-400 dark:hover:text-white",
        teal: "border-2 border-teal-500 text-teal-600 bg-transparent hover:bg-teal-500 hover:text-white dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-400 dark:hover:text-white",
        lime: "border-2 border-lime-500 text-lime-600 bg-transparent hover:bg-lime-500 hover:text-gray-900 dark:border-lime-400 dark:text-lime-400 dark:hover:bg-lime-400 dark:hover:text-gray-900",
        pink: "border-2 border-pink-600 text-pink-600 bg-transparent hover:bg-pink-600 hover:text-white dark:border-pink-500 dark:text-pink-500 dark:hover:bg-pink-500 dark:hover:text-white",
    };

    // Outline Gradient Classes - border gradient
    const outlineGradientClasses = {
        blue: "relative bg-white text-blue-600 hover:text-white dark:bg-gray-900 dark:text-blue-400",
        green: "relative bg-white text-green-600 hover:text-white dark:bg-gray-900 dark:text-green-400",
        cyan: "relative bg-white text-cyan-600 hover:text-white dark:bg-gray-900 dark:text-cyan-400",
        teal: "relative bg-white text-teal-600 hover:text-white dark:bg-gray-900 dark:text-teal-400",
        lime: "relative bg-white text-lime-600 hover:text-gray-900 dark:bg-gray-900 dark:text-lime-400",
        red: "relative bg-white text-red-600 hover:text-white dark:bg-gray-900 dark:text-red-400",
        pink: "relative bg-white text-pink-600 hover:text-white dark:bg-gray-900 dark:text-pink-400",
        purple: "relative bg-white text-purple-600 hover:text-white dark:bg-gray-900 dark:text-purple-400",
        default: "relative bg-white text-blue-600 hover:text-white dark:bg-gray-900 dark:text-blue-400",
    };

    // Gradient border colors for outline-gradient
    const gradientBorderStyles: Record<string, string> = {
        blue: "linear-gradient(to right, rgb(59, 130, 246), rgb(29, 78, 216))",
        green: "linear-gradient(to right, rgb(74, 222, 128), rgb(22, 163, 74))",
        cyan: "linear-gradient(to right, rgb(103, 232, 249), rgb(6, 182, 212))",
        teal: "linear-gradient(to right, rgb(94, 234, 212), rgb(20, 184, 166))",
        lime: "linear-gradient(to right, rgb(190, 242, 100), rgb(132, 204, 22))",
        red: "linear-gradient(to right, rgb(248, 113, 113), rgb(220, 38, 38))",
        pink: "linear-gradient(to right, rgb(236, 72, 153), rgb(190, 24, 93))",
        purple: "linear-gradient(to right, rgb(168, 85, 247), rgb(126, 34, 206))",
        default: "linear-gradient(to right, rgb(59, 130, 246), rgb(29, 78, 216))",
    };

    // Gradient Variant Classes
    const gradientClasses = {
        blue: "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800",
        green: "bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700",
        cyan: "bg-gradient-to-r from-cyan-400 to-cyan-600 text-white hover:from-cyan-500 hover:to-cyan-700",
        teal: "bg-gradient-to-r from-teal-400 to-teal-600 text-white hover:from-teal-500 hover:to-teal-700",
        lime: "bg-gradient-to-r from-lime-400 to-lime-600 text-gray-900 hover:from-lime-500 hover:to-lime-700",
        red: "bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700",
        pink: "bg-gradient-to-r from-pink-500 to-pink-700 text-white hover:from-pink-600 hover:to-pink-800",
        purple: "bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800",
        default: "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800",
        dark: "bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-black",
        yellow: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700",
        light: "bg-gradient-to-r from-neutral-50 to-neutral-100 text-neutral-700 hover:from-neutral-100 hover:to-neutral-200 hover:text-cyan-800  shadow-sm hover:shadow-md transition-all duration-200",
    };

    // Pill Variant Classes
    const pillClasses = {
        default: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
        alternative: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300",
        dark: "bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700",
        light: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600",
        green: "bg-green-700 text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700",
        red: "bg-red-700 text-white hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700",
        yellow: "bg-yellow-400 text-gray-900 hover:bg-yellow-500 dark:bg-yellow-300 dark:hover:bg-yellow-400",
        purple: "bg-purple-700 text-white hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700",
        blue: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
        cyan: "bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700",
        teal: "bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700",
        lime: "bg-lime-500 text-gray-900 hover:bg-lime-600 dark:bg-lime-400 dark:hover:bg-lime-500",
        pink: "bg-pink-600 text-white hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-700",
    };

    const primaryClasses = {
        default: "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
        light: "bg-brand-100 text-brand-700 border border-brand-200 hover:bg-brand-200 shadow-none disabled:bg-brand-50 disabled:text-brand-400 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-700 dark:hover:bg-brand-800/50",
    };

    // Loading spinner component
    const LoadingSpinner = () => (
        <svg
            className="w-4 h-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    // Get the appropriate classes based on variant and color
    const getVariantClasses = () => {
        if (variant === "primary") return primaryClasses;
        if (variant === "ghost") return ghostClasses[color as keyof typeof ghostClasses] || ghostClasses.default;
        if (variant === "outline") return outlineClasses[color as keyof typeof outlineClasses] || outlineClasses.default;
        if (variant === "outline-gradient") return outlineGradientClasses[color as keyof typeof outlineGradientClasses] || outlineGradientClasses.default;
        if (variant === "gradient") return gradientClasses[color as keyof typeof gradientClasses] || gradientClasses.blue;
        if (variant === "pill") return pillClasses[color as keyof typeof pillClasses] || pillClasses.default;
        return primaryClasses;
    };

    // Border radius based on variant
    const borderRadius = variant === "pill" ? "rounded-full" : "rounded-lg";

    // Gradient border style for outline-gradient
    const gradientBorderStyle = variant === "outline-gradient"
        ? {
            background: gradientBorderStyles[color] || gradientBorderStyles.default,
            padding: "2px",
        }
        : {};

    if (variant === "outline-gradient") {
        return (
            <div
                style={gradientBorderStyle}
                className={`inline-flex ${borderRadius} group transition ${
                    disabled || loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                <button
                    className={`inline-flex items-center justify-center gap-2 font-medium transition w-full group-hover:bg-gradient-to-r ${
                        color === "blue" ? "group-hover:from-blue-500 group-hover:to-blue-700" :
                            color === "green" ? "group-hover:from-green-400 group-hover:to-green-600" :
                                color === "cyan" ? "group-hover:from-cyan-400 group-hover:to-cyan-600" :
                                    color === "teal" ? "group-hover:from-teal-400 group-hover:to-teal-600" :
                                        color === "lime" ? "group-hover:from-lime-400 group-hover:to-lime-600" :
                                            color === "red" ? "group-hover:from-red-400 group-hover:to-red-600" :
                                                color === "pink" ? "group-hover:from-pink-500 group-hover:to-pink-700" :
                                                    color === "purple" ? "group-hover:from-purple-500 group-hover:to-purple-700" :
                                                        "group-hover:from-blue-500 group-hover:to-blue-700"
                    } ${className} ${sizeClasses[size]} ${getVariantClasses()} ${borderRadius}`}
                    onClick={onClick}
                    disabled={disabled || loading}
                    type={type}
                >
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {startIcon && <span className="flex items-center">{startIcon}</span>}
                            {children}
                            {endIcon && <span className="flex items-center">{endIcon}</span>}
                        </>
                    )}
                </button>
            </div>
        );
    }

    return (
        <button
            className={`inline-flex items-center justify-center gap-2 font-medium transition ${className} ${
                sizeClasses[size]
            } ${getVariantClasses()} ${borderRadius} ${
                disabled || loading ? "cursor-not-allowed opacity-50" : ""
            } ${variant === "ghost" ? "rounded-md" : ""}`}
            onClick={onClick}
            disabled={disabled || loading}
            type={type}
        >
            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {startIcon && <span className="flex items-center">{startIcon}</span>}
                    {title && <span className="flex items-center">{title}</span>}
                    {children}
                    {endIcon && <span className="flex items-center">{endIcon}</span>}
                </>
            )}
        </button>
    );
};

export default Button;