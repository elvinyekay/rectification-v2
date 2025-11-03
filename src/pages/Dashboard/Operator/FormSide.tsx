import { useState } from "react";
import Button from "../../../components/ui/button/Button.tsx";
import VerifiableFieldEditable from "./VerifiableFieldEditable.tsx";
import FormSidebar, {MenuItem} from "../../../components/Formsidebar.tsx";

interface Props {
    isSubmitting: boolean;
    hideActionButtons?: boolean;
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

    // 🔧 FIXED: handleMenuSelect with proper state updates
    const handleMenuSelect = (sectionId: string, subsectionId?: string) => {
        console.log('✅ FormSide handleMenuSelect:', { sectionId, subsectionId });

        setActiveSection(sectionId);
        if (subsectionId) {
            setActiveSubsection(subsectionId);
        } else {
            // If no subsection provided, set to first child or 'main'
            const section = menuItems.find(item => item.id === sectionId);
            const firstChild = section?.children?.[0];
            setActiveSubsection(firstChild?.id || 'main');
        }
    };

    const handleItemsReorder = (newItems: MenuItem[]) => {
        setMenuItems(newItems);
        console.log("New order:", newItems);
    };

    // 🔧 FIXED: Title showing both chapter and subsection
    const getCurrentPageTitle = () => {
        const currentChapter = menuItems.find((item) => item.id === activeSection);
        const currentPage = currentChapter?.children?.find((sub: { id: string; }) => sub.id === activeSubsection);

        if (currentChapter && currentPage) {
            return `${currentChapter.label} • ${currentPage.label}`;
        } else if (currentChapter) {
            return currentChapter.label;
        }
        return "Səhifə tapılmadı";
    };

    // 🔧 FIXED: Dynamic content based on activeSubsection
    const getContentByTab = () => {
        console.log('🎯 Rendering content for:', { activeSection, activeSubsection });

        switch (activeSubsection) {
            case 'main':
                return [
                    { label: "Əsas məlumat", originalValue: "Əsas səhifə məlumatları", required: true },
                    { label: "Sənəd nömrəsi", originalValue: "DOC-001", required: true },
                    { label: "Təsis tarixi", originalValue: "15.01.2024" },
                ];
            case 'documents':
                return [
                    { label: "Sənəd növü", originalValue: "Mülkiyyət sənədi", required: true },
                    { label: "Sənəd tarixi", originalValue: "15.10.2024" },
                    { label: "Verilən orqan", originalValue: "Dövlət komitəsi" },
                    { label: "Qeydiyyat nömrəsi", originalValue: "REG-2024-001" },
                ];
            case 'restrictions':
                return [
                    { label: "Məhdudiyyət növü", originalValue: "İpoteka", required: true },
                    { label: "Məhdudiyyət tarixi", originalValue: "20.09.2024" },
                    { label: "Məhdudiyyət müddəti", originalValue: "5 il" },
                    { label: "Məhdudiyyət səbəbi", originalValue: "Bank krediti" },
                ];
            case 'archive':
                return [
                    { label: "Arxiv nömrəsi", originalValue: "ARX-2024-001", required: true },
                    { label: "Arxivə verilmə tarixi", originalValue: "10.08.2024" },
                    { label: "Saxlanma müddəti", originalValue: "50 il" },
                    { label: "Arxiv şöbəsi", originalValue: "Mərkəzi arxiv" },
                ];
            case 'passport':
                return [
                    { label: "Passport seriyası", originalValue: "AZE", required: true },
                    { label: "Passport nömrəsi", originalValue: "1234567", required: true },
                    { label: "Verilmə tarixi", originalValue: "15.06.2020" },
                    { label: "Verilmə yeri", originalValue: "Bakı şəhəri" },
                    { label: "İstifadə müddəti", originalValue: "2030-06-15" },
                ];
            case 'issued_docs':
                return [
                    { label: "Verilmiş sənəd", originalValue: "Mülkiyyət şəhadətnaməsi", required: true },
                    { label: "Alıcı", originalValue: "Məmmədov Məmməd" },
                    { label: "Verilmə tarixi", originalValue: "25.11.2024" },
                    { label: "Sənəd nömrəsi", originalValue: "CERT-2024-100" },
                ];
            case 'rights':
                return [
                    { label: "Hüquq növü", originalValue: "Mülkiyyət hüququ", required: true },
                    { label: "Hüquq əsası", originalValue: "Alqı-satqı müqaviləsi" },
                    { label: "Qeydiyyat tarixi", originalValue: "30.10.2024" },
                    { label: "Hüquq sahibi", originalValue: "Məmmədov Məmməd" },
                ];
            case 'individuals':
                return [
                    { label: "Fiziki şəxsin adı", originalValue: "Məmmədov Məmməd Məmməd oğlu", required: true },
                    { label: "Doğum tarixi", originalValue: "15.05.1985" },
                    { label: "FİN kod", originalValue: "1ABCD23" },
                    { label: "Ünvan", originalValue: "Bakı şəhəri, Nəsimi rayonu" },
                ];
            case 'entities':
                return [
                    { label: "Hüquqi şəxsin adı", originalValue: "ABC Şirkəti MMC", required: true },
                    { label: "VÖEN", originalValue: "1234567890" },
                    { label: "Qeydiyyat ünvanı", originalValue: "Bakı şəhəri" },
                    { label: "Direktor", originalValue: "İsmayılov İsmayıl" },
                ];
            case 'restrictions_ch3':
                return [
                    { label: "3-cü fəsil məhdudiyyəti", originalValue: "Xüsusi məhdudiyyət", required: true },
                    { label: "Məhdudiyyət səbəbi", originalValue: "Məhkəmə qərarı" },
                    { label: "Məhdudiyyət müddəti", originalValue: "Qeyri-müəyyən" },
                ];
            case 'data':
                return [
                    { label: "Məlumat növü", originalValue: "Statistik məlumatlar", required: true },
                    { label: "Məlumat mənbəyi", originalValue: "Dövlət komitəsi" },
                    { label: "Yenilənmə tarixi", originalValue: "01.12.2024" },
                    { label: "Məlumat məsullusu", originalValue: "Sistem administratoru" },
                ];
            default:
                return [
                    { label: "Default field", originalValue: `Content for ${activeSubsection}` },
                ];
        }
    };

    const renderContent = () => {
        const fields = getContentByTab();

        return (
            <div className="space-y-3">
                {/* Dynamic form fields */}
                {fields.map((field, idx) => (
                    <VerifiableFieldEditable
                        key={`${activeSection}-${activeSubsection}-${idx}`} // Dynamic key for re-render
                        label={field.label}
                        originalValue={field.originalValue}
                        required={field.required}
                        onChange={(v) => console.log(`${field.label}:`, v)}
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
                hideActionButtons ? '' : 'pb-20'
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