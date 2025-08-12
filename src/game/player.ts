export interface PlayerStats {
  hp: number;
  fireRate: number;
  speed: number; // ms per tile
}

export class Player extends Phaser.GameObjects.Sprite {
  stats: PlayerStats = { hp: 5, fireRate: 300, speed: 120 };
  gridX: number;
  gridY: number;
  dir = { x: 1, y: 0 };
  private moving = false;
  private buffer: { x: number; y: number }[] = [];
  private tile: number;
  constructor(scene: Phaser.Scene, x: number, y: number, tile: number) {
    super(scene, x * tile, y * tile, 'pixel');
    this.tile = tile;
    this.gridX = x;
    this.gridY = y;
    this.setOrigin(0, 0).setTint(0x00aaff);
    scene.add.existing(this);
  }

  /** queue a move */
  move(dx: number, dy: number, grid: number[][]): void {
    if (dx === 0 && dy === 0) return;
    if (this.moving) {
      if (this.buffer.length < 2) this.buffer.push({ x: dx, y: dy });
      return;
    }
    const nx = this.gridX + dx;
    const ny = this.gridY + dy;
    if (grid[ny]?.[nx] !== 0) return;
    this.dir = { x: dx, y: dy };
    this.moving = true;
    this.gridX = nx;
    this.gridY = ny;
    this.scene.tweens.add({
      targets: this,
      x: nx * this.tile,
      y: ny * this.tile,
      duration: this.stats.speed,
      onComplete: () => {
        this.moving = false;
        const next = this.buffer.shift();
        if (next) this.move(next.x, next.y, grid);
      },
    });
  }
}
