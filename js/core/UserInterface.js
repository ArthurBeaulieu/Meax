class UserInterface {


  constructor() {
    this._setEventSubscriptions();
  }


  _setEventSubscriptions() {
    CustomEvents.subscribe(`Player/SetVolume`, this._setVolume.bind(this));
    CustomEvents.subscribe(`Player/Play`, this._setPlay.bind(this));
    CustomEvents.subscribe(`Player/Pause`, this._setPause.bind(this));
  }


  _setVolume(options) {
    if (options.name === 'left') {
      const leftFaderTrackHeight = document.getElementById('fader-left-track').offsetHeight;
      const leftFaderProgress = document.getElementById('fader-left-progress');
      const topOffset = leftFaderTrackHeight - (options.value * (leftFaderTrackHeight));
      leftFaderProgress.style.top = `${topOffset}px`;
    } else if (options.name === 'right') {

    }
  }


  _setPlay(options) {
    if (options.name === 'left' || options.name === 'right') {
      const play = document.getElementById(`play-${options.name}`);
      play.src = './assets/img/player/pause.svg';
    } else {

    }
  }


  _setPause(options) {
    if (options.name === 'left' || options.name === 'right') {
      const play = document.getElementById(`play-${options.name}`);
      play.src = './assets/img/player/play.svg';
    } else {

    }
  }


}


export default UserInterface;
