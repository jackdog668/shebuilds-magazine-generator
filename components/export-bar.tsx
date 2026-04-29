"use client";

import { useState } from "react";
import { Download, FileText, Image as ImageIcon, Link2, Check } from "lucide-react";
import { buildSVG } from "@/lib/patterns/engine";
import {
  downloadKDPpdf,
  downloadPNG,
  downloadSVG,
  KDP_PIXEL_W,
  KDP_PIXEL_H,
} from "@/lib/exports";
import { encodeState } from "@/lib/patterns/url-state";
import type { PatternState } from "@/lib/patterns/types";
import { BrandButton } from "./brand-button";

interface Props {
  state: PatternState;
}

type Status = "idle" | "working" | "done" | "error";

export function ExportBar({ state }: Props) {
  const [svgStatus, setSvgStatus] = useState<Status>("idle");
  const [pngStatus, setPngStatus] = useState<Status>("idle");
  const [pdfStatus, setPdfStatus] = useState<Status>("idle");
  const [shareStatus, setShareStatus] = useState<Status>("idle");

  async function withStatus(
    setter: (s: Status) => void,
    fn: () => Promise<void> | void
  ) {
    setter("working");
    try {
      await fn();
      setter("done");
      setTimeout(() => setter("idle"), 1600);
    } catch (e) {
      console.error(e);
      setter("error");
      setTimeout(() => setter("idle"), 2400);
    }
  }

  const handleSVG = () =>
    withStatus(setSvgStatus, () => {
      const svg = buildSVG(state, { width: 1200, height: 1200 });
      downloadSVG(svg);
    });

  const handlePNG = () =>
    withStatus(setPngStatus, async () => {
      const svg = buildSVG(state, { width: 2400, height: 2400 });
      await downloadPNG(svg, 2400, 2400);
    });

  const handlePDF = () =>
    withStatus(setPdfStatus, async () => {
      const svg = buildSVG(state, { width: KDP_PIXEL_W, height: KDP_PIXEL_H });
      await downloadKDPpdf(svg);
    });

  const handleShare = () =>
    withStatus(setShareStatus, async () => {
      const url = `${window.location.origin}${window.location.pathname}?${encodeState(state)}`;
      // Update URL without navigation
      window.history.replaceState({}, "", `?${encodeState(state)}`);
      await navigator.clipboard.writeText(url);
    });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <BrandButton variant="gold" onClick={handlePDF} disabled={pdfStatus === "working"}>
        <Status status={pdfStatus} icon={<FileText className="h-4 w-4" />} idleLabel="KDP PDF" />
      </BrandButton>

      <BrandButton variant="outline" onClick={handlePNG} disabled={pngStatus === "working"}>
        <Status status={pngStatus} icon={<ImageIcon className="h-4 w-4" />} idleLabel="PNG · 2400" />
      </BrandButton>

      <BrandButton variant="outline" onClick={handleSVG} disabled={svgStatus === "working"}>
        <Status status={svgStatus} icon={<Download className="h-4 w-4" />} idleLabel="SVG" />
      </BrandButton>

      <BrandButton variant="ghost" onClick={handleShare} disabled={shareStatus === "working"}>
        <Status status={shareStatus} icon={<Link2 className="h-4 w-4" />} idleLabel="Copy link" doneLabel="Copied" />
      </BrandButton>
    </div>
  );
}

function Status({
  status,
  icon,
  idleLabel,
  doneLabel = "Saved",
}: {
  status: Status;
  icon: React.ReactNode;
  idleLabel: string;
  doneLabel?: string;
}) {
  if (status === "working") {
    return (
      <>
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <span>Working…</span>
      </>
    );
  }
  if (status === "done") {
    return (
      <>
        <Check className="h-4 w-4" />
        <span>{doneLabel}</span>
      </>
    );
  }
  if (status === "error") {
    return (
      <>
        {icon}
        <span>Try again</span>
      </>
    );
  }
  return (
    <>
      {icon}
      <span>{idleLabel}</span>
    </>
  );
}
