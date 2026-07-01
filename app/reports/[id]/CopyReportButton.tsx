"use client";

import { useState } from "react";

export function CopyReportButton({ narrative }: { narrative: string }) {
  const [copied, setCopied] = useState(false);

  async function copyReport() {
    await navigator.clipboard.writeText(narrative);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copyReport}
      className="mt-3 w-full rounded-md border border-[#c9d0c2] bg-white px-3 py-2 text-sm font-semibold text-[#263021] transition hover:bg-[#f4f7f1]"
    >
      {copied ? "Copied" : "Copy Report"}
    </button>
  );
}
