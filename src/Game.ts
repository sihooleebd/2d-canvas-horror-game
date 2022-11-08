import Ghost from './Ghost';
import Co from './Constant';
import Player from './Player';
import Room from './Room';
import Task from './Task';
import { ChineseT, chineseWords } from './chineseData';
type PopupT = {
  isOpen: boolean;
};

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('background-music') as HTMLAudioElement;
  if (!audio) {
    return;
  }
  audio.volume = 0.1;
  audio.autoplay = true;
  audio.loop = true;
  audio.play();
  new Game('cv');
});

type PointT = {
  x: number;
  y: number;
};

class Game {
  rooms: Room[] = [];
  tasks: Task[] = [];
  player: Player;
  canvas: HTMLCanvasElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any;
  ghosts: Ghost[] = [];
  ghostKeyPoints: PointT[][] = [
    [
      { x: 600, y: 0 },
      { x: 600, y: 563 },
    ],
    [
      { x: 0, y: 350 },
      { x: 1000, y: 340 },
    ],
    [
      { x: 0, y: 200 },
      { x: 200, y: 200 },
      { x: 200, y: 400 },
      { x: 0, y: 400 },
    ],
    [
      { x: 700, y: 0 },
      { x: 700, y: 200 },
      { x: 999, y: 200 },
    ],
    [
      { x: 200, y: 0 },
      { x: 200, y: 563 },
    ],
  ];
  ghostSpeeds: number[] = [1, 0.5, 1, 1, 10];
  ghostDamages: number[] = [50, 10, 20, 10, 0];
  correctChineseLetters: ChineseT[] = [];
  popupState: PopupT = { isOpen: false };
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
    for (let i = 0; i < Co.GHOSTS_COUNT; ++i) {
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

    //tasks
    if (chineseWords.length < Co.TASK_COUNT) {
      console.error('NO LETTERS AVAILABLE');
      return;
    }
    let arrayNumbered: number[] = [];
    for (let i = 0; i < chineseWords.length; ++i) {
      arrayNumbered.push(i);
    }
    arrayNumbered = this.shuffle(arrayNumbered);
    for (let i = 0; i < Co.TASK_COUNT; ++i) {
      // console.log(arrayNumbered[i]);
      this.tasks.push(
        new Task(arrayNumbered[i], this.correctChineseLetters, this.popupState),
      );
    }
    console.log(this.tasks);
    this.startCapture();
  }

  shuffle(array: number[]): number[] {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  startCapture() {
    window.requestAnimationFrame(this.captureFrame);
  }
  captureFrame = () => {
    this.ctx.clearRect(0, 0, Co.GAME_WIDTH, Co.GAME_HEIGHT);
    const background = new Image();
    background.src = require('../static/img/graveyard.png');
    this.ctx.drawImage(background, 0, 0, background.width, background.height);
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
    // console.log(this.popupState.isOpen);
    if (!this.popupState.isOpen) {
      this.player.move();
      this.player.checkDamage(this.ghosts);
      if (this.player.hp <= 0) {
        const statusBar = document.getElementById('status-text-div');
        if (!statusBar) {
          return;
        }
        statusBar.innerHTML = '죽었습니다. 3초 뒤에 시작 화면으로 이동됩니다.';
        setTimeout(() => {
          window.location.href = 'home.html';
          console.log(window.location.href);
        }, 3000);
      }
      this.player.checkTask(this.tasks);
      this.ghosts.forEach((ghost) => {
        ghost.move();
        ghost.render(this.ctx);
      });
      this.tasks.forEach((task) => {
        task.render(this.ctx);
      });
      this.player.render(this.ctx);
    }
    // console.error('RENDER', this.ctx);
    if (this.correctChineseLetters.length === Co.TASK_COUNT) {
      const statusBar = document.getElementById('status-text-div');
      if (!statusBar) {
        return;
      }
      statusBar.innerHTML =
        '축하합니다. 모든 한자를 맞추셨습니다. 3초 뒤에 시작 화면으로 이동됩니다.';
      setTimeout(() => {
        statusBar.innerHTML =
          '축하합니다. 모든 한자를 맞추셨습니다. 2초 뒤에 시작 화면으로 이동됩니다.';
        setTimeout(() => {
          statusBar.innerHTML =
            '축하합니다. 모든 한자를 맞추셨습니다. 1초 뒤에 시작 화면으로 이동됩니다.';
          setTimeout(() => {
            window.location.href = 'home.html';
            console.log(window.location.href);
          }, 1000);
        }, 1000);
      }, 1000);
    } else {
      window.requestAnimationFrame(this.captureFrame);
    }
  };
}
