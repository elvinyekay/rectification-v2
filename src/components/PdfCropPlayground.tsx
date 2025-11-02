import React, { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { autoTrimPdfByText } from "../utils/pdfTrim";
import { cropFirstPageFixedMargin } from "../utils/pdfFixedCrop";

export default function PdfCropPlayground() {
    const [, setOrigUrl] = useState<string | null>(null);
    const [outUrl, setOutUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileRef = useRef<File | null>(null);

    const handlePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        if (!f) return;
        fileRef.current = f;
        const url = URL.createObjectURL(f);
        setOrigUrl(url);
        setOutUrl(null);
        // ilkin olaraq 1-ci səhifəni göstər
        await renderFirstPageToCanvas(f, canvasRef.current!);
    };

    const doAutoTrim = async () => {
        if (!fileRef.current) return;
        const out = await autoTrimPdfByText(fileRef.current, 18);
        const blob = new Blob([out], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setOutUrl(url);
        await renderFirstPageToCanvas(blob, canvasRef.current!);
    };

    const doFixedCrop = async () => {
        if (!fileRef.current) return;
        const out = await cropFirstPageFixedMargin(fileRef.current, 40);
        const blob = new Blob([out], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setOutUrl(url);
        await renderFirstPageToCanvas(blob, canvasRef.current!);
    };

    const downloadOut = () => {
        if (!outUrl) return;
        const a = document.createElement("a");
        a.href = outUrl;
        a.download = "cropped.pdf";
        a.click();
    };

    return (
        <div style={{ padding: 12 }}>
            <h3>PDF Crop — 1 səhifəlik preview</h3>
            <input type="file" accept="application/pdf" onChange={handlePick} />
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button onClick={doAutoTrim} disabled={!fileRef.current}>Auto-trim (by text)</button>
                <button onClick={doFixedCrop} disabled={!fileRef.current}>Fixed crop (40pt, p1)</button>
                <button onClick={downloadOut} disabled={!outUrl}>Download result</button>
            </div>

            <div style={{ marginTop: 12 }}>
                <canvas ref={canvasRef} style={{ width: "100%", maxWidth: 800, border: "1px solid #e5e7eb" }} />
            </div>
        </div>
    );
}

/** PDF-in 1-ci səhifəsini canvas-a render edir (sürətli preview). */
async function renderFirstPageToCanvas(
    fileOrBlob: File | Blob,
    canvas: HTMLCanvasElement
) {
    const buf = await fileOrBlob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 }); // lazım olsa dəyiş
    const ctx = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx as any, viewport }).promise;
}
