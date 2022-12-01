window.addEventListener('DOMContentLoaded', (event) => {
  const audio = document.querySelector('audio');
  if (!audio) {
    return;
  }
  audio.volume = 0.2;
  audio.autoplay = true;
  audio.loop = true;
  audio.play();
});
