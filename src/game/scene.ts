import Phaser from 'phaser';
import { Input } from '../core/input';
import { AudioManager } from '../core/audio';
import { load as loadSave, save as saveGame } from '../core/save';
import { HUD } from '../ui/hud';
import { Player } from './player';
import { Enemy } from './enemy';
import { updateEnemy } from './ai';
import { ProjectilePool } from './projectiles';
import { computeFov } from './fov';
import { FogOfWar } from './fog';
import { LevelGenerator, LevelState } from './level';
import { damage } from './combat';

const TILE = 16;
const WIDTH = 60;
const HEIGHT = 34;

export class GameScene extends Phaser.Scene {
  private controls!: Input;
  private audio!: AudioManager;
  private hud!: HUD;
  private player!: Player;
  private enemies: Enemy[] = [];
  private levelGen!: LevelGenerator;
  private level!: LevelState;
  private projectiles!: ProjectilePool;
  private fog!: FogOfWar;
  private projGraphics!: Phaser.GameObjects.Graphics;
  private remembered = new Set<string>();
  private showSeed = false;
  private fogEnabled = true;

  constructor() {
    super('game');
  }

  preload(): void {}

  create(data: { fog?: boolean } = {}): void {
    this.fogEnabled = data.fog ?? true;
    const px = this.add.graphics();
    px.fillStyle(0xffffff);
    px.fillRect(0, 0, 1, 1);
    px.generateTexture('pixel', 1, 1);
    px.destroy();
    const url = new URL(window.location.href);
    const seed =
      url.searchParams.get('seed') || Math.random().toString(36).slice(2);
    const saved = loadSave();
    const startSeed = saved?.seed || seed;
    const startDepth = saved?.depth || 1;
    this.controls = new Input(this);
    this.controls.autoFire = saved?.options.autoFire || false;
    this.levelGen = new LevelGenerator(startSeed);
    this.level = this.levelGen.next(startDepth);
    this.drawMap();

    const startPos = saved?.player || this.level.map.entrance;
    this.player = new Player(this, startPos.x, startPos.y, TILE);
    this.player.stats.hp = saved?.player.hp || this.player.stats.hp;
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setBounds(0, 0, WIDTH * TILE, HEIGHT * TILE);

    for (const e of this.level.enemies) {
      this.enemies.push(new Enemy(this, e.type, e.x, e.y, TILE));
    }

    this.audio = new AudioManager(this);
    this.audio.playMusic();
    this.hud = new HUD(this, WIDTH * TILE);
    this.projectiles = new ProjectilePool(32);
    this.fog = new FogOfWar(this, WIDTH, HEIGHT, TILE);
    this.fog.setEnabled(this.fogEnabled);
    this.projGraphics = this.add.graphics();

    this.input.keyboard.on(
      'keydown-F1',
      () => (this.showSeed = !this.showSeed),
    );
    saveGame({
      version: 1,
      seed: this.level.map.seed,
      depth: this.level.depth,
      player: {
        x: this.player.gridX,
        y: this.player.gridY,
        hp: this.player.stats.hp,
      },
      options: { autoFire: this.controls.autoFire },
    });
  }

  private drawMap(): void {
    const g = this.add.graphics();
    g.fillStyle(0x333333);
    g.fillRect(0, 0, WIDTH * TILE, HEIGHT * TILE);
    for (let y = 0; y < HEIGHT; y += 1) {
      for (let x = 0; x < WIDTH; x += 1) {
        if (this.level.map.grid[y][x] === 1) {
          g.fillStyle(0x000000);
          g.fillRect(x * TILE, y * TILE, TILE, TILE);
        }
      }
    }
    g.setDepth(-1);
  }

  update(time: number, delta: number): void {
    const dir = this.controls.dir();
    if (dir.x || dir.y) this.player.move(dir.x, dir.y, this.level.map.grid);

    if (this.controls.firePressed() || this.controls.autoFire) {
      const dx = this.player.dir.x;
      const dy = this.player.dir.y;
      const p = this.projectiles.spawn(
        this.player.gridX + dx,
        this.player.gridY + dy,
        dx,
        dy,
      );
      if (p) this.audio.playSfx();
    }

    this.projectiles.update((p) => {
      p.x += (p.dx * delta) / this.player.stats.speed;
      p.y += (p.dy * delta) / this.player.stats.speed;
      const gx = Math.round(p.x);
      const gy = Math.round(p.y);
      if (this.level.map.grid[gy]?.[gx] === 1) return false;
      for (const e of this.enemies) {
        if (e.gridX === gx && e.gridY === gy) {
          if (damage(e, 1)) e.destroy();
          return false;
        }
      }
      return gx >= 0 && gy >= 0 && gx < WIDTH && gy < HEIGHT;
    });
    this.projGraphics.clear();
    this.projGraphics.fillStyle(0xffff00);
    for (const b of this.projectiles.active) {
      this.projGraphics.fillRect(b.x * TILE, b.y * TILE, TILE, TILE);
    }

    for (const e of this.enemies) {
      updateEnemy(
        e,
        { x: this.player.gridX, y: this.player.gridY },
        this.level.map.grid,
      );
      if (e.gridX === this.player.gridX && e.gridY === this.player.gridY) {
        damage(this.player, 1);
      }
    }

    const { visible, remembered } = computeFov(
      this.level.map.grid,
      { x: this.player.gridX, y: this.player.gridY },
      7,
      this.remembered,
    );
    if (this.fogEnabled) {
      this.fog.draw(visible, remembered);
    }
    this.hud.update(
      this.player.stats.hp,
      this.level.depth,
      this.controls.autoFire,
      this.level.map.seed,
      this.showSeed,
    );

    if (
      this.player.gridX === this.level.map.exit.x &&
      this.player.gridY === this.level.map.exit.y
    ) {
      this.nextLevel();
    }
  }

  private nextLevel(): void {
    this.remembered.clear();
    this.enemies.forEach((e) => e.destroy());
    this.enemies = [];
    this.level = this.levelGen.next(this.level.depth + 1);
    this.drawMap();
    this.player.gridX = this.level.map.entrance.x;
    this.player.gridY = this.level.map.entrance.y;
    this.player.setPosition(this.player.gridX * TILE, this.player.gridY * TILE);
    for (const e of this.level.enemies) {
      this.enemies.push(new Enemy(this, e.type, e.x, e.y, TILE));
    }
    saveGame({
      version: 1,
      seed: this.level.map.seed,
      depth: this.level.depth,
      player: {
        x: this.player.gridX,
        y: this.player.gridY,
        hp: this.player.stats.hp,
      },
      options: { autoFire: this.controls.autoFire },
    });
  }
}
