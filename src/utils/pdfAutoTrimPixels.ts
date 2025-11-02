import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { PDFDocument } from "pdf-lib";
import type { PDFPageProxy } from "pdfjs-dist/types/src/display/api";

type Box = { minX:number; minY:number; maxX:number; maxY:number };
const clamp = (v:number,min:number,max:number)=>Math.min(max,Math.max(min,v));

function otsuThreshold(gray: Uint8ClampedArray): number {
    const hist = new Array(256).fill(0);
    for (let i=0;i<gray.length;i++) hist[gray[i]]++;
    const total = gray.length;
    let sum = 0;
    for (let t=0;t<256;t++) sum += t*hist[t];
    let sumB = 0, wB = 0, wF = 0, varMax = 0, th = 127;
    for (let t=0;t<256;t++) {
        wB += hist[t]; if (wB === 0) continue;
        wF = total - wB; if (wF === 0) break;
        sumB += t*hist[t];
        const mB = sumB / wB;
        const mF = (sum - sumB) / wF;
        const between = wB * wF * (mB - mF) * (mB - mF);
        if (between > varMax) { varMax = between; th = t; }
    }
    return th;
}

/** Bir səhifə üçün piksel əsaslı bbox (üst-sol mənşə – viewport koordinatı) */
async function pixelBox(page:PDFPageProxy, scale=1.25): Promise<Box> {
    const vp = page.getViewport({ scale });
    const vpWidth = Math.ceil(vp.width);
    const vpHeight = Math.ceil(vp.height);

    if (!Number.isFinite(vpWidth) || !Number.isFinite(vpHeight) || vpWidth <= 0 || vpHeight <= 0) {
        console.warn("pixelBox: invalid viewport size, using full page", {
            width: vp.width,
            height: vp.height,
        });
        return { minX: 0, minY: 0, maxX: vp.width || 0, maxY: vp.height || 0 };
    }

    const canvas = document.createElement("canvas");
    canvas.width = vpWidth;
    canvas.height = vpHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.warn("pixelBox: canvas 2d context unavailable, using full page");
        return { minX: 0, minY: 0, maxX: vp.width, maxY: vp.height };
    }
    await page.render({ canvasContext: ctx , viewport: vp }).promise;

    const { data, width, height } = ctx.getImageData(0,0,canvas.width,canvas.height);

    // RGB -> grayscale
    const gray = new Uint8ClampedArray(width*height);
    for (let i=0, gi=0; i<data.length; i+=4, gi++) {
        const r=data[i], g=data[i+1], b=data[i+2];
        gray[gi] = (r*0.299 + g*0.587 + b*0.114) | 0;
    }

    // adaptiv threshold
    const t = otsuThreshold(gray);
    // bir az sərtləşdirək ki, açıq bozlar da boşluq sayılsın
    const thr = Math.min(255, t + 15);

    let minX=width, minY=height, maxX=-1, maxY=-1;
    // nazik xətləri udmaq üçün 2px addım (sürət)
    for (let y=0; y<height; y+=2) {
        for (let x=0; x<width; x+=2) {
            const gi = y*width + x;
            const isContent = gray[gi] < thr; // tünd bölgələr – məzmun
            if (isContent) {
                if (x<minX) minX=x;
                if (x>maxX) maxX=x;
                if (y<minY) minY=y;
                if (y>maxY) maxY=y;
            }
        }
    }
    // tam ağ səhifə fallback
    if (maxX<0 || maxY<0) return { minX:0, minY:0, maxX:vp.width, maxY:vp.height };

    // canvas px → viewport pt (scale-ə görə)
    const denom = scale > 0 ? scale : 1;
    const sx = (x:number)=> x/denom;
    const sy = (y:number)=> y/denom;

    return { minX:sx(minX), minY:sy(minY), maxX:sx(maxX), maxY:sy(maxY) };
}

/** PDF: hər səhifəni piksel analizilə auto-trim et; text layer qalır */
export async function autoTrimPdfByPixels(
    fileOrBuffer: File | ArrayBuffer,
    paddingPt = 12,   // kəsimdən sonra əlavə boşluq
    renderScale = 1.25
): Promise<Uint8Array> {
    const pad = Number.isFinite(paddingPt) ? paddingPt : 0;
    const safeScale = Number.isFinite(renderScale) && renderScale > 0 ? renderScale : 1;

    // detach probleminə qarşı iki nüsxə
    const source = fileOrBuffer instanceof File ? await fileOrBuffer.arrayBuffer() : fileOrBuffer;
    const bufForJs = source.slice(0);
    const bufForLib = source.slice(0);

    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(bufForJs) }).promise;
    const doc = await PDFDocument.load(bufForLib);

    for (let i=1; i<=pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 1 });
        if (!Number.isFinite(vp.width) || !Number.isFinite(vp.height) || vp.width <= 0 || vp.height <= 0) {
            console.warn(`autoTrimPdfByPixels: skipping page ${i} due to invalid viewport size`, {
                width: vp.width,
                height: vp.height,
            });
            continue;
        }

        const box = await pixelBox(page, safeScale);

        const values = [box.minX, box.minY, box.maxX, box.maxY];
        if (values.some((v) => !Number.isFinite(v))) {
            console.warn(`autoTrimPdfByPixels: skipping page ${i} due to invalid detected box`, box);
            continue;
        }

        // padding + sərhəd yoxlaması
        const minX = clamp(box.minX - pad, 0, vp.width);
        const minY = clamp(box.minY - pad, 0, vp.height);
        const maxX = clamp(box.maxX + pad, 0, vp.width);
        const maxY = clamp(box.maxY + pad, 0, vp.height);

        const paddedValues = [minX, minY, maxX, maxY];
        if (paddedValues.some((v) => !Number.isFinite(v))) {
            console.warn(`autoTrimPdfByPixels: skipping page ${i} due to invalid padded box`, {
                minX,
                minY,
                maxX,
                maxY,
            });
            continue;
        }

        // viewport (üst-sol) → PDF pt (alt-sol)
        const cropW = Math.max(10, maxX - minX);
        const cropH = Math.max(10, maxY - minY);
        const cropX = minX;
        const cropY = vp.height - (minY + cropH);

        const cropValues = [cropX, cropY, cropW, cropH];
        if (cropValues.some((v) => !Number.isFinite(v)) || cropW <= 0 || cropH <= 0) {
            console.warn(`autoTrimPdfByPixels: skipping page ${i} due to invalid crop`, {
                cropX,
                cropY,
                cropW,
                cropH,
            });
            continue;
        }

        const cropPayload = { pageIndex: i, cropX, cropY, cropW, cropH };
        try {
            const p = doc.getPage(i - 1);
            p.setCropBox?.(cropX, cropY, cropW, cropH);
            p.setMediaBox?.(cropX, cropY, cropW, cropH);
            p.setTrimBox?.(cropX, cropY, cropW, cropH);
            p.setBleedBox?.(cropX, cropY, cropW, cropH);
        } catch (error) {
            console.error("autoTrimPdfByPixels: crop application failed", { ...cropPayload, error });
            throw error;
        }
    }

    return await doc.save();
}
