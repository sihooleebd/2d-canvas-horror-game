import Ghost from './Ghost';
import Co from './Constant';
import Player from './Player';
import Room from './Room';

document.addEventListener('DOMContentLoaded', () => {
  // console.log('?');
  new Game('cv');
});

type PointT = {
  x: number;
  y: number;
};

class Game {
  rooms: Room[] = [];
  player: Player;
  canvas: HTMLCanvasElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any;
  ghosts: Ghost[] = [];
  ghostKeyPoints: PointT[][] = [
    [
      { x: 600, y: 0 },
      { x: 600, y: 450 },
    ],
    [
      { x: 0, y: 350 },
      { x: 800, y: 340 },
    ],
    [
      { x: 0, y: 200 },
      { x: 200, y: 200 },
      { x: 200, y: 400 },
      { x: 0, y: 400 },
    ],
  ];
  ghostSpeeds: number[] = [1, 1, 1];
  ghostDamages: number[] = [50, 10, 20];
  constructor(canvasId: string) {
    this.rooms.push(new Room());
    this.player = new Player(
      Co.GAME_WIDTH / 2,
      Co.GAME_HEIGHT / 2,
      Co.PLAYER_SPEED,
    );
    // console.log(Co.PLAYER_SPEED);
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) {
      return;
    }
    for (let i = 0; i < Co.TASKS_AND_GHOSTS_COUNT; ++i) {
      this.ghosts.push(
        new Ghost(
          this.ghostKeyPoints[i],
          i + 1,
          this.ghostSpeeds[i],
          this.ghostDamages[i],
        ),
      );
    }
    // console.log(this.ghosts);
    this.canvas.width = Co.GAME_WIDTH;
    this.canvas.height = Co.GAME_HEIGHT;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!this.ctx) {
      return;
    }
    this.startCapture();
  }

  startCapture() {
    window.requestAnimationFrame(this.captureFrame);
  }
  captureFrame = () => {
    this.ctx.clearRect(0, 0, Co.GAME_WIDTH, Co.GAME_HEIGHT);
    document.body.addEventListener('keydown', (e) => {
      if (e.key === 'F12') {
        return;
      }
      if (
        e.key.toUpperCase() === 'W' ||
        e.key.toUpperCase() === 'A' ||
        e.key.toUpperCase() === 'S' ||
        e.key.toUpperCase() === 'D'
      ) {
        e.preventDefault();
        // console.log(e);
        this.player.curMoveKey = e.key;
        // console.log(this.player.curMoveKey);
      }
      if (e.key.toUpperCase() === 'SHIFT') {
        this.player.running = true;
      }
    });
    document.body.addEventListener('keyup', (e) => {
      if (e.key === 'F12') {
        return;
      }
      if (e.key === this.player.curMoveKey) {
        e.preventDefault();
        this.player.curMoveKey = '';
        // console.log(this.player.curMoveKey);
      }
      if (e.key.toUpperCase() === 'SHIFT') {
        this.player.running = false;
      }
    });
    this.player.move();
    // console.error('RENDER', this.ctx);
    this.player.render(this.ctx);
    this.player.checkDamage(this.ghosts);
    this.ghosts.forEach((ghost) => {
      ghost.move();
      ghost.render(this.ctx);
    });
    window.requestAnimationFrame(this.captureFrame);
  };
}
