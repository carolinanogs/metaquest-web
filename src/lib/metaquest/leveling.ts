// Cumulative XP required to *reach* each level
const BASE_LEVELS = [0, 100, 250, 500, 850];

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level <= BASE_LEVELS.length) return BASE_LEVELS[level - 1];
  return BASE_LEVELS[BASE_LEVELS.length - 1] + (level - BASE_LEVELS.length) * 400;
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  return level;
}

export function levelProgress(xp: number) {
  const level = levelFromXp(xp);
  const current = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const into = xp - current;
  const span = next - current;
  return {
    level,
    currentLevelXp: current,
    nextLevelXp: next,
    into,
    span,
    pct: Math.min(100, Math.round((into / span) * 100)),
  };
}
