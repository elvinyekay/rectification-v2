import { useState } from "react";
import Button from "../../../components/ui/button/Button.tsx";
import VerifiableFieldEditable from "./VerifiableFieldEditable.tsx";
import FormSidebar, { type MenuItem } from "../../../components/Formsidebar.tsx";

interface Props {
    isSubmitting: boolean;
    hideActionButtons?: boolean; // New prop to hide action buttons
}

const INITIAL_MENU_ITEMS: MenuItem[] = [
    {
        id: "chapter1",
        label: "1-ci Fəsil",
        children: [
            { id: "main", label: "Əsas səhifə" },
            { id: "documents", label: "Sənədlər-əsaslar" },
            { id: "restrictions", label: "Məhdudiyyətlər" },
            { id: "archive", label: "Arxiv" },
            { id: "passport", label: "Passport" },
        ],
    },
    {
        id: "chapter2",
        label: "2-ci Fəsil",
        children: [
            { id: "issued_docs", label: "Verilmiş sənədlər" },
            { id: "rights", label: "Hüquqlar" },
            { id: "individuals", label: "Fiziki ş-lər" },
            { id: "entities", label: "Hüquqi -lər" },
        ],
    },
    {
        id: "chapter3",
        label: "3-cü Fəsil",
        children: [
            { id: "restrictions_ch3", label: "Məhdudiyyətlər" },
            { id: "data", label: "Məlumatlar" },
        ],
    },
];

const FormSide = ({ isSubmitting, hideActionButtons = false }: Props) => {
    const [activeSection, setActiveSection] = useState("chapter1");
    const [activeSubsection, setActiveSubsection] = useState("main");
    const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);

    const handleMenuSelect = (sectionId: string, subsectionId?: string) => {
        setActiveSection(sectionId);
        if (subsectionId) {
            setActiveSubsection(subsectionId);
        }
    };

    const handleItemsReorder = (newItems: MenuItem[]) => {
        setMenuItems(newItems);
        // Burada API-ya yeni sıralanışı göndərə bilərik
        console.log("New order:", newItems);
    };

    const getCurrentPageTitle = () => {
        const currentChapter = menuItems.find((item) => item.id === activeSection);
        const currentPage = currentChapter?.children?.find((sub) => sub.id === activeSubsection);
        return currentPage?.label || "Səhifə tapılmadı";
    };

    const renderContent = () => {
        const fields = [
            {
                label: "test",
                originalValue: "asasdsa",
                required: true,
            },
            {
                label: "Əmlakın reyestr nömrəsi",
                originalValue: "12saxw232",
            },
            {
                label: "Əvvəlki reyestr nömrəsi",
                originalValue: "test tşkilat",
            },
            {
                label: "Əvvəlki reyestr tarixi",
                originalValue: "123456",
            },
            {
                label: "Reyestr nömrəsi",
                originalValue: "10.10.2010",
            },
            {
                label: "Reyestr tarixi",
                originalValue: "12345",
            },
        ];

        return (
            <div className="space-y-3">
                {fields.map((field, idx) => (
                    <VerifiableFieldEditable
                        key={idx}
                        label={field.label}
                        originalValue={field.originalValue}
                        required={field.required}
                        onChange={(v) => console.log(v)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="h-full w-full flex flex-col relative overflow-hidden">
            {/* Header with title and sidebar button */}
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getCurrentPageTitle()}
                </h2>

                {/* Sidebar button sağ tərəfdə */}
                <FormSidebar
                    items={menuItems}
                    onSelect={handleMenuSelect}
                    activeSection={activeSection}
                    activeSubsection={activeSubsection}
                    onItemsReorder={handleItemsReorder}
                />
            </div>

            {/* Content Area */}
            <div className={`flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900 ${
                hideActionButtons ? '' : 'pb-20' // Reduced bottom padding
            }`}>
                <div className="max-w-2xl">
                    {renderContent()}
                </div>
            </div>

            {/* Footer Buttons - Only show if not hidden */}
            {!hideActionButtons && (
                <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-3 flex gap-2 justify-end">
                    <Button
                        variant="gradient"
                        color="cyan"
                        size="xs"
                        disabled={isSubmitting}
                    >
                        Keç
                    </Button>
                    <Button
                        variant="gradient"
                        color="red"
                        size="xs"
                        disabled={isSubmitting}
                    >
                        Rədd et
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        size="xs"
                        disabled={isSubmitting}
                    >
                        Təsdiqlə & Növbəti
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FormSide;