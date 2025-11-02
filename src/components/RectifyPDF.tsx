import React, { useEffect, useRef, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { autoTrimPdfByText } from "../utils/pdfTrim";

type Rect = { x: number; y: number; w: number; h: number };
type PageBox = Rect | null;

export default function RectifyPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [pdfURL, setPdfURL] = useState<string | null>(null);
    const [, setPageSizes] = useState<{ w: number; h: number }[]>([]);
    const [boxes, setBoxes] = useState<PageBox[]>([]); // per page selection (rendered px-də)
    const [pageCount, setPageCount] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // PDF yüklənəndə ölçüləri oxu
    useEffect(() => {
        if (!file) return;
        (async () => {
            const buf = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
            setPageCount(pdf.numPages);

            const sizes: { w: number; h: number }[] = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const vp = page.getViewport({ scale: 1 });
                sizes.push({ w: vp.width, h: vp.height });
            }
            setPageSizes(sizes);
            setBoxes(Array(pdf.numPages).fill(null));

            const url = URL.createObjectURL(file);
            setPdfURL(url);
            return () => URL.revokeObjectURL(url);
        })();
    }, [file]);

    const onChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        if (f) setFile(f);
    };

    // Auto-trim düyməsi
    const handleAutoTrim = async () => {
        if (!file) return;
        const trimmed = await autoTrimPdfByText(file, 18);
        downloadBlob(new Blob([trimmed], { type: "application/pdf" }), "auto_trimmed.pdf");
    };

    // Manual seçimi tətbiq et (boxes -> crop)
    const handleApplyManual = async () => {
        if (!file) return;
        const buf = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        const doc = await PDFDocument.load(buf);
        const pages = doc.getPages();

        // Hər səhifədə: rendered px -> PDF pt miqyası
        for (let i = 0; i < pages.length; i++) {
            const sel = boxes[i];
            if (!sel) continue;

            const page = await pdf.getPage(i + 1);
            const vp = page.getViewport({ scale: 1 });
            // Viewer-dəki real render ölçüsü ilə PDF pt arasında skala fərqi ola bilər.
            // Biz overlay qutusunu "rendered px" kimi saxlayırıq.
            // @react-pdf-viewer standartda səhifəni konteyner eninə sığdırır.
            // Ona görə ölçünü DOM-dan oxuyaq:
            const pageDiv = document.querySelector(`[data-page-number="${i + 1}"] .rpv-core__canvas-layer canvas`) as HTMLCanvasElement | null;

            if (!pageDiv) continue;
            const renderedW = pageDiv.width;  // canvas px
            const renderedH = pageDiv.height;

            if (!renderedW || !renderedH) {
                console.warn(`Skipping crop for page ${i + 1}: canvas has zero size`, {
                    renderedW,
                    renderedH,
                });
                continue;
            }

            const scaleX = vp.width / renderedW;
            const scaleY = vp.height / renderedH;

            if (!Number.isFinite(scaleX) || !Number.isFinite(scaleY)) {
                console.warn(`Skipping crop for page ${i + 1}: invalid scale`, {
                    scaleX,
                    scaleY,
                });
                continue;
            }

            // Seçilən qutunu PDF pt-ə çevir
            const selectionValues = [sel.x, sel.y, sel.w, sel.h];
            if (selectionValues.some((v) => !Number.isFinite(v))) {
                console.warn(`Skipping crop for page ${i + 1}: invalid selection`, sel);
                continue;
            }

            const xPt = sel.x * scaleX;
            // PDF koordinatı alt soldan başlayır; canvas isə üst soldan.
            const yPtFromTop = sel.y * scaleY;
            const hPt = sel.h * scaleY;
            const yPt = vp.height - (yPtFromTop + hPt);
            const wPt = sel.w * scaleX;

            // Sərhədlər
            const cx = clamp(xPt, 0, vp.width - 10);
            const cy = clamp(yPt, 0, vp.height - 10);
            const cw = clamp(wPt, 10, vp.width - cx);
            const ch = clamp(hPt, 10, vp.height - cy);

            pages[i].setCropBox(cx, cy, cw, ch);
        }

        const out = await doc.save();
        downloadBlob(new Blob([out], { type: "application/pdf" }), "manual_cropped.pdf");
    };

    return (
        <div className="p-4 space-y-3">
            <h2 className="font-semibold text-lg">Rectification • OCR hazır, frontend crop</h2>

            <div className="flex gap-2 items-center">
                <input type="file" accept="application/pdf" onChange={onChooseFile} />
                <button onClick={handleAutoTrim} disabled={!file} className="px-3 py-2 border rounded">
                    Auto-trim (by text)
                </button>
                <button onClick={handleApplyManual} disabled={!file} className="px-3 py-2 border rounded">
                    Apply manual crop
                </button>
            </div>

            {pdfURL && (
                <div ref={containerRef} style={{ height: "80vh", border: "1px solid #e5e7eb", position: "relative" }}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer
                            fileUrl={pdfURL}
                            // data-page-number atributunu DOM-da saxlayır; overlay-ləri həmin DOM üstündə çəkəcəyik.
                        />
                    </Worker>

                    {/* Overlay: sadə bir seçim üçün yalnız aktiv səhifəyə qutu çəkə bilərsən.
              Aşağıda çox səhifə/çox overlay üçün nümunə – querySelectorAll ilə hər səhifə üçün layer qoyuruq. */}
                    <OverlayGrid
                        pageCount={pageCount}
                        boxes={boxes}
                        setBoxes={setBoxes}
                    />
                </div>
            )}
        </div>
    );
}

// Sadə overlay grid: hər səhifə üçün canvas üzərinə absolüt div-lə resizable/draggable qutu.
// Burada minimal drag logic verdim; istəsən react-rnd kimi paketlə də edə bilərsən.
function OverlayGrid({
                         pageCount,
                         boxes,
                         setBoxes,
                     }: {
    pageCount: number;
    boxes: (Rect | null)[];
    setBoxes: React.Dispatch<React.SetStateAction<(Rect | null)[]>>;
}) {
    useEffect(() => {
        // Hər səhifə containerını tapırıq
        for (let i = 1; i <= pageCount; i++) {
            const pageHost = document.querySelector(`[data-page-number="${i}"] .rpv-core__page-layer`) as HTMLDivElement | null;
            if (!pageHost) continue;

            // overlay layer əlavə et (əgər yoxdursa)
            let overlay = pageHost.querySelector<HTMLDivElement>(".overlay-crop-layer");
            if (!overlay) {
                overlay = document.createElement("div");
                overlay.className = "overlay-crop-layer";
                overlay.style.position = "absolute";
                overlay.style.left = "0";
                overlay.style.top = "0";
                overlay.style.right = "0";
                overlay.style.bottom = "0";
                overlay.style.pointerEvents = "none";
                pageHost.appendChild(overlay);

                // Mouse ilə seçim üçün sadə logic
                let startX = 0, startY = 0, active = false;

                overlay.addEventListener("mousedown", (e) => {
                    active = true;
                    const rect = pageHost.getBoundingClientRect();
                    startX = e.clientX - rect.left;
                    startY = e.clientY - rect.top;
                    setBoxes((prev) => {
                        const copy = [...prev];
                        copy[i - 1] = { x: startX, y: startY, w: 0, h: 0 };
                        return copy;
                    });
                });

                overlay.addEventListener("mousemove", (e) => {
                    if (!active) return;
                    const rect = pageHost.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const w = Math.max(0, x - startX);
                    const h = Math.max(0, y - startY);
                    setBoxes((prev) => {
                        const copy = [...prev];
                        copy[i - 1] = { x: startX, y: startY, w, h };
                        return copy;
                    });
                });

                overlay.addEventListener("mouseup", () => {
                    active = false;
                });
                overlay.addEventListener("mouseleave", () => {
                    active = false;
                });
            }
        }
    }, [pageCount, setBoxes]);

    // Vizual qutuları render et (pointer-events: none; yalnız görünüş)
    useEffect(() => {
        for (let i = 1; i <= pageCount; i++) {
            const pageHost = document.querySelector(`[data-page-number="${i}"] .rpv-core__page-layer`) as HTMLDivElement | null;
            const overlay = pageHost?.querySelector<HTMLDivElement>(".overlay-crop-layer");
            if (!overlay) continue;

            // Mövcud box divini sil–yarat
            let boxDiv = overlay.querySelector<HTMLDivElement>(".overlay-box");
            if (!boxDiv) {
                boxDiv = document.createElement("div");
                boxDiv.className = "overlay-box";
                boxDiv.style.position = "absolute";
                boxDiv.style.border = "2px dashed #10b981";
                boxDiv.style.background = "rgba(16,185,129,0.08)";
                boxDiv.style.pointerEvents = "none";
                overlay.appendChild(boxDiv);
            }
            const b = boxes[i - 1];
            if (!b) {
                boxDiv.style.display = "none";
            } else {
                boxDiv.style.display = "block";
                boxDiv.style.left = `${b.x}px`;
                boxDiv.style.top = `${b.y}px`;
                boxDiv.style.width = `${b.w}px`;
                boxDiv.style.height = `${b.h}px`;
            }
        }
    }, [boxes, pageCount]);

    return null;
}

function downloadBlob(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
}

function clamp(v: number, min: number, max: number) {
    return Math.min(max, Math.max(min, v));
}
