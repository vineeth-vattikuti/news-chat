const FILLER_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with',
  'what', 'whats', 'is', 'are', 'was', 'were', 'be', 'about', 'new'
]);

export function normalizeToTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // strip punctuation
    .split(/\s+/)
    .filter(t => t.length > 1 && !FILLER_WORDS.has(t));
}

export function simpleScore(content: string, queryTokens: string[]): number {
  // Count token occurrences in content (very naive)
  const hay = content.toLowerCase();
  let score = 0;
  for (const t of queryTokens) {
    if (hay.includes(t)) score += 1;
  }
  return score;
}
