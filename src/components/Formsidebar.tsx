import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDownIcon} from "../icons";

export interface MenuItem {
    id: string;
    label: string;
    children?: MenuItem[];
}

interface FormSidebarProps {
    items: MenuItem[];
    onSelect: (sectionId: string, subsectionId?: string) => void;
    activeSection?: string;
    activeSubsection?: string;
    onItemsReorder?: (newItems: MenuItem[]) => void;
}

// Sortable Item Component
function SortableItem({
                          item,
                          isParent = false,
                          parentId,
                          activeSection,
                          activeSubsection,
                          expandedItems,
                          onItemClick,
                          // isDragging = false
                      }: {
    item: MenuItem;
    isParent?: boolean;
    parentId?: string;
    activeSection?: string;
    activeSubsection?: string;
    expandedItems: string[];
    onItemClick: (item: MenuItem, parentId?: string) => void;
    isDragging?: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isActive = isParent
        ? activeSection === item.id
        : activeSubsection === item.id && activeSection === parentId;

    return (
        <div ref={setNodeRef} style={style} className={isSortableDragging ? 'opacity-50' : ''}>
            <div className="group relative">
                <button
                    onClick={() => onItemClick(item, parentId)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-between ${
                        isActive
                            ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold shadow-sm"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    } ${isSortableDragging ? 'shadow-2xl ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}
                >
                    <div className="flex items-center gap-2">
                        {/* Drag Handle */}
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                            title="Sürükləyin"
                        >
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 6 10">
                                <circle cx="1" cy="1" r="1"/>
                                <circle cx="1" cy="5" r="1"/>
                                <circle cx="1" cy="9" r="1"/>
                                <circle cx="5" cy="1" r="1"/>
                                <circle cx="5" cy="5" r="1"/>
                                <circle cx="5" cy="9" r="1"/>
                            </svg>
                        </div>
                        <span className={`text-sm ${isParent ? 'font-medium' : ''}`}>
                            {item.label}
                        </span>
                    </div>

                    {item.children && item.children.length > 0 && (
                        <motion.div
                            animate={{
                                rotate: expandedItems.includes(item.id) ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDownIcon/>
                        </motion.div>
                    )}
                </button>

                {/* Drop Zone Indicator */}
                {isSortableDragging && (
                    <div className="absolute inset-0 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 pointer-events-none" />
                )}
            </div>
        </div>
    );
}

// Drag Overlay Component
function DragOverlayItem({ item }: { item: MenuItem | null }) {
    if (!item) return null;

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl p-4 opacity-90">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
            </span>
        </div>
    );
}

export default function FormSidebar({
                                        items,
                                        onSelect,
                                        activeSection,
                                        activeSubsection,
                                        onItemsReorder = () => {}, // Default empty function
                                    }: FormSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [localItems, setLocalItems] = useState(items);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const toggleExpand = (id: string) => {
        setExpandedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleItemClick = (item: MenuItem, parentId?: string) => {
        if (item.children && item.children.length > 0) {
            toggleExpand(item.id);
        } else {
            onSelect(parentId || item.id, item.children ? undefined : item.id);
            setIsOpen(false);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) {
            return;
        }

        const activeIndex = localItems.findIndex(item => item.id === active.id);
        const overIndex = localItems.findIndex(item => item.id === over.id);

        if (activeIndex !== -1 && overIndex !== -1) {
            const newItems = arrayMove(localItems, activeIndex, overIndex);
            setLocalItems(newItems);
            if (onItemsReorder) {
                onItemsReorder(newItems);
            }
        }

        // Handle sub-items reordering
        const activeParent = localItems.find(item =>
            item.children?.some(child => child.id === active.id)
        );
        const overParent = localItems.find(item =>
            item.children?.some(child => child.id === over.id)
        );

        if (activeParent && overParent && activeParent.id === overParent.id && activeParent.children) {
            const activeSubIndex = activeParent.children.findIndex(child => child.id === active.id);
            const overSubIndex = activeParent.children.findIndex(child => child.id === over.id);

            if (activeSubIndex !== -1 && overSubIndex !== -1) {
                const newChildren = arrayMove(activeParent.children, activeSubIndex, overSubIndex);
                const newItems = localItems.map(item =>
                    item.id === activeParent.id
                        ? { ...item, children: newChildren }
                        : item
                );
                setLocalItems(newItems);
                if (onItemsReorder) {
                    onItemsReorder(newItems);
                }
            }
        }
    };

    const getActiveItem = (id: string): MenuItem | null => {
        // Check main items
        const mainItem = localItems.find(item => item.id === id);
        if (mainItem) return mainItem;

        // Check sub items
        for (const item of localItems) {
            if (item.children) {
                const subItem = item.children.find(child => child.id === id);
                if (subItem) return subItem;
            }
        }
        return null;
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200 hover:scale-105"
                title="Menyunu aç"
            >
                {isOpen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/30 rounded-lg z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: isOpen ? 0 : "100%" }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-40 overflow-y-auto shadow-lg rounded-lg"
            >
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="pt-4 pb-6 px-4 space-y-2">
                        <SortableContext
                            items={localItems.map(item => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {localItems.map((item) => (
                                <div key={item.id}>
                                    {/* Main Item */}
                                    <SortableItem
                                        item={item}
                                        isParent={true}
                                        activeSection={activeSection}
                                        activeSubsection={activeSubsection}
                                        expandedItems={expandedItems}
                                        onItemClick={handleItemClick}
                                        isDragging={activeId === item.id}
                                    />

                                    {/* Sub Items */}
                                    <AnimatePresence>
                                        {item.children &&
                                            item.children.length > 0 &&
                                            expandedItems.includes(item.id) && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="mt-1 mr-2 space-y-1 border-r-2 border-gray-200 dark:border-gray-700 pr-2"
                                                >
                                                    <SortableContext
                                                        items={item.children.map(child => child.id)}
                                                        strategy={verticalListSortingStrategy}
                                                    >
                                                        {item.children.map((subItem) => (
                                                            <SortableItem
                                                                key={subItem.id}
                                                                item={subItem}
                                                                parentId={item.id}
                                                                activeSection={activeSection}
                                                                activeSubsection={activeSubsection}
                                                                expandedItems={expandedItems}
                                                                onItemClick={handleItemClick}
                                                                isDragging={activeId === subItem.id}
                                                            />
                                                        ))}
                                                    </SortableContext>
                                                </motion.div>
                                            )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </SortableContext>
                    </div>

                    {/* Drag Overlay */}
                    <DragOverlay>
                        <DragOverlayItem item={activeId ? getActiveItem(activeId) : null} />
                    </DragOverlay>
                </DndContext>
            </motion.div>
        </>
    );
}