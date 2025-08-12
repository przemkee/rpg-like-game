export class HUD {
  private hpBar: Phaser.GameObjects.Graphics;
  private text: Phaser.GameObjects.Text;
  private seedText: Phaser.GameObjects.Text;
  private width: number;
  constructor(scene: Phaser.Scene, width: number) {
    this.width = width;
    this.hpBar = scene.add.graphics();
    this.text = scene.add.text(4, 4, '', { fontSize: '8px' }).setDepth(1001);
    this.seedText = scene.add
      .text(width - 4, 4, '', { fontSize: '8px' })
      .setOrigin(1, 0)
      .setDepth(1001);
  }

  update(
    hp: number,
    depth: number,
    auto: boolean,
    seed: string,
    showSeed: boolean,
  ): void {
    this.hpBar.clear();
    this.hpBar.fillStyle(0xff0000);
    this.hpBar.fillRect(4, 16, hp * 10, 4);
    this.hpBar.setDepth(1001);
    this.text.setText(`Lv ${depth} ${auto ? 'AUTO' : 'SPACE'}`);
    this.seedText.setText(showSeed ? `seed:${seed}` : '');
  }
}
