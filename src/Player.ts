import Ghost from 'Ghost';
import Task from 'Task';
import Co from './Constant';

class Player {
  x: number;
  y: number;
  speed: number;
  curMoveKey = '';
  running: boolean;
  hp: number = Co.PLAYER_HP;
  constructor(x: number, y: number, speed: number) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.running = false;
  }
  move() {
    console.log('hmm');
    if (this.curMoveKey.toUpperCase() === 'W') {
      if (this.y < this.speed * (this.running ? Co.RUNNER_CONSTANT : 1)) {
        return;
      }
      this.y -= this.speed * (this.running ? Co.RUNNER_CONSTANT : 1);
    }
    if (this.curMoveKey.toUpperCase() === 'S') {
      if (
        this.y >
        Co.GAME_HEIGHT - this.speed * (this.running ? Co.RUNNER_CONSTANT : 1)
      ) {
        return;
      }
      this.y += this.speed * (this.running ? Co.RUNNER_CONSTANT : 1);
    }
    if (this.curMoveKey.toUpperCase() === 'A') {
      if (this.x < this.speed * (this.running ? Co.RUNNER_CONSTANT : 1)) {
        return;
      }
      this.x -= this.speed * (this.running ? Co.RUNNER_CONSTANT : 1);
    }
    if (this.curMoveKey.toUpperCase() === 'D') {
      if (
        this.x >
        Co.GAME_WIDTH - this.speed * (this.running ? Co.RUNNER_CONSTANT : 1)
      ) {
        return;
      }
      this.x += this.speed * (this.running ? Co.RUNNER_CONSTANT : 1);
    }
    // console.log('x:', this.x, 'y:', this.y);
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = '#f00';
    ctx.strokeStyle = '#f00';
    ctx.beginPath();
    ctx.arc(this.x, this.y, Co.TEST_GHOST_PLAYER_SIZE, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
  checkDamage(ghosts: Ghost[]) {
    ghosts.forEach((ghost) => {
      if (
        ghost.calculateDistance(ghost.x, ghost.y, this.x, this.y) <
        Co.PLAYER_GHOST_INTERACT_PROXIMITY
      ) {
        this.hp -= ghost.damage;
        this.x = Co.GAME_WIDTH / 2;
        this.y = Co.GAME_HEIGHT / 2;
        console.log('hp:', this.hp);
      }
    });
  }
  checkTask(tasks: Task[]) {
    tasks.forEach((task) => {
      if (
        task.calculateDistance(task.x, task.y, this.x, this.y) <
        Co.PLAYER_GHOST_INTERACT_PROXIMITY
      ) {
        task.displayPopup();
        this.x = Co.GAME_WIDTH / 2;
        this.y = Co.GAME_HEIGHT / 2;
      }
    });
  }
}

export default Player;
