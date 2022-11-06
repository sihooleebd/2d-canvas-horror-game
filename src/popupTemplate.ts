import { ChineseT } from 'chineseData';

const popupTemplate = `
<form id="popup-form">
  <div id="popup-template">
    <div id="popup-question-letter">{{QUESTIONLETTER}}</div>
    <div id="definition-wrapper">
      <input type="radio" class='radio-button' id="defchoice1" name="definition" value="{{DEFINITION1}}" />
      <label for="defchoice1">{{DEFINITION1}}</label>
      <input type="radio" class='radio-button' id="defchoice2" name="definition" value="{{DEFINITION2}}" />
      <label for="defchoice2">{{DEFINITION2}}</label>
      <input type="radio" class='radio-button' id="defchoice3" name="definition" value="{{DEFINITION3}}" />
      <label for="defchoice3">{{DEFINITION3}}</label>
    </div>
    <div id="sound-wrapper"></div>
      <input type="radio" class='radio-button' id="soundchoice1" name="sound" value="{{SOUND1}}" />
      <label for="soundchoice1">{{SOUND1}}</label>
      <input type="radio" class='radio-button' id="soundchoice2" name="sound" value="{{SOUND2}}" />
      <label for="soundchoice2">{{SOUND2}}</label>
      <input type="radio" class='radio-button' id="soundchoice3" name="sound" value="{{SOUND3}}" />
      <label for="soundchoice3">{{SOUND3}}</label>
    </div>
    <button type='submit'>확인</button>
  </div>
</form>`;

class Popup {
  popupHtml = '';

  constructor(answer: ChineseT, trickQuestions: ChineseT[]) {
    const answerDefinitionIdx = Math.floor(Math.random() * 3) + 1;
    const answerSoundIdx = Math.floor(Math.random() * 3) + 1;
    let defIdx = 0;
    let soundIdx = 0;
    this.popupHtml = popupTemplate.replace('{{QUESTIONLETTER}}', answer.letter);
    for (let i = 1; i < 4; ++i) {
      if (i === answerDefinitionIdx) {
        this.popupHtml = this.popupHtml.replaceAll(
          `{{DEFINITION${i}}}`,
          answer.definition,
        );
      } else {
        this.popupHtml = this.popupHtml.replaceAll(
          `{{DEFINITION${i}}}`,
          trickQuestions[defIdx].definition,
        );
        defIdx++;
      }
      if (i === answerSoundIdx) {
        this.popupHtml = this.popupHtml.replaceAll(
          `{{SOUND${i}}}`,
          answer.sound,
        );
      } else {
        this.popupHtml = this.popupHtml.replaceAll(
          `{{SOUND${i}}}`,
          trickQuestions[soundIdx].sound,
        );
        soundIdx++;
      }
    }
  }
}

export default Popup;
