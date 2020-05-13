class Deck {


  constructor(name) {
    this._name = name;
    this._dom = {
      title: null,
      artist: null,
      bpm: null,
      appliedBpm: null,
      key: null,
      progress: null,
      progressBar: null,
      duration: null,
      play: null,
      faderTrack: null,
      faderProgress: null
    };

    this._bpm = 0;

    this._getElements();
    this._addEvents();
  }


  _getElements() {
    this._dom.title = document.getElementById(`track-title-${this._name}`);
    this._dom.artist = document.getElementById(`track-artist-${this._name}`);
    this._dom.bpm = document.getElementById(`track-bpm-${this._name}`);
    this._dom.appliedBpm = document.getElementById(`track-applied-bpm-${this._name}`);
    this._dom.key = document.getElementById(`track-key-${this._name}`);
    this._dom.progress = document.getElementById(`track-current-time-${this._name}`);
    this._dom.progressBar = document.getElementById(`track-waveform-progress-${this._name}`);
    this._dom.duration = document.getElementById(`track-duration-${this._name}`);
    this._dom.play = document.getElementById(`play-${this._name}`);
    this._dom.faderTrack = document.getElementById(`fader-track-${this._name}`);
    this._dom.faderProgress = document.getElementById(`fader-progress-${this._name}`);
  }


  _addEvents() {
    CustomEvents.addEvent('click', this._dom.play, () => {
      ManaMeax.pc.togglePlayback(this._name);
    }, this);

    CustomEvents.addEvent('click', this._dom.progressBar.parentNode, event => {
      const percentage = (event.clientX / this._dom.progressBar.parentNode.offsetWidth);
      ManaMeax.pc.setProgress(this._name, percentage);
    }, this);
  }


  setVolume(value) { // Value is a percentage [0,1]
    const topOffset = this._dom.faderTrack.offsetHeight - (value * (this._dom.faderTrack.offsetHeight));
    this._dom.faderProgress.style.top = `${topOffset}px`;
  }


  setTempo(amount) {
    this._dom.appliedBpm.innerHTML = this._bpm + (this._bpm * amount)
  }


  setPlay() {
    this._dom.play.src = './assets/img/player/pause.svg';
  }


  setPause() {
    this._dom.play.src = './assets/img/player/play.svg';
  }


  loadTrack(track) {
    this._dom.title.innerHTML = track.title;
    this._dom.artist.innerHTML = track.artist;
    this._dom.bpm.innerHTML = track.bpm;
    this._dom.key.innerHTML = track.key;
    this._dom.progress.innerHTML = Utils.secondsToTimecode(0, true);
    this._dom.duration.innerHTML = Utils.secondsToTimecode(track.duration, true);
    this._dom.appliedBpm.innerHTML = track.bpm;

    this._bpm = parseInt(track.bpm);
  }


  updateProgress(options) {
    this._dom.progress.innerHTML = Utils.secondsToTimecode(options.progress, true);
    this._dom.progressBar.style.width = `${(options.progress / options.duration) * 100}%`;
  }


}


export default Deck;
