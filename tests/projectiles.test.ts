import { describe, it, expect } from 'vitest';
import { ProjectilePool } from '../src/game/projectiles';

describe('projectile pool', () => {
  it('reuses objects', () => {
    const pool = new ProjectilePool(1);
    const a = pool.spawn(0, 0, 1, 0);
    expect(a).not.toBeNull();
    pool.update(() => false); // deactivate
    const b = pool.spawn(0, 0, 1, 0);
    expect(b).toBe(a);
  });
});
