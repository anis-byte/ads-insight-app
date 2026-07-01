export type ParsedCampaignRow = {
  campaignName: string;
  platform: string;
  status: string;
  periodLabel: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpl: number;
  cpa: number;
  roas: number;
  dateStart: string | null;
  dateEnd: string | null;
  rawExtras: Record<string, string>;
};

const aliases = {
  campaignName: ["campaign name", "campaign", "campaign_name", "campaign_name"],
  spend: ["amount spent", "amount spent (usd)", "cost", "cost usd", "spend"],
  impressions: ["impressions", "impr."],
  clicks: ["clicks", "link clicks"],
  conversions: ["conversions", "results", "leads", "purchases", "conv."],
  ctr: ["ctr", "ctr (all)", "link ctr", "click-through rate"],
  cpl: ["cpl", "cost per lead", "cost/result", "cost per result"],
  cpa: ["cpa", "cost per acquisition", "cost / conv.", "cost per conversion"],
  roas: ["roas", "purchase roas", "conv. value / cost"],
  status: ["status", "delivery"],
  dateStart: ["reporting starts", "date start", "start date", "day"],
  dateEnd: ["reporting ends", "date end", "end date", "day"],
};

export function parseAdsCsv(csv: string, platform: string): ParsedCampaignRow[] {
  const rows = parseCsv(csv);
  if (rows.length < 2) throw new Error("No data rows found in this file");

  const [headers, ...dataRows] = rows;
  const normalizedHeaders = headers.map(normalizeHeader);
  const findIndex = (keys: string[]) => normalizedHeaders.findIndex((header) => keys.includes(header));
  const required = {
    campaignName: findIndex(aliases.campaignName),
    spend: findIndex(aliases.spend),
  };

  if (required.campaignName === -1) throw new Error("Required column 'campaign name' not found");
  if (required.spend === -1) throw new Error("Required column 'spend' not found");

  const index = Object.fromEntries(
    Object.entries(aliases).map(([key, values]) => [key, findIndex(values.map(normalizeHeader))]),
  ) as Record<keyof typeof aliases, number>;

  const parsed = dataRows
    .filter((row) => row.some((cell) => cell.trim().length > 0))
    .map((row) => {
      const spend = money(row[index.spend]);
      const impressions = integer(row[index.impressions]);
      const clicks = integer(row[index.clicks]);
      const conversions = integer(row[index.conversions]);
      const ctr = number(row[index.ctr]) || (impressions > 0 ? (clicks / impressions) * 100 : 0);
      const cpa = number(row[index.cpa]) || (conversions > 0 ? spend / conversions : 0);
      const cpl = number(row[index.cpl]) || (conversions > 0 ? spend / conversions : 0);
      const roas = number(row[index.roas]);

      return {
        campaignName: value(row[index.campaignName]) || "Untitled campaign",
        platform,
        status: value(row[index.status]) || "active",
        periodLabel: "This Week",
        spend,
        impressions,
        clicks,
        conversions,
        ctr,
        cpl,
        cpa,
        roas,
        dateStart: dateValue(row[index.dateStart]),
        dateEnd: dateValue(row[index.dateEnd]),
        rawExtras: buildRawExtras(headers, row),
      };
    });

  if (parsed.length === 0) throw new Error("No data rows found in this file");
  return parsed;
}

export function inferDateRange(rows: ParsedCampaignRow[]) {
  const starts = rows.map((row) => row.dateStart).filter(Boolean).sort();
  const ends = rows.map((row) => row.dateEnd).filter(Boolean).sort();
  return {
    start: starts[0] ?? null,
    end: ends[ends.length - 1] ?? starts[starts.length - 1] ?? null,
  };
}

function parseCsv(input: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);
  return rows.filter((line) => line.some((item) => item.trim().length > 0));
}

function normalizeHeader(header: string) {
  return header.trim().toLowerCase().replace(/\s+/g, " ");
}

function value(input: string | undefined) {
  return input?.trim() ?? "";
}

function money(input: string | undefined) {
  return number(input?.replace(/[$,]/g, ""));
}

function integer(input: string | undefined) {
  return Math.round(number(input?.replace(/,/g, "")));
}

function number(input: string | undefined) {
  const parsed = Number.parseFloat(value(input).replace("%", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function dateValue(input: string | undefined) {
  const raw = value(input);
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function buildRawExtras(headers: string[], row: string[]) {
  return headers.reduce<Record<string, string>>((acc, header, index) => {
    acc[header] = row[index] ?? "";
    return acc;
  }, {});
}
