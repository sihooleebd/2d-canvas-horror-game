import Co from './Constant';
import { ChineseT, chineseWords } from './chineseData';
import { popupTemplate } from './popup.tpl';
import Go from './Global';

class Task {
  x = 0;
  y = 0;
  answer: ChineseT = { definition: '', sound: '', letter: '' };
  trickQuestions: ChineseT[] = [];
  correctChineseLetters: ChineseT[] = [];
  answered: boolean;
  createTaskOnBorder() {
    const a = Math.floor(Math.random() * 4);
    if (a === 1) {
      this.x = 0;
      this.y = Math.random() * Co.GAME_HEIGHT;
    } else if (a === 2) {
      this.x = Co.GAME_WIDTH;
      this.y = Math.random() * Co.GAME_HEIGHT;
    } else if (a === 3) {
      this.x = Math.random() * Co.GAME_WIDTH;
      this.y = 0;
    } else {
      this.x = Math.random() * Co.GAME_WIDTH;
      this.y = Co.GAME_HEIGHT;
    }
  }

  constructor(answerIdx: number, correctChineseLetters: ChineseT[]) {
    this.createTaskOnBorder();
    this.answer = chineseWords[answerIdx];
    let prevTrickQuestion = 0;
    for (let i = 0; i < 2; ++i) {
      const randomNum = Math.floor(Math.random() * chineseWords.length);
      if (randomNum === answerIdx) {
        i--;
        continue;
      }
      if (i == 1 && prevTrickQuestion === randomNum) {
        i--;
        continue;
      }
      prevTrickQuestion = randomNum;
      this.trickQuestions.push(chineseWords[randomNum]);
      this.correctChineseLetters = correctChineseLetters;
    }
    this.answered = false;
  }
  displayPopup() {
    // const popup = new Popup(this.answer, this.TrickQuestions);
    if (this.answered) {
      return;
    }
    let popupHtml: string;
    const fullArr = this.trickQuestions.slice();
    fullArr.push(this.answer);
    const definitions = this.shuffle(
      fullArr.map((chineseLetter: ChineseT) => {
        return chineseLetter.definition;
      }),
    );
    console.log(definitions);
    const sounds = this.shuffle(
      fullArr.map((chineseLetter: ChineseT) => {
        return chineseLetter.sound;
      }),
    );
    popupHtml = popupTemplate.replace('{{QUESTIONLETTER}}', this.answer.letter);
    for (let i = 0; i < 3; ++i) {
      popupHtml = popupHtml.replaceAll(
        `{{DEFINITION${i + 1}}}`,
        definitions[i],
      );
      popupHtml = popupHtml.replaceAll(`{{SOUND${i + 1}}}`, sounds[i]);
    }
    const popupHolder = document.getElementById('popup-holder');
    if (!popupHolder) {
      return;
    }
    popupHolder.innerHTML = popupHtml;
    const form = document.getElementById('popup-form') as HTMLFormElement;
    if (!form) {
      return;
    }
    form.addEventListener('submit', (e) => {
      console.log(e);
      e.preventDefault();
      const data = new FormData(form);
      const output = '';
      let definitionCorrect = false;
      let soundCorrect = false;
      for (const entry of data) {
        if (entry[0] == 'definition' && entry[1] === this.answer.definition) {
          definitionCorrect = true;
        }
        if (entry[0] == 'sound' && entry[1] === this.answer.sound) {
          soundCorrect = true;
        }
      }
      if (definitionCorrect && soundCorrect) {
        console.log('CORRECT');
        this.correctChineseLetters.push(this.answer);
        this.answered = true;
        console.log(this.correctChineseLetters);
      } else {
        console.log('INCORRECT');
      }
      console.log(output);
      console.log(data);
      popupHolder.innerHTML = '';
    });
  }

  shuffle(array: string[]): string[] {
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

  render(ctx: CanvasRenderingContext2D) {
    if (this.answered) {
      return;
    }
    ctx.beginPath();
    ctx.fillStyle = '#00f';
    ctx.strokeStyle = '#00f';
    ctx.beginPath();
    ctx.arc(this.x, this.y, Co.TEST_GHOST_PLAYER_SIZE, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
  calculateDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  }
}

export default Task;
