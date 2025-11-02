// src/utils/pdfTrim.ts
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { PDFDocument } from "pdf-lib";
import type { TextContent, TextItem } from "pdfjs-dist/types/src/display/api";

type Box = { minX:number; minY:number; maxX:number; maxY:number };

export async function autoTrimPdfByText(
    fileOrBuffer: File | ArrayBuffer,
    paddingPt = 18
): Promise<Uint8Array> {
    const pad = Number.isFinite(paddingPt) ? paddingPt : 0;

    // 1) Orijinalı oxu
    const originalBuf =
        fileOrBuffer instanceof File ? await fileOrBuffer.arrayBuffer() : fileOrBuffer;

    // 2) İKİ AYRI KOPİYA HAZIRLA – biri pdf.js üçün, biri pdf-lib üçün
    //    (slice(0) yeni ArrayBuffer qaytarır)
    const bufForPdfjs = originalBuf.slice(0);
    const bufForPdfLib = originalBuf.slice(0);

    // ---- pdf.js ilə mətn bbox-u çıxar ----
    // Ui8Array istifadə etmək də detach riskini azaldır
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(bufForPdfjs) }).promise;
    const boxes: (Box | null)[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 1 });
        if (!Number.isFinite(vp.width) || !Number.isFinite(vp.height) || vp.width <= 0 || vp.height <= 0) {
            console.warn(`autoTrimPdfByText: skipping page ${i} due to invalid viewport size`, {
                width: vp.width,
                height: vp.height,
            });
            boxes.push(null);
            continue;
        }
        const tc = (await page.getTextContent()) as TextContent;

        let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
        for (const it of tc.items as TextItem[]) {
            const [, , , d, e, f] = it.transform;
            const w = it.width, h = Math.abs(d);
            const x = e, y = f - h;
            if (Number.isFinite(x)&&Number.isFinite(y)&&Number.isFinite(w)&&Number.isFinite(h)) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x + w);
                maxY = Math.max(maxY, y + h);
            }
        }

        if (!Number.isFinite(minX)) {
            boxes.push({ minX:0, minY:0, maxX:vp.width, maxY:vp.height });
        } else {
            boxes.push({
                minX: Math.max(0, minX - pad),
                minY: Math.max(0, minY - pad),
                maxX: Math.min(vp.width,  maxX + pad),
                maxY: Math.min(vp.height, maxY + pad),
            });
        }
    }

    // ---- pdf-lib ilə CropBox tətbiq et (AYRI buf ilə!) ----
    const doc = await PDFDocument.load(bufForPdfLib);
    const pages = doc.getPages();
    pages.forEach((p, i) => {
        const b = boxes[i];
        if (!b) return;
        const values = [b.minX, b.minY, b.maxX, b.maxY];
        if (values.some((v) => !Number.isFinite(v))) {
            console.warn(`autoTrimPdfByText: skipping crop for page ${i + 1} due to invalid box`, b);
            return;
        }
        const w = Math.max(10, b.maxX - b.minX);
        const h = Math.max(10, b.maxY - b.minY);
        if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
            console.warn(`autoTrimPdfByText: skipping crop for page ${i + 1} due to invalid size`, {
                width: w,
                height: h,
            });
            return;
        }
        const x = Number.isFinite(b.minX) ? b.minX : 0;
        const y = Number.isFinite(b.minY) ? b.minY : 0;
        try {
            p.setCropBox(x, y, w, h);
        } catch (error) {
            console.error("autoTrimPdfByText: crop application failed", {
                pageIndex: i + 1,
                cropX: x,
                cropY: y,
                cropW: w,
                cropH: h,
                error,
            });
            throw error;
        }
    });

    return await doc.save();
}
