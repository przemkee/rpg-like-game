import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  private fogEnabled = true;
  private fogText!: Phaser.GameObjects.Text;

  constructor() {
    super('menu');
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 20, 'New Game', { fontSize: '16px' })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerup', () => {
        this.scene.start('game', { fog: this.fogEnabled });
      });

    this.fogText = this.add
      .text(width / 2, height / 2 + 20, 'Fog: ON', { fontSize: '16px' })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerup', () => {
        this.fogEnabled = !this.fogEnabled;
        this.fogText.setText(`Fog: ${this.fogEnabled ? 'ON' : 'OFF'}`);
      });
  }
}
