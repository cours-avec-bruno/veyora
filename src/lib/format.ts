const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const eurRound = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/** 23 € · 6,90 € — decimals only when there are some */
export const price = (n: number) => (Number.isInteger(n) ? eurRound : eur).format(n);

/** 239 € */
export const budget = (n: number) => eurRound.format(n);

/** 12 sept. 2026 */
export const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(iso),
  );

export const days = (n: number) => `${n} jour${n > 1 ? "s" : ""}`;

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}
