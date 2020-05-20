/* TODO proper lib import */
import MzkVisualizer from '../../../lib/MzkVisualizer/js/MzkVisualizer.js';
import Knob from './Knob.js';


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

    this._knobs = {
      gain: null,
      filter: null
    };

    this._bpm = 0;

    this._getElements();
    this._buildWaveform();
    this._buildKnobs();
    this._addEvents();
    this._setEventSubscriptions();
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


  _buildWaveform() {
    const waveformProgress = new MzkVisualizer({
      type: 'waveformprogress', // Mandatory, either 'frequencybars', 'frequencycircle', 'oscilloscope', 'peakmeter' or 'spectrum'
      player: MzkMeax.pc.getPlayer(this._name), // Mandatory, the play to wire visualisation to
      audioContext: MzkMeax.pc.audioContext,
      input: MzkMeax.pc.getPlayerOutputNode(this._name),
      renderTo: document.querySelector(`#waveform-${this._name}`), // Mandatory, the HTML div to render component
      fftSize: 1024, // Optional (default 1024), Higher is smoother for vuemeter (doesn't consume much CPU)
      animation: 'fade', // Optional (default fade), 'fade' or 'gradient', the animation on bar on progress
      wave: { // Optional
        align: 'bottom', // Optional (default center), how to display waveform : top, center, bottom
        barWidth: 1, // Optional (default 1), the bar width. in range [1, 100]
        barMarginScale: 0 // Optional (default 0.25), The bar margin percentage from to bar width in range [0, 1]
      },
    });
  }


  _buildKnobs() {
    this._knobs.filter = new Knob({
      target: document.getElementById(`eq-filter-${this._name}`),
      type: 'filter',
      side: this._name
    });

    this._knobs.gain = new Knob({
      target: document.getElementById(`eq-gain-${this._name}`),
      type: 'gain',
      side: this._name
    });
  }


  _addEvents() {
    CustomEvents.addEvent('click', this._dom.play, () => {
      MzkMeax.pc.togglePlayback(this._name);
    }, this);

    CustomEvents.addEvent('click', this._dom.progressBar.parentNode, event => {
      const percentage = (event.offsetX / this._dom.progressBar.parentNode.offsetWidth);
      MzkMeax.pc.setProgress(this._name, percentage);
    }, this);
  }


  _setEventSubscriptions() {
    CustomEvents.subscribe(`Player/Filter`, this._updateFilter.bind(this));
    CustomEvents.subscribe(`Player/TrimGain`, this._updateTrimGain.bind(this));
  }


  _updateFilter(options) {
    if (this._name === options.name) {
      this._knobs.filter.setValue(options.value);
    }
  }


  _updateTrimGain(options) {
    if (this._name === options.name) {
      this._knobs.gain.setValue(options.value);
    }
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
