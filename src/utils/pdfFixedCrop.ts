// src/utils/pdfFixedCrop.ts
import { PDFDocument } from "pdf-lib";

/** 1-ci səhifəni sabit marginlərlə kəsir (PDF pt: 72pt = 1in) */
export async function cropFirstPageFixedMargin(
    fileOrBuffer: File | ArrayBuffer,
    marginPt = 40
): Promise<Uint8Array> {
    const buf = fileOrBuffer instanceof File ? await fileOrBuffer.arrayBuffer() : fileOrBuffer;
    const pdf = await PDFDocument.load(buf);
    const pages = pdf.getPages();
    if (pages.length === 0) return await pdf.save();

    const p = pages[0];
    const { width, height } = p.getSize();
    const nx = marginPt;
    const ny = marginPt;
    const nw = Math.max(10, width - marginPt * 2);
    const nh = Math.max(10, height - marginPt * 2);
    p.setCropBox(nx, ny, nw, nh);

    return await pdf.save();
}
