import React, { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
// import { autoTrimPdfByText } from "../../../utils/pdfTrim.ts";
import { autoTrimPdfByPixels } from "../../..//utils/pdfAutoTrimPixels";

export default function AutoTrimPage() {
    const [file, setFile] = useState<File | null>(null);
    const [srcUrl, setSrcUrl] = useState<string | null>(null);
    const [outUrl, setOutUrl] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState<string | null>(null);



    useEffect(() => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setSrcUrl(url);
        setOutUrl(null);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErr(null);
        const f = e.target.files?.[0] || null;
        setFile(f);
    };

    const runAutoTrim = async () => {
        if (!file) return;
        try {
            setBusy(true);
            setErr(null);
            const bytes = await autoTrimPdfByPixels(file, 12, 1.4);
            const blob = new Blob([bytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            if (outUrl) URL.revokeObjectURL(outUrl);
            setOutUrl(url);
        } catch (e: unknown) {
            if (e instanceof Error) setErr(e.message);
            else setErr(String(e));
        } finally {
            setBusy(false);
        }
    };

    const download = () => {
        if (!outUrl) return;
        const a = document.createElement("a");
        a.href = outUrl;
        a.download = "auto_trimmed.pdf";
        a.click();
    };

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Auto-trim (by text)</h2>

            <div className="flex items-center gap-3">
                <input type="file" accept="application/pdf" onChange={onPick} />
                <button
                    className="px-3 py-2 border rounded"
                    onClick={runAutoTrim}
                    disabled={!file || busy}
                >
                    {busy ? "Processing..." : "Auto-trim"}
                </button>
                <button
                    className="px-3 py-2 border rounded"
                    onClick={download}
                    disabled={!outUrl}
                >
                    Download result
                </button>
                {err && <span className="text-red-600 text-sm">{err}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[78vh]">
                <div className="border rounded overflow-hidden">
                    <div className="px-3 py-2 text-sm bg-gray-50 border-b">Original</div>
                    <div className="h-[72vh]">
                        {srcUrl ? (
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                <Viewer fileUrl={srcUrl} />
                            </Worker>
                        ) : (
                            <EmptyHint />
                        )}
                    </div>
                </div>

                <div className="border rounded overflow-hidden">
                    <div className="px-3 py-2 text-sm bg-gray-50 border-b">Auto-trimmed</div>
                    <div className="h-[72vh]">
                        {outUrl ? (
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                <Viewer fileUrl={outUrl} />
                            </Worker>
                        ) : (
                            <EmptyHint text="Nəticə hələ yoxdur — Auto-trim bas." />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function EmptyHint({ text = "PDF seçin." }: { text?: string }) {
    return (
        <div className="h-full grid place-items-center text-sm text-gray-500">
            {text}
        </div>
    );
}
