import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

// Props for Accordion
interface AccordionProps {
    children: ReactNode; // Accordion items
    className?: string; // Optional className for styling
}

// Props for AccordionItem
interface AccordionItemProps {
    title: string; // Header title
    children: ReactNode; // Content to show/hide
    defaultOpen?: boolean; // Whether to start open
    className?: string; // Optional className for styling
    icon?: ReactNode; // Optional icon for header
}

// Accordion Component
const Accordion: React.FC<AccordionProps> = ({ children, className }) => {
    return <div className={`space-y-2 ${className || ''}`}>{children}</div>;
};

// AccordionItem Component
const AccordionItem: React.FC<AccordionItemProps> = ({
                                                         title,
                                                         children,
                                                         defaultOpen = false,
                                                         className,
                                                         icon,
                                                     }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden ${className || ''}`}>
            {/* Header */}
            <button
                onClick={toggleOpen}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between text-left"
            >
                <div className="flex items-center gap-2">
                    {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
                    <span className="font-medium text-gray-900 dark:text-white">{title}</span>
                </div>

                <span
                    className="text-gray-500 dark:text-gray-400 transition-transform duration-200"
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                >
                    <ChevronDown className="w-4 h-4" />
                </span>
            </button>

            {/* Content with smooth animation */}
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: isOpen ? '1000px' : '0px',
                }}
            >
                <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-600">
                    {children}
                </div>
            </div>
        </div>
    );
};

export { Accordion, AccordionItem };