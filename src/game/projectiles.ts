export interface Projectile {
  x: number;
  y: number;
  dx: number;
  dy: number;
  active: boolean;
}

/**
 * Pool of reusable projectiles to avoid GC churn.
 */
export class ProjectilePool {
  private pool: Projectile[] = [];
  private max: number;
  constructor(max = 32) {
    this.max = max;
    for (let i = 0; i < max; i += 1) {
      this.pool.push({ x: 0, y: 0, dx: 0, dy: 0, active: false });
    }
  }

  spawn(x: number, y: number, dx: number, dy: number): Projectile | null {
    const p = this.pool.find((o) => !o.active);
    if (!p) return null;
    p.x = x;
    p.y = y;
    p.dx = dx;
    p.dy = dy;
    p.active = true;
    return p;
  }

  update(step: (p: Projectile) => boolean): void {
    for (const p of this.pool) {
      if (!p.active) continue;
      const alive = step(p);
      if (!alive) {
        p.active = false;
      }
    }
  }

  get active(): Projectile[] {
    return this.pool.filter((p) => p.active);
  }
}
