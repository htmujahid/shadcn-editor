const entries: [string, string][] = [
  ["Ada", "#e11d48"],
  ["Grace", "#7c3aed"],
  ["Alan", "#2563eb"],
  ["Edsger", "#0d9488"],
  ["Barbara", "#b45309"],
  ["Donald", "#ea580c"],
  ["Margaret", "#16a34a"],
  ["Linus", "#db2777"],
];

export interface UserProfile {
  name: string;
  color: string;
}

/**
 * Picks a random profile. When a `group` is given, each group draws from a
 * disjoint half of the pool so the two embedded iframes never collide on the
 * same name.
 */
export function getRandomUserProfile(group?: number): UserProfile {
  const half = Math.floor(entries.length / 2);
  const pool =
    group === undefined
      ? entries
      : group % 2 === 0
        ? entries.slice(0, half)
        : entries.slice(half);
  const entry = pool[Math.floor(Math.random() * pool.length)];
  return {
    color: entry[1],
    name: entry[0],
  };
}
