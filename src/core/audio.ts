export class AudioManager {
  private scene: Phaser.Scene;
  private ctx: AudioContext;
  private musicOsc?: OscillatorNode;
  sfxVolume = 1;
  musicVolume = 1;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.ctx = scene.sound.context as AudioContext;
  }

  playSfx(): void {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 440;
    gain.gain.value = this.sfxVolume;
    osc.connect(gain).connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playMusic(): void {
    if (this.musicOsc) this.musicOsc.stop();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 110;
    gain.gain.value = this.musicVolume * 0.2;
    osc.connect(gain).connect(this.ctx.destination);
    osc.start();
    this.musicOsc = osc;
  }

  setMute(mute: boolean): void {
    this.scene.sound.mute = mute;
  }
}
