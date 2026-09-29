/**
 * Ariary (MGA) formatting helpers. Madagascar uses the Ariary,
 * conventionally written with a space thousands separator and no decimals.
 */
export function formatAriary(value: number): string {
  const rounded = Math.round(value);
  return `${rounded.toLocaleString('fr-FR')} Ar`;
}

/**
 * Formats a quantity followed by its unit label (e.g. "3 articles").
 */
export function formatItemCount(count: number): string {
  return `${count} ${count > 1 ? 'articles' : 'article'}`;
}
