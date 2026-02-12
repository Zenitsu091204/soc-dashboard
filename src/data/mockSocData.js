/**
 * Data sources start empty so you can plug in
 * real SOC feeds later (SIEM, TI, etc.).
 */

export const iocs = [];

export const threatActors = [];

export const alerts = [];

export function formatUtc(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function matchesText(haystack, query) {
  if (!query) return true;
  return String(haystack).toLowerCase().includes(query.trim().toLowerCase());
}

