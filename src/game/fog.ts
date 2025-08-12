export class FogOfWar {
  private rt: Phaser.GameObjects.RenderTexture;
  private tile: number;
  private width: number;
  private height: number;

  constructor(scene: Phaser.Scene, w: number, h: number, tile: number) {
    this.tile = tile;
    this.width = w;
    this.height = h;
    this.rt = scene.add
      .renderTexture(0, 0, w * tile, h * tile)
      .setOrigin(0, 0)
      .setDepth(1000);
  }

  draw(visible: Set<string>, remembered: Set<string>): void {
    this.rt.clear();
    this.rt.fill(0x000000, 1);

    const g = this.rt.scene.add.graphics();
    g.fillStyle(0x000000, 0.6);
    for (const key of remembered) {
      if (visible.has(key)) continue;
      const [x, y] = key.split(',').map(Number);
      g.fillRect(x * this.tile, y * this.tile, this.tile, this.tile);
    }
    this.rt.draw(g);
    g.clear();

    const gv = this.rt.scene.add.graphics();
    gv.fillStyle(0xffffff, 1);
    for (const key of visible) {
      const [x, y] = key.split(',').map(Number);
      gv.fillRect(x * this.tile, y * this.tile, this.tile, this.tile);
    }
    this.rt.erase(gv);
    gv.destroy();
    g.destroy();
  }
}
