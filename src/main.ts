import Phaser from 'phaser';
import { GameScene } from './game/scene';
import { MenuScene } from './ui/menu';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  pixelArt: true,
  roundPixels: true,
  backgroundColor: '#000000',
  scene: [MenuScene, GameScene],
  physics: { default: 'arcade' },
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
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
