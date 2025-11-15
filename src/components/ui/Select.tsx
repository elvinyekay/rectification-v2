import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronsUpDown } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
    icon?: string;
}

interface CustomSelectProps {
    options?: SelectOption[];
    value?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    className?: string;
    disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
                                                       options = [],
                                                       value,
                                                       placeholder = "Seçin...",
                                                       onChange,
                                                       className = "",
                                                       disabled = false
                                                   }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const selectRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Find selected option - with safety check
    const selectedOption = options?.find?.(option => option.value === selectedValue);

    // Calculate dropdown position
    const updateDropdownPosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    // Handle option selection
    const handleSelect = (optionValue: string) => {
        console.log('Option selected:', optionValue); // Debug log
        setSelectedValue(optionValue);
        setIsOpen(false);
        onChange?.(optionValue);
    };

    // Handle opening dropdown
    const handleOpen = () => {
        if (!disabled) {
            updateDropdownPosition();
            setIsOpen(!isOpen);
            console.log('Dropdown toggled, isOpen:', !isOpen); // Debug log
        }
    };

    // Handle outside click - improved version
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Check if click is outside both the select component and the portal dropdown
            if (
                selectRef.current &&
                !selectRef.current.contains(target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            if (isOpen) {
                updateDropdownPosition();
            }
        };

        const handleResize = () => {
            if (isOpen) {
                updateDropdownPosition();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleResize);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                window.removeEventListener('scroll', handleScroll, true);
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [isOpen]);

    // Update position when opened
    useEffect(() => {
        if (isOpen) {
            updateDropdownPosition();
        }
    }, [isOpen]);

    // Sync external value changes
    useEffect(() => {
        setSelectedValue(value || "");
    }, [value]);

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (disabled) return;

        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                handleOpen();
                break;
            case 'Escape':
                setIsOpen(false);
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (!isOpen) {
                    handleOpen();
                } else if (options && options.length > 0) {
                    const currentIndex = options.findIndex(opt => opt.value === selectedValue);
                    const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
                    if (options[nextIndex]) {
                        handleSelect(options[nextIndex].value);
                    }
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (!isOpen) {
                    handleOpen();
                } else if (options && options.length > 0) {
                    const currentIndex = options.findIndex(opt => opt.value === selectedValue);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
                    if (options[prevIndex]) {
                        handleSelect(options[prevIndex].value);
                    }
                }
                break;
        }
    };

    // Dropdown component that will be rendered in portal
    const DropdownContent = () => {
        if (!options || options.length === 0) {
            return (
                <div
                    ref={dropdownRef}
                    style={{
                        position: 'absolute',
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        width: dropdownPosition.width,
                        zIndex: 9999
                    }}
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-xl px-3 py-2"
                >
                    <span className="text-sm text-gray-500">Seçim mövcud deyil</span>
                </div>
            );
        }

        return (
            <div
                ref={dropdownRef}
                style={{
                    position: 'absolute',
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                    width: dropdownPosition.width,
                    zIndex: 9999
                }}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-xl max-h-60 overflow-auto"
            >
                {options.map((option, index) => {
                    // Handle click with proper event handling
                    const handleOptionClick = (e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Option clicked:', option.value, option.label); // Debug log
                        handleSelect(option.value);
                    };

                    return (
                        <button
                            key={`${option.value}-${index}`}
                            type="button"
                            onClick={handleOptionClick}
                            onMouseDown={handleOptionClick} // Additional event for better compatibility
                            className={`
                                w-full px-3 py-2
                                flex items-center gap-2
                                text-left text-sm
                                transition-colors duration-150
                                border-b border-gray-200 dark:border-gray-600 last:border-b-0
                                ${selectedValue === option.value
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600'
                            }
                            `}
                        >
                            {option.icon && (
                                <span className="text-base">{option.icon}</span>
                            )}
                            <span>{option.label}</span>

                            {selectedValue === option.value && (
                                <svg
                                    className="w-4 h-4 ml-auto"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div
            ref={selectRef}
            className={`relative ${className}`}
        >
            {/* Select Button */}
            <button
                ref={buttonRef}
                type="button"
                onClick={handleOpen}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className={`
                    w-full flex items-center justify-between
                    px-3 py-2
                    bg-white dark:bg-gray-700
                    border border-gray-300 dark:border-gray-600
                    rounded-md
                    text-left text-sm
                    transition-all duration-200 ease-in-out
                    ${isOpen
                    ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800'
                    : 'hover:border-gray-400 dark:hover:border-gray-500'
                }
                    ${disabled
                    ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800'
                    : 'cursor-pointer'
                }
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                `}
            >
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    {selectedOption?.icon && (
                        <span className="text-base">{selectedOption.icon}</span>
                    )}
                    <span className={selectedOption ? "" : "text-gray-500 dark:text-gray-400"}>
                        {selectedOption?.label || placeholder}
                    </span>
                </div>

                <ChevronsUpDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {/* Portal-rendered dropdown */}
            {isOpen && typeof document !== 'undefined' && createPortal(
                <DropdownContent />,
                document.body
            )}
        </div>
    );
};

export default CustomSelect;