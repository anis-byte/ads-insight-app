import Link from "next/link";
import { UploadForm } from "./UploadForm";

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#171914]">
      <header className="border-b border-[#dfe3d7] bg-white">
        <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8">
          <Link href="/" className="text-sm font-medium text-[#1f5e4b] hover:underline">
            Back to reports
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">Upload CSV</h1>
          <p className="mt-2 text-sm leading-6 text-[#66705f]">
            Upload an ads export and the app will create a report, parse campaign
            metrics, and open the finished analysis.
          </p>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <UploadForm />
      </section>
    </main>
  );
}
