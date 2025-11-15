export type DocumentStatus = 'new' | 'in_progress' | 'submitted';


export type DocumentOldData = {
    owner: string;
    area: number;
    address: string;
};


export type DocumentItem = {
    id: string;
    scanUrl: string;
    oldData: DocumentOldData;
    status: DocumentStatus;
};

export interface CompletedTask {
    id: string;
    documentId: string;
    documentType: string;
    documentNumber: string;
    applicantName: string;
    operatorName: string;
    completedAt: string;
    processingTime: number; // in minutes
    status: 'approved' | 'rejected' ;
    fieldsModified: number;
    notes?: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
}

export const PRIORITY_LABELS = {
    high: "Yüksək",
    medium: "Orta",
    low: "Aşağı"
};

export const STATUS_LABELS = {
    approved: "Təsdiqləndi",
    rejected: "Rədd edildi",
    // skipped: "Keçildi"
};

export const DOCUMENT_CATEGORIES = [
    "Əmlak Sənədləri",
    "İcarə Sənədləri",
    "Vərəsəlik Sənədləri",
    "Kredit Sənədləri",
    "Əmək Sənədləri",
    "Qeydiyyat Sənədləri",
    "Lisenziya Sənədləri",
    "Təhsil Sənədləri",
    "Tibbi Sənədlər",
    "Maliyyə Sənədləri",
    "Şəxsi Sənədlər"
];

export const OPERATORS = [
    "Aysel Əliyeva",
    "Rəşad Quliyev",
    "Gülnar Mustafayeva"
];

export type DocItem = {
    id: string;
    fileUrl?: string;
    imageUrl?: string;
    customerName?: string;
    type?: string;
    scanUrl?: string;
    oldData?: DocumentOldData;
    status?: DocumentStatus;
};



export type NextDoc = { done: false; document: DocItem };
export type NextDocResponse = NextDoc | { done: true };