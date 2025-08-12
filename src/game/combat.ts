export interface Combatant {
  stats: { hp: number };
}

const lastHit = new WeakMap<Combatant, number>();
const IFRAME = 300;

/** Apply damage and return true if dead */
export function damage(target: Combatant, amount: number): boolean {
  const now = Date.now();
  const last = lastHit.get(target) ?? 0;
  if (now - last < IFRAME) return false;
  lastHit.set(target, now);
  target.stats.hp -= amount;
  return target.stats.hp <= 0;
}
