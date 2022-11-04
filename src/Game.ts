import Co from './Constant';
import Player from './Player';
import Room from './Room';

document.addEventListener('DOMContentLoaded', () => {
  // console.log('?');
  new Game('cv');
});

class Game {
  rooms: Room[] = [];
  player: Player;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(canvasId: string) {
    this.rooms.push(new Room());
    this.player = new Player(
      Co.GAME_WIDTH / 2,
      Co.GAME_HEIGHT / 2,
      Co.PLAYER_SPEED,
    );
    console.log(Co.PLAYER_SPEED);
    this.startCapture();
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) {
      return;
    }
    this.canvas.width = Co.GAME_WIDTH;
    this.canvas.height = Co.GAME_HEIGHT;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  startCapture() {
    window.requestAnimationFrame(this.captureFrame);
  }
  captureFrame = () => {
    this.ctx.clearRect(0, 0, Co.GAME_WIDTH, Co.GAME_HEIGHT);
    document.body.addEventListener('keydown', (e) => {
      // console.log(e.key);
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
    });
    this.player.move();
    // console.error('RENDER', this.ctx);
    this.player.render(this.ctx);
    window.requestAnimationFrame(this.captureFrame);
  };
}
