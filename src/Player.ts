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
  image = new Image();
  healthBar = document.getElementById('health');
  constructor(x: number, y: number, speed: number) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.running = false;
    this.image.src = require('../static/img/main-character.png');
    // console.log(this.image);
    const oldWidth = this.image.width;
    const oldHeight = this.image.height;
    // console.log('old', oldWidth, oldHeight);
    this.image.width = 70;
    this.image.height = (this.image.width * 52) / 30;
    // console.log('player', this.image.width, this.image.height);
  }
  move() {
    // console.log('hmm');
    if (
      this.curMoveKey.toUpperCase() === 'W' ||
      this.curMoveKey === 'ㅈ' ||
      this.curMoveKey === 'ㅉ'
    ) {
      if (this.y < this.speed * (this.running ? Co.RUNNER_CONSTANT : 1)) {
        return;
      }
      this.y -= this.speed * (this.running ? Co.RUNNER_CONSTANT : 1);
    }
    if (
      this.curMoveKey.toUpperCase() === 'S' ||
      this.curMoveKey === 'ㄴ' ||
      this.curMoveKey === 'ㄴ'
    ) {
      if (
        this.y >
        Co.GAME_HEIGHT - this.speed * (this.running ? Co.RUNNER_CONSTANT : 1)
      ) {
        return;
      }
      this.y += this.speed * (this.running ? Co.RUNNER_CONSTANT : 1);
    }
    if (
      this.curMoveKey.toUpperCase() === 'A' ||
      this.curMoveKey === 'ㅁ' ||
      this.curMoveKey === 'ㅁ'
    ) {
      if (this.x < this.speed * (this.running ? Co.RUNNER_CONSTANT : 1)) {
        return;
      }
      this.x -= this.speed * (this.running ? Co.RUNNER_CONSTANT : 1);
    }
    if (
      this.curMoveKey.toUpperCase() === 'D' ||
      this.curMoveKey === 'ㅇ' ||
      this.curMoveKey === 'ㅇ'
    ) {
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
    ctx.save();
    ctx.translate(this.x, this.y);
    // console.log(this.image.width, this.image.height);
    ctx.drawImage(
      this.image,
      -this.image.width / 2,
      -this.image.height / 2,
      this.image.width,
      this.image.height,
    );
    ctx.restore();
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
        const hpHtml = document.getElementById('hp');
        if (!hpHtml) {
          return;
        }
        hpHtml.innerHTML = `hp : ${this.hp}`;
        if (this.hp < 0) {
          this.hp = 0;
        }
        this.healthBar.value = this.hp;
      }
    });
  }
  checkTask(tasks: Task[]) {
    tasks.forEach((task) => {
      if (task.answered) {
        return;
      }
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
