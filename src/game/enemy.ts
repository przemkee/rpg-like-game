export type EnemyType = 'rat' | 'slime';

export interface EnemyStats {
  hp: number;
  speed: number;
}

export class Enemy extends Phaser.GameObjects.Sprite {
  type: EnemyType;
  stats: EnemyStats;
  gridX: number;
  gridY: number;
  state: 'PATROL' | 'CHASE' = 'PATROL';
  private moving = false;
  private tile: number;
  constructor(
    scene: Phaser.Scene,
    type: EnemyType,
    x: number,
    y: number,
    tile: number,
  ) {
    super(scene, x * tile, y * tile, 'pixel');
    this.tile = tile;
    this.type = type;
    this.gridX = x;
    this.gridY = y;
    this.stats = type === 'rat' ? { hp: 2, speed: 100 } : { hp: 4, speed: 200 };
    const tint = type === 'rat' ? 0x888888 : 0x00ff00;
    this.setOrigin(0, 0).setTint(tint);
    scene.add.existing(this);
  }

  move(dx: number, dy: number, grid: number[][]): void {
    if (this.moving) return;
    const nx = this.gridX + dx;
    const ny = this.gridY + dy;
    if (grid[ny]?.[nx] !== 0) return;
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
      },
    });
  }
}
