import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import {DocumentItem, NextDocResponse} from "../../types/document";
import {mockDocuments} from "../../mocks/mockDocuments.ts";


let cursor = 0;


const mockBaseQuery: BaseQueryFn<
    { url: string; method?: "GET" | "POST"; body?: object },
    unknown,
    unknown
> = async ({ url, method = "GET", body }) => {
    if (url === "/api/documents/next" && method === "GET") {
        while (cursor < mockDocuments.length && mockDocuments[cursor].status === "submitted") {
            cursor++;
        }
        if (cursor >= mockDocuments.length) {
            return { data: { done: true } as NextDocResponse };
        }
        const item = mockDocuments[cursor];
        // operator açdısa "in_progress" işarə edək
        if (item.status === "new") item.status = "in_progress";
        return { data: {done: false, document: item} as unknown as NextDocResponse };
    }

    if (url === "/api/documents/submit" && method === "POST") {
        const { id, updatedOldData } = body as { id: string; updatedOldData?: DocumentItem["oldData"] };
        const idx = mockDocuments.findIndex((d) => d.id === id);
        if (idx !== -1) {
            if (updatedOldData) mockDocuments[idx].oldData = updatedOldData;
            mockDocuments[idx].status = "submitted";
            // submit-dən sonra növbəti "next" üçün göstəricini irəli çəkirik
            if (cursor === idx) cursor++;
            return { data: { ok: true } };
        }
        return { error: { status: 404, data: { message: "Document not found" } } as object };
    }

    return { error: { status: 404, data: { message: "Not found" } } as object };
};

export const documentsApi = createApi({
    reducerPath: "documentsApi",
    baseQuery: mockBaseQuery,
    endpoints: (builder) => ({
        getNextDocument: builder.query<NextDocResponse, void>({
            query: () => ({ url: "/api/documents/next", method: "GET" }),
        }),
        submitDocument: builder.mutation<{ ok: true }, { id: string; updatedOldData?: DocumentItem["oldData"] }>({
            query: (body) => ({ url: "/api/documents/submit", method: "POST", body }),
        }),
    }),
});

export const { useGetNextDocumentQuery, useLazyGetNextDocumentQuery, useSubmitDocumentMutation } = documentsApi;
