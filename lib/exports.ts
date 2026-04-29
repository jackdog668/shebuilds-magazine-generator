/**
 * Export utilities. Three formats:
 *   - SVG: vector, infinite scale, smallest file
 *   - PNG: raster @ 300 DPI, suitable for web/social/print
 *   - PDF: KDP-ready 8.5×11 inches @ 300 DPI (2550×3300 px embedded PNG)
 *
 * All exports are client-side: no server, no upload, no tracking.
 */

import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

const KDP_WIDTH_IN = 8.5;
const KDP_HEIGHT_IN = 11;
const KDP_DPI = 300;
export const KDP_PIXEL_W = KDP_WIDTH_IN * KDP_DPI;   // 2550
export const KDP_PIXEL_H = KDP_HEIGHT_IN * KDP_DPI;  // 3300
const KDP_POINTS_W = KDP_WIDTH_IN * 72;              // 612
const KDP_POINTS_H = KDP_HEIGHT_IN * 72;             // 792

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

export function downloadSVG(svgString: string, baseName = "shebuilds-pattern"): void {
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  saveAs(blob, `${baseName}-${timestamp()}.svg`);
}

/** Rasterize SVG markup to a PNG Blob at given pixel dimensions. */
export async function svgToPNG(
  svgString: string,
  width: number,
  height: number
): Promise<Blob> {
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("canvas.toBlob returned null"))),
        "image/png"
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load SVG into image"));
    img.src = src;
  });
}

export async function downloadPNG(
  svgString: string,
  width: number,
  height: number,
  baseName = "shebuilds-pattern"
): Promise<void> {
  const blob = await svgToPNG(svgString, width, height);
  saveAs(blob, `${baseName}-${timestamp()}.png`);
}

/** KDP-ready PDF: 8.5×11 inches @ 300dpi PNG embedded. */
export async function downloadKDPpdf(
  svgString: string,
  baseName = "shebuilds-pattern"
): Promise<void> {
  const pngBlob = await svgToPNG(svgString, KDP_PIXEL_W, KDP_PIXEL_H);
  const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle("SheBuilds Pattern (KDP-ready)");
  pdfDoc.setProducer("SheBuilds Pattern Generator");
  pdfDoc.setCreator("SheBuilds Digital");

  const page = pdfDoc.addPage([KDP_POINTS_W, KDP_POINTS_H]);
  const png = await pdfDoc.embedPng(pngBytes);
  page.drawImage(png, {
    x: 0,
    y: 0,
    width: KDP_POINTS_W,
    height: KDP_POINTS_H,
  });

  const pdfBytes = await pdfDoc.save();
  // Convert Uint8Array to ArrayBuffer slice for Blob constructor
  const ab = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength
  ) as ArrayBuffer;
  const blob = new Blob([ab], { type: "application/pdf" });
  saveAs(blob, `${baseName}-kdp-${timestamp()}.pdf`);
}
