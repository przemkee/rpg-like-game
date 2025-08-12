import { generate, MapGenOut } from './mapGenerator';
import type { EnemyType } from './enemy';

export interface LevelState {
  map: MapGenOut;
  depth: number;
  enemies: { type: EnemyType; x: number; y: number }[];
}

function hash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i += 1)
    h = Math.imul(31, h) + str.charCodeAt(i);
  return Math.abs(h).toString(36);
}

export class LevelGenerator {
  private seed: string;
  constructor(seed: string) {
    this.seed = seed;
  }

  next(depth: number): LevelState {
    const seed = hash(this.seed + depth);
    const map = generate({
      w: 60,
      h: 34,
      seed,
      room: [3, 7],
      corridor: [2, 6],
    });
    const floors = map.grid
      .flatMap((row, y) => row.map((v, x) => ({ v, x, y })))
      .filter((c) => c.v === 0);
    const enemies: LevelState['enemies'] = [];
    const count = 3 + depth;
    for (let i = 0; i < count; i += 1) {
      const type: EnemyType = i % 2 === 0 ? 'rat' : 'slime';
      const cell = floors[Math.floor(Math.random() * floors.length)];
      enemies.push({ type, x: cell.x, y: cell.y });
    }
    this.seed = seed;
    return { map, depth, enemies };
  }
}
