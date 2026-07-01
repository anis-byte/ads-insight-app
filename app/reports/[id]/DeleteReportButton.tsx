"use client";

export function DeleteReportButton({ reportName }: { reportName: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        const confirmed = window.confirm(`Delete "${reportName}" and all campaign data?`);
        if (!confirmed) event.preventDefault();
      }}
      className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#e0b7a9] bg-white px-3 text-sm font-semibold text-[#8b2c14] hover:bg-[#fff5f1]"
    >
      Delete
    </button>
  );
}
