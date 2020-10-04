import Knob from './component/Knob.js';
import Timeline from './Timeline.js';
import Pad from './component/Pad.js';


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
      faderProgress: null,
      cuePhone: null
    };

    this._knobs = {
      gain: null,
      filter: null
    };

    this._bpm = 0;

    this._timeline = new Timeline(this._name);
    this._performancePad = new Pad({
      name: this._name,
      type: 'hotcue'
    });

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
    this._dom.cuePhone = document.getElementById(`headphones-${this._name}`);
  }


  _buildWaveform() {
    const waveformProgress = new AudioVisualizer({
      type: 'waveform',
      player: Meax.pc.getPlayer(this._name),
      renderTo: document.querySelector(`#waveform-${this._name}`),
      fftSize: 1024,
      audioContext: Meax.pc.audioContext,
      inputNode: Meax.pc.getPlayerOutputNode(this._name),
      animation: 'fade',
      wave: {
        align: 'bottom',
        barWidth: 1,
        barMarginScale: 0,
      },
      colors: {
        background: '#1D1E25',
        track: '#E7E9E7',
        progress: '#56D45B'
      }
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
      Meax.pc.togglePlayback(this._name);
    }, this);

    CustomEvents.addEvent('click', this._dom.cuePhone, () => {
      Meax.pc.setCuePhone(this._name, {
        raw: [
          (this._name === 'left' ? 144 : 145),
          84,
          (this._dom.cuePhone.classList.contains('enabled') ? 127 : 0)] // See midi controller for values
      });
    }, this);

    CustomEvents.addEvent('click', this._dom.progressBar.parentNode, event => {
      const percentage = (event.offsetX / this._dom.progressBar.parentNode.offsetWidth);
      Meax.pc.setProgress(this._name, percentage);
    }, this);
  }


  _setEventSubscriptions() {
    //CustomEvents.subscribe(`Player/Filter`, this._updateFilter.bind(this));
    CustomEvents.subscribe(`Player/TrimGain`, this._updateTrimGain.bind(this));
  }


  setFilter(options) {
    this._knobs.filter.setValue(options);
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
    this._dom.play.classList.add('playing');
  }


  setPause() {
    this._dom.play.src = './assets/img/player/play.svg';
    this._dom.play.classList.remove('playing');
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


  updateCuePhone(options) {
    if (options.raw[2] === 127) {
      this._dom.cuePhone.classList.add('enabled');
    } else {
      this._dom.cuePhone.classList.remove('enabled');
    }
  }


  setPad(options) {
    this._performancePad.setPad(options);
  }


  clearPadSelection(options) {
    this._performancePad.clearPadSelection();
  }



  saveHotCue(options) {
    this._performancePad.saveHotCue(options);
  }


  removeHotCue(options) {
    this._performancePad.removeHotCue(options);
  }


  setPadType(options) {
    this._performancePad.setPadType(options);
  }


}


export default Deck;
