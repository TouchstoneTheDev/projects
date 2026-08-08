export type SeverityLevel = 'Best' | 'Flagged' | 'Critical';

/**
 * Part 5: Score Severity Flagging
 * Evaluates accessibility scores to prioritize outreach.
 * Note: Lighthouse natively scores 0-100; if score > 10, divide by 10 first (e.g., 85 -> 8.5)
 * so every company is not misread as "Critical".
 */
export function normalizeScore(score: number): number {
  if (score > 10) {
    return score / 10;
  }
  return score;
}

export function severityFlag(score: number): SeverityLevel {
  const norm = normalizeScore(score);
  if (norm >= 8) return 'Best';
  if (norm > 6) return 'Flagged';
  return 'Critical';
}

/**
 * Sorts company records for InfoHarvester queue, putting "Critical" companies first.
 */
export function sortBySeverityPriority<T extends { lhScore?: number; waveScore?: number }>(items: T[]): T[] {
  const order: Record<SeverityLevel, number> = {
    'Critical': 1,
    'Flagged': 2,
    'Best': 3,
  };

  return [...items].sort((a, b) => {
    const scoreA = a.lhScore !== undefined ? a.lhScore : (a.waveScore || 0);
    const scoreB = b.lhScore !== undefined ? b.lhScore : (b.waveScore || 0);
    const flagA = severityFlag(scoreA);
    const flagB = severityFlag(scoreB);
    return order[flagA] - order[flagB];
  });
}
