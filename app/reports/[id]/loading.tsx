export default function LoadingReport() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] px-5 py-8 text-[#171914] sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-28 animate-pulse rounded-md bg-white" />
        <div className="grid gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-md bg-white" />
          ))}
        </div>
        <div className="h-[420px] animate-pulse rounded-md bg-white" />
      </div>
    </main>
  );
}
