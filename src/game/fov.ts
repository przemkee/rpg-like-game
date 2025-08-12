import ROT from 'rot-js';
import type { Grid } from './mapGenerator';

export interface FOVResult {
  visible: Set<string>;
  remembered: Set<string>;
}

/**
 * Compute field of view and update remembered tiles.
 */
export function computeFov(
  grid: Grid,
  origin: { x: number; y: number },
  radius: number,
  remembered: Set<string>,
): FOVResult {
  const fov = new ROT.FOV.PreciseShadowcasting((x, y) => grid[y]?.[x] === 0);
  const visible = new Set<string>();
  fov.compute(origin.x, origin.y, radius, (x, y) => {
    const key = `${x},${y}`;
    visible.add(key);
    remembered.add(key);
  });
  return { visible, remembered };
}
