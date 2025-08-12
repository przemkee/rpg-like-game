import ROT from 'rot-js';

export type Grid = number[][]; // 0 floor, 1 wall

export interface MapGenOpts {
  w: number;
  h: number;
  seed?: string;
  room: [number, number];
  corridor: [number, number];
}

export interface MapGenOut {
  grid: Grid;
  entrance: { x: number; y: number };
  exit: { x: number; y: number };
  seed: string;
}

function strToSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(31, h) + str.charCodeAt(i);
  }
  return h >>> 0;
}

function bfs(
  grid: Grid,
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

export function generate(opts: MapGenOpts): MapGenOut {
  const seed = opts.seed ?? Math.random().toString(36).slice(2);
  ROT.RNG.setSeed(strToSeed(seed));

  const grid: Grid = Array.from({ length: opts.h }, () =>
    Array(opts.w).fill(1),
  );
  const digger = new ROT.Map.Digger(opts.w, opts.h, {
    roomWidth: opts.room,
    roomHeight: opts.room,
    corridorLength: opts.corridor,
  });
  const floors: { x: number; y: number }[] = [];
  digger.create((x, y, value) => {
    grid[y][x] = value === 0 ? 0 : 1;
    if (value === 0) floors.push({ x, y });
  });

  const entrance = floors[0];
  let exit = floors[floors.length - 1];
  // choose farthest floor from entrance
  let maxDist = -1;
  for (const f of floors) {
    const d = Math.abs(f.x - entrance.x) + Math.abs(f.y - entrance.y);
    if (d > maxDist) {
      maxDist = d;
      exit = f;
    }
  }
  if (!bfs(grid, entrance, exit)) {
    // ensure path by carving with A* path
    const path = new ROT.Path.AStar(
      exit.x,
      exit.y,
      (x, y) => grid[y]?.[x] === 0,
      {
        topology: 4,
      },
    );
    path.compute(entrance.x, entrance.y, (x, y) => {
      grid[y][x] = 0;
    });
  }

  return { grid, entrance, exit, seed };
}
