import Ghost from './Ghost';
import Co from './Constant';
import Player from './Player';
import Room from './Room';
import Task from './Task';
import { ChineseT, chineseWords } from './chineseData';
import ghostDatas from './ghostData';
type PopupT = {
  isOpen: boolean;
};

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('background-music') as HTMLAudioElement;
  if (!audio) {
    return;
  }
  audio.volume = 0.15;
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
  tvStatic = document.getElementById('tv-static') as HTMLAudioElement;
  tvStaticMono = document.getElementById('tv-static-mono') as HTMLAudioElement;
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
      this.ghosts.push(new Ghost(ghostDatas[i]));
    }
    // console.log(this.ghosts);
    this.canvas.width = Co.GAME_WIDTH;
    this.canvas.height = Co.GAME_HEIGHT;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!this.ctx) {
      return;
    }

    //tasks
    this.createTasks();
    console.log(this.tasks);
    this.requestKeyboardEventHandlers();
    this.startCapture();
  }

  getSpacedTaskArray() {
    // const spacedTaskArray: number[] = [firstIdx];
    // for (let i = 1; i < Co.TASK_COUNT; ++i) {
    //   spacedTaskArray.push((firstIdx + Co.TASK_SPACE) % Co.TASK_ROUND);
    // }
    const initialPosition = Math.floor(Math.random() * Co.TASK_ROUND);
    const spacedTaskArray: number[] = [initialPosition];
    for (let i = 1; i < Co.TASK_COUNT; ++i) {
      spacedTaskArray.push(
        (initialPosition + Co.TASK_SPACE * i) % Co.TASK_ROUND,
      );
    }

    console.log('SpacedTaskArray', spacedTaskArray);
    const randomizedTaskArray = spacedTaskArray.map(
      (spacedTask) =>
        (spacedTask +
          (Math.random() * 2 * Co.TASK_MOVE_WIDTH -
            Co.TASK_MOVE_WIDTH +
            Co.TASK_ROUND)) %
        Co.TASK_ROUND,
    );
    console.log('RandomizedTaskArray', randomizedTaskArray);

    //

    return randomizedTaskArray.map((spaceTask) =>
      this.convertSpacedTaskToPos(spaceTask),
    );
  }
  convertSpacedTaskToPos(spacedTask: number): PointT {
    if (spacedTask >= Co.TASK_ROUND - (Co.GAME_HEIGHT - 27 * 2)) {
      //좌변
      return {
        x: 35,
        y:
          Co.GAME_HEIGHT -
          27 -
          (spacedTask - (Co.TASK_ROUND - (Co.GAME_HEIGHT - 27 * 2))),
      };
    } else if (
      spacedTask >=
      Co.TASK_ROUND - (Co.GAME_HEIGHT - 27 * 2) - (Co.GAME_WIDTH - 35 * 2)
    ) {
      //밑면
      return {
        x:
          Co.GAME_WIDTH -
          35 -
          (spacedTask -
            (Co.TASK_ROUND -
              (Co.GAME_HEIGHT - 27 * 2) -
              (Co.GAME_WIDTH - 35 * 2))),
        y: Co.GAME_HEIGHT - 27,
      };
    } else if (
      spacedTask >=
      Co.TASK_ROUND - (Co.GAME_HEIGHT - 27 * 2) * 2 - (Co.GAME_WIDTH - 35 * 2)
    ) {
      //오른변
      return {
        x: Co.GAME_WIDTH - 35,
        y: 27 + (spacedTask - (Co.GAME_WIDTH - 35 * 2)),
      };
    } else {
      //윗변
      return {
        x:
          35 +
          (spacedTask -
            (Co.TASK_ROUND -
              (Co.GAME_HEIGHT - 27 * 2) * 2 -
              (Co.GAME_WIDTH - 35 * 2) * 2)),
        y: 27,
      };
    }
  }

  createTasks() {
    for (let i = 0; i < Co.TASK_ROUND; ++i) {
      console.log(i, this.convertSpacedTaskToPos(i));
    }

    if (chineseWords.length < Co.TASK_COUNT) {
      console.error('NO LETTERS AVAILABLE');
      return;
    }
    let letterIndices: number[] = [];
    for (let i = 0; i < chineseWords.length; ++i) {
      letterIndices.push(i);
    }
    letterIndices = this.shuffle(letterIndices);
    const spacedTaskArray = this.getSpacedTaskArray();
    for (let i = 0; i < Co.TASK_COUNT; ++i) {
      // console.log(arrayNumbered[i]);
      this.tasks.push(
        new Task(
          letterIndices[i],
          this.correctChineseLetters,
          this.popupState,
          spacedTaskArray[i],
        ),
      );
    }
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

  requestKeyboardEventHandlers() {
    document.body.addEventListener('keydown', (e) => {
      console.log('KEYDOWN', e.key);
      if (e.key === 'F12') {
        return;
      }
      if (
        this.convertToWASDFormat(e.key).toUpperCase() === 'W' ||
        this.convertToWASDFormat(e.key).toUpperCase() === 'A' ||
        this.convertToWASDFormat(e.key).toUpperCase() === 'S' ||
        this.convertToWASDFormat(e.key).toUpperCase() === 'D' ||
        this.convertToWASDFormat(e.key).toUpperCase() === 'ㅈ' ||
        this.convertToWASDFormat(e.key).toUpperCase() === 'ㅁ' ||
        this.convertToWASDFormat(e.key).toUpperCase() === 'ㄴ' ||
        this.convertToWASDFormat(e.key).toUpperCase() === 'ㅇ'
      ) {
        e.preventDefault();
        // console.log(e);
        this.player.curMoveKey = this.convertToWASDFormat(e.key);
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
      if (this.convertToWASDFormat(e.key) === this.player.curMoveKey) {
        e.preventDefault();
        this.player.curMoveKey = '';
        // console.log(this.player.curMoveKey);
      }
      if (e.key.toUpperCase() === 'SHIFT') {
        this.player.running = false;
      }
    });
  }

  startCapture() {
    window.requestAnimationFrame(this.captureFrame);
  }

  convertToWASDFormat(key: string) {
    if (key === 'ArrowUp') {
      return 'W';
    }
    if (key === 'ArrowLeft') {
      return 'A';
    }
    if (key === 'ArrowDown') {
      return 'S';
    }
    if (key === 'ArrowRight') {
      return 'D';
    }
    if (key === 'ㅉ') {
      return 'ㅈ';
    }
    return key;
  }

  doAfter = (fun: () => void, after: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        fun();
        resolve();
      }, after);
    });
  };

  async checkHp() {
    if (this.player.hp <= 0) {
      const deadHolder = document.getElementById('game-over-holder');
      const deadMessage = document.getElementById('game-over');
      if (!deadHolder || !deadMessage) {
        return;
      }
      deadHolder.style.display = 'block';
      const audio = document.getElementById(
        'background-music',
      ) as HTMLAudioElement;
      if (!audio) {
        return;
      }
      audio.pause();

      this.tvStaticMono.volume = 1;
      this.tvStaticMono.loop = true;
      console.log(this.tvStaticMono);
      this.tvStaticMono?.play();
      this.player.hp = 0;
      // await this.doAfter(() => {
      //   deadMessage.style.color = 'red';
      //   deadMessage.style.fontSize = '70px';
      //   console.log('hahahahaha');
      // }, 2500);
      await this.doAfter(() => {
        deadMessage.style.background = '#000';
        deadMessage.innerHTML = 'You are dead.';
      }, 2610);
      await this.doAfter(() => {
        deadMessage.innerHTML = 'Rest In Peace.';
      }, 1000);
      await this.doAfter(() => {
        window.location.href = 'home.html';
        this.tvStaticMono.pause();
        console.log(window.location.href);
      }, 1000);
    }
  }

  captureFrame = async () => {
    this.ctx.clearRect(0, 0, Co.GAME_WIDTH, Co.GAME_HEIGHT);
    const background = new Image();
    background.src = require('../static/img/graveyard.png');
    this.ctx.drawImage(background, 0, 0, background.width, background.height);

    // console.log(this.popupState.isOpen);
    if (!this.popupState.isOpen) {
      this.player.move();
      this.player.checkDamage(this.ghosts);
      await this.checkHp();
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
      const successHolder = document.getElementById('game-success-holder');
      const successMessage = document.getElementById('game-success');
      if (!successHolder || !successMessage) {
        return;
      }
      successHolder.style.display = 'block';
      const audio = document.getElementById(
        'background-music',
      ) as HTMLAudioElement;
      if (!audio) {
        return;
      }
      audio.pause();

      this.tvStaticMono.volume = 1;
      console.log(this.tvStaticMono);
      this.tvStaticMono?.play();
      successMessage.innerHTML = 'Good Job';
      await this.doAfter(() => {
        successMessage.innerHTML = 'You Have Won';
        console.log('hahahahaha');
      }, 1000);
      await this.doAfter(() => {
        successMessage.innerHTML = `Now Go. Bye`;
        console.log('hahahahaha');
      }, 1000);
      await this.doAfter(() => {
        window.location.href = 'home.html';
        console.log(window.location.href);
      }, 1000);
    } else {
      window.requestAnimationFrame(this.captureFrame);
    }
  };
}
