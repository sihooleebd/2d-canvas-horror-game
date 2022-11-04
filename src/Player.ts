import Co from './Constant';

class Player {
  x: number;
  y: number;
  speed: number;
  curMoveKey = '';
  constructor(x: number, y: number, speed: number) {
    this.x = x;
    this.y = y;
    this.speed = speed;
  }
  move() {
    if (this.curMoveKey.toUpperCase() === 'W') {
      if (this.y < this.speed) {
        return;
      }
      this.y -= this.speed;
    }
    if (this.curMoveKey.toUpperCase() === 'S') {
      if (this.y > Co.GAME_HEIGHT - this.speed) {
        return;
      }
      this.y += this.speed;
    }
    if (this.curMoveKey.toUpperCase() === 'A') {
      if (this.x < this.speed) {
        return;
      }
      this.x -= this.speed;
    }
    if (this.curMoveKey.toUpperCase() === 'D') {
      if (this.x > Co.GAME_WIDTH - this.speed) {
        return;
      }
      this.x += this.speed;
    }
    console.log('x:', this.x, 'y:', this.y);
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = '#f00';
    ctx.strokeStyle = '#f00';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}

export default Player;
