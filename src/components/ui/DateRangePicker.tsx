import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRange {
    start?: string;
    end?: string;
}

interface DateRangePickerProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
                                                             value,
                                                             onChange,
                                                             placeholder = "Tarix seçin...",
                                                             className = "",
                                                             disabled = false
                                                         }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectingStart, setSelectingStart] = useState(true);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    // Calculate dropdown position
    const updateDropdownPosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
                width: Math.max(320, rect.width) // Minimum 320px for calendar
            });
        }
    };

    // Handle outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                containerRef.current &&
                !containerRef.current.contains(target) &&
                calendarRef.current &&
                !calendarRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // Update position when opened
    useEffect(() => {
        if (isOpen) {
            updateDropdownPosition();
        }
    }, [isOpen]);

    // Handle calendar open
    const handleOpen = () => {
        if (!disabled) {
            updateDropdownPosition();
            setIsOpen(!isOpen);
            if (!isOpen) {
                setSelectingStart(true);
            }
        }
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('az-AZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        // const lastDay = new Date(year, month + 1, 0);
        const startOfWeek = new Date(firstDay);
        startOfWeek.setDate(firstDay.getDate() - firstDay.getDay() + 1); // Monday start

        const days = [];
        const currentDate = new Date(startOfWeek);

        // Generate 6 weeks (42 days)
        for (let i = 0; i < 42; i++) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    };

    // Handle date selection
    const handleDateClick = (date: Date) => {
        const dateString = date.toISOString().split('T')[0];

        if (selectingStart) {
            // Selecting start date
            onChange({
                start: dateString,
                end: value.end && dateString <= value.end ? value.end : undefined
            });
            setSelectingStart(false);
        } else {
            // Selecting end date
            if (value.start && dateString >= value.start) {
                onChange({
                    start: value.start,
                    end: dateString
                });
                setIsOpen(false); // Close after selecting range
            } else {
                // If selected date is before start, make it the new start
                onChange({
                    start: dateString,
                    end: undefined
                });
                setSelectingStart(false);
            }
        }
    };

    // Check if date is in range
    const isDateInRange = (date: Date) => {
        if (!value.start || !value.end) return false;
        const dateString = date.toISOString().split('T')[0];
        return dateString >= value.start && dateString <= value.end;
    };

    // Check if date is start or end
    const isStartDate = (date: Date) => {
        if (!value.start) return false;
        return date.toISOString().split('T')[0] === value.start;
    };

    const isEndDate = (date: Date) => {
        if (!value.end) return false;
        return date.toISOString().split('T')[0] === value.end;
    };

    // Clear selection
    const handleClear = () => {
        onChange({ start: undefined, end: undefined });
        setSelectingStart(true);
    };

    // Navigate months
    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            return newMonth;
        });
    };

    const calendarDays = generateCalendarDays();
    const displayText = value.start && value.end
        ? `${formatDate(value.start)} - ${formatDate(value.end)}`
        : value.start
            ? `${formatDate(value.start)} - ...`
            : '';

    // Calendar component
    const CalendarContent = () => (
        <div
            ref={calendarRef}
            style={{
                position: 'absolute',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                zIndex: 9999
            }}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-4"
        >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={() => navigateMonth('prev')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentMonth.toLocaleDateString('az-AZ', { month: 'long', year: 'numeric' })}
                </h3>

                <button
                    type="button"
                    onClick={() => navigateMonth('next')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Week days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['B.e', 'Ç.a', 'Ç', 'C.a', 'C', 'Ş', 'B'].map(day => (
                    <div key={day} className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400 text-center">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isStart = isStartDate(date);
                    const isEnd = isEndDate(date);
                    const isInRange = isDateInRange(date);

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleDateClick(date)}
                            disabled={!isCurrentMonth}
                            className={`
                                p-2 text-xs rounded transition-colors
                                ${!isCurrentMonth
                                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600'
                            }
                                ${isToday ? 'font-bold' : ''}
                                ${isStart || isEnd
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : isInRange
                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                    : ''
                            }
                            `}
                        >
                            {date.getDate()}
                        </button>
                    );
                })}
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {selectingStart ? 'Başlanğıc tarixi seçin' : 'Son tarixi seçin'}
                </span>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        Təmizlə
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Bağla
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Date Range Button */}
            <button
                ref={buttonRef}
                type="button"
                onClick={handleOpen}
                disabled={disabled}
                className={`
                    w-full flex items-center justify-between
                    px-3 py-2
                    bg-white dark:bg-gray-700
                    border border-gray-300 dark:border-gray-600
                    rounded-md
                    text-left text-sm
                    transition-all duration-200
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
                <span className={displayText ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
                    {displayText || placeholder}
                </span>
                <Calendar className="w-4 h-4 text-gray-400" />
            </button>

            {/* Portal-rendered calendar */}
            {isOpen && typeof document !== 'undefined' && createPortal(
                <CalendarContent />,
                document.body
            )}
        </div>
    );
};

export default DateRangePicker;