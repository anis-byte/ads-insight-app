export function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

export function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0));
}

export function formatPercent(value: number | null | undefined) {
  return `${Number(value ?? 0).toFixed(2)}%`;
}

export function formatRatio(value: number | null | undefined) {
  return `${Number(value ?? 0).toFixed(2)}x`;
}

export function formatDateRange(start: string | null, end: string | null) {
  if (!start && !end) return "Date range not set";
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  if (start && end) {
    return `${formatter.format(new Date(`${start}T00:00:00`))} - ${formatter.format(
      new Date(`${end}T00:00:00`),
    )}`;
  }
  return formatter.format(new Date(`${start ?? end}T00:00:00`));
}

export function titleCase(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
