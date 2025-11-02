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