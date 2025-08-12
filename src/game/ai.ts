import { Enemy } from './enemy';
import type { Grid } from './mapGenerator';

function neighbors() {
  return [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
}

function canWalk(grid: Grid, x: number, y: number): boolean {
  return grid[y]?.[x] === 0;
}

export function updateEnemy(
  enemy: Enemy,
  player: { x: number; y: number },
  grid: Grid,
): void {
  const see =
    Math.abs(enemy.gridX - player.x) + Math.abs(enemy.gridY - player.y) < 8;
  enemy.state = see ? 'CHASE' : 'PATROL';
  if (enemy.state === 'PATROL') {
    const opts = neighbors(0, 0)
      .map(([dx, dy]) => [enemy.gridX + dx, enemy.gridY + dy, dx, dy] as const)
      .filter(([x, y]) => canWalk(grid, x, y));
    if (opts.length) {
      const [, , dx, dy] = opts[Math.floor(Math.random() * opts.length)];
      enemy.move(dx, dy, grid);
    }
    return;
  }
  // chase via greedy BFS
  const q: Array<{ x: number; y: number; path: [number, number][] }> = [
    { x: enemy.gridX, y: enemy.gridY, path: [] },
  ];
  const seen = new Set<string>([`${enemy.gridX},${enemy.gridY}`]);
  while (q.length) {
    const n = q.shift()!;
    if (n.x === player.x && n.y === player.y) {
      const step = n.path[0];
      if (step) enemy.move(step[0] - enemy.gridX, step[1] - enemy.gridY, grid);
      return;
    }
    for (const [dx, dy] of neighbors(0, 0)) {
      const nx = n.x + dx;
      const ny = n.y + dy;
      if (!canWalk(grid, nx, ny)) continue;
      const key = `${nx},${ny}`;
      if (seen.has(key)) continue;
      seen.add(key);
      q.push({ x: nx, y: ny, path: [...n.path, [nx, ny]] });
    }
  }
}
