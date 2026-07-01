"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function UploadForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [platform, setPlatform] = useState("meta");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function submit() {
    setError("");
    if (!file) {
      setError("Please upload a .csv file");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a .csv file");
      return;
    }

    setIsUploading(true);
    const body = new FormData();
    body.set("platform", platform);
    body.set("file", file);

    const response = await fetch("/api/reports/upload", { method: "POST", body });
    const payload = (await response.json()) as { reportId?: string; error?: string };
    setIsUploading(false);

    if (!response.ok || !payload.reportId) {
      setError(payload.error ?? "Upload failed");
      return;
    }

    router.push(`/reports/${payload.reportId}`);
    router.refresh();
  }

  return (
    <div className="rounded-md border border-[#dfe3d7] bg-white p-5">
      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold">Platform</label>
        <div className="grid grid-cols-3 gap-2">
          {["meta", "google", "other"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPlatform(option)}
              className={`min-h-10 rounded-md border px-3 text-sm font-semibold ${
                platform === option
                  ? "border-[#1f5e4b] bg-[#edf5ef] text-[#1f5e4b]"
                  : "border-[#c9d0c2] bg-white text-[#263021]"
              }`}
            >
              {option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          setFile(event.dataTransfer.files[0] ?? null);
        }}
        className="flex min-h-56 w-full flex-col items-center justify-center rounded-md border border-dashed border-[#aeb8a6] bg-[#f9fbf7] px-4 text-center transition hover:bg-[#f4f7f1]"
      >
        <span className="text-base font-semibold">
          {file ? file.name : "Drop a CSV here or choose a file"}
        </span>
        <span className="mt-2 text-sm text-[#66705f]">
          Meta Ads and Google Ads exports are supported.
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />

      {error ? (
        <p className="mt-4 rounded-md border border-[#e5b8a8] bg-[#fff5f1] px-3 py-2 text-sm font-medium text-[#8b2c14]">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={submit}
        disabled={isUploading}
        className="mt-5 min-h-11 w-full rounded-md bg-[#1f5e4b] px-4 text-sm font-semibold text-white transition hover:bg-[#174838] disabled:cursor-wait disabled:bg-[#8aa99d]"
      >
        {isUploading ? "Processing CSV..." : "Upload and Build Report"}
      </button>
    </div>
  );
}
