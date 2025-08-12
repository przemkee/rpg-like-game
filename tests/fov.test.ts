import { describe, it, expect } from 'vitest';
import { computeFov } from '../src/game/fov';

const grid = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];

describe('fov', () => {
  it('includes player position', () => {
    const res = computeFov(grid, { x: 1, y: 1 }, 5, new Set());
    expect(res.visible.has('1,1')).toBe(true);
  });
});
