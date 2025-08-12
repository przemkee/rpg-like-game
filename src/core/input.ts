export class Input {
  private keys: Record<string, Phaser.Input.Keyboard.Key>;
  autoFire = false;

  constructor(scene: Phaser.Scene) {
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      fire: Phaser.Input.Keyboard.KeyCodes.SPACE,
      auto: Phaser.Input.Keyboard.KeyCodes.F,
      pause: Phaser.Input.Keyboard.KeyCodes.P,
      mute: Phaser.Input.Keyboard.KeyCodes.M,
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    this.keys.auto.on('down', () => {
      this.autoFire = !this.autoFire;
    });
  }

  dir(): { x: number; y: number } {
    const x =
      (this.keys.right.isDown ? 1 : 0) - (this.keys.left.isDown ? 1 : 0);
    const y = (this.keys.down.isDown ? 1 : 0) - (this.keys.up.isDown ? 1 : 0);
    return { x, y };
  }

  firePressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.keys.fire);
  }
}
