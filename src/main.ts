import Phaser from 'phaser';
import { GameScene } from './game/scene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 544,
  pixelArt: true,
  roundPixels: true,
  scene: [GameScene],
  physics: { default: 'arcade' },
};

export const game = new Phaser.Game(config);

// Register TypeScript service worker during dev and production build
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/platform/pwa/service-worker.ts')
    .catch(() => {
      // SW is optional; ignore registration errors
    });
}
