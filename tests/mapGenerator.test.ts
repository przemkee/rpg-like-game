import { describe, it, expect } from 'vitest';
import { generate } from '../src/game/mapGenerator';

function bfs(
  grid: number[][],
  start: { x: number; y: number },
  goal: { x: number; y: number },
): boolean {
  const q: { x: number; y: number }[] = [start];
  const visited = new Set<string>([`${start.x},${start.y}`]);
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  while (q.length) {
    const { x, y } = q.shift()!;
    if (x === goal.x && y === goal.y) return true;
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (grid[ny]?.[nx] !== 0) continue;
      const key = `${nx},${ny}`;
      if (visited.has(key)) continue;
      visited.add(key);
      q.push({ x: nx, y: ny });
    }
  }
  return false;
}

describe('map generator', () => {
  it('ensures path from entrance to exit', () => {
    const out = generate({
      w: 20,
      h: 20,
      seed: 'a',
      room: [3, 5],
      corridor: [2, 4],
    });
    expect(bfs(out.grid, out.entrance, out.exit)).toBe(true);
  });
});
