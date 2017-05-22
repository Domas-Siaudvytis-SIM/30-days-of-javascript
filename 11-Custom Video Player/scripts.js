/* Get elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelector('.fullscreen');

/* Build out functions */

// play/pause
const togglePlay = () => video[video.paused ? 'play' : 'pause']();

function updateButton(){
  toggle.textContent = this.paused ? '►' : '❚ ❚';
}

// skip forward/back

function skip(){
  video.currentTime += parseFloat(this.dataset.skip);
}

// change volume/playback rate

function handleRangeUpdate(){
  video[this.name] = this.value;
}

function handleRateChange(){
  updateRange('playbackRate', this.playbackRate);
}
function handleVolumeChange(){
  updateRange('volume', this.volume);
}
const updateRange = (prop, value) => Array.from(ranges).find( range => range.name == prop).value = value;

// duration/progress bar

function handleProgress(){
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e){
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

// fullscreen

const toggleFullScreen = () => {
  // Chrome
  !!video.webkitRequestFullscreen && !video.webkitDisplayingFullscreen && video.webkitRequestFullscreen()
  // Firefox
  !!video.mozRequestFullScreen && !video.mozFullScreen && video.mozRequestFullScreen()

  // if already full screen
  // Chrome
  !!video.webkitExitFullscreen && video.webkitDisplayingFullscreen && video.webkitExitFullscreen()
  // Firefox
  // these might not work if Firefox Fullscreen API is inconsistent with Mozilla Developer Network documentation
  !!video.mozCancelFullScreen && video.mozFullScreen && video.mozCancelFullScreen()
}

// keyboard shortcuts

const handleKeyboard = e => ({
    [e.keyCode == 32]: togglePlay, // spacebar
    [e.keyCode == 70]: toggleFullScreen // f
  }[true]())

/* Hook up event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
video.addEventListener('ratechange', handleRateChange);
video.addEventListener('volumechange', handleVolumeChange);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach( button => button.addEventListener('click', skip));
ranges.forEach( button => button.addEventListener('change', handleRangeUpdate));
fullscreen.addEventListener('click', toggleFullScreen);

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

window.addEventListener('keydown', handleKeyboard);
