export const popupTemplate = `
<form id="popup-form">
  <div id="popup-template">
    <div id="popup-question-letter">{{QUESTIONLETTER}}</div>
    <span id='popup-instruction'>위 한자는 무엇인가요? 뜻과 음을 선택해주세요.</span>
    <div id="definition-wrapper">
      <input type="radio" class='radio-button' id="defchoice1" name="definition" value="{{DEFINITION1}}" />
      <label for="defchoice1">{{DEFINITION1}}</label>
      <input type="radio" class='radio-button' id="defchoice2" name="definition" value="{{DEFINITION2}}" />
      <label for="defchoice2">{{DEFINITION2}}</label>
      <input type="radio" class='radio-button' id="defchoice3" name="definition" value="{{DEFINITION3}}" />
      <label for="defchoice3">{{DEFINITION3}}</label>
    </div>
    <div id="sound-wrapper">
      <input type="radio" class='radio-button' id="soundchoice1" name="sound" value="{{SOUND1}}" />
      <label for="soundchoice1">{{SOUND1}}</label>
      <input type="radio" class='radio-button' id="soundchoice2" name="sound" value="{{SOUND2}}" />
      <label for="soundchoice2">{{SOUND2}}</label>
      <input type="radio" class='radio-button' id="soundchoice3" name="sound" value="{{SOUND3}}" />
      <label for="soundchoice3">{{SOUND3}}</label>
    </div>
    <div id='popup-submit-button-wrapper'>
      <button type='submit' id='popup-submit-button'>확인</button>
    </div>
  </div>
</form>`;
