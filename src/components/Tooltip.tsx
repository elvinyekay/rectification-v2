import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

type TooltipProps = {
    text: string;
    position?: TooltipPosition;
    children: ReactNode;
};

export default function Tooltip({
                                    text,
                                    position = "bottom",
                                    children,
                                }: TooltipProps) {
    const [isHovered, setIsHovered] = useState(false);

    const positionClasses = {
        top: "bottom-full mb-2 -translate-x-1/2 left-1/2",
        bottom: "top-full mt-2 -translate-x-1/2 left-1/2",
        left: "right-full mr-2 top-1/2 -translate-y-1/2",
        right: "left-full ml-2 top-1/2 -translate-y-1/2",
    };

    const arrowClasses = {
        top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100 border-l-transparent border-r-transparent border-b-transparent",
        bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-100 border-l-transparent border-r-transparent border-t-transparent",
        left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-100 border-t-transparent border-b-transparent border-r-transparent",
        right: "right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-100 border-t-transparent border-b-transparent border-l-transparent",
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}

            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute pointer-events-none z-50 ${positionClasses[position]}`}
                >
                    <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap font-medium relative shadow-lg">
                        {text}
                        <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
                    </div>
                </motion.div>
            )}
        </div>
    );
}