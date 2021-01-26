import Knob from './component/Knob.js';
import Pad from './component/Pad.js';
import TimelineController from './component/TimelineController.js';
import WaveformController from './component/WaveformController.js';


class Deck {


  constructor(name) {
    this._name = name;
    this._dom = {
      title: null,
      artist: null,
      bpm: null,
      appliedBpm: null,
      key: null,
      progress: null, // The text displayed value of progress
      duration: null,
      play: null,
      faderTrack: null,
      faderProgress: null,
      cuePhone: null,
      waveformColors: null
    };

    this._knobs = {
      gain: null,
      filter: null
    };

    this._bpm = 0;

    this._hotCues = [];
    this._timelineController = new TimelineController(this._name);
    this._waveformController = new WaveformController(this._name);

    this._performancePad = new Pad({
      name: this._name,
      type: 'hotcue'
    });

    this._getElements();
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
    this._dom.duration = document.getElementById(`track-duration-${this._name}`);
    this._dom.play = document.getElementById(`play-${this._name}`);
    this._dom.faderTrack = document.getElementById(`fader-track-${this._name}`);
    this._dom.faderProgress = document.getElementById(`fader-progress-${this._name}`);
    this._dom.cuePhone = document.getElementById(`headphones-${this._name}`);
    this._dom.waveformColors = document.getElementById(`waveform-${this._name}-colors`);
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

    CustomEvents.addEvent('timeupdate', Meax.pc.getPlayer(this._name), event => {
      this.updateProgress({
        progress: Meax.pc.getPlayer(this._name).currentTime,
        duration: Meax.pc.getPlayer(this._name).duration
      });
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
    // In 1080 desktop, fader is 60px with 6px margin
    this._dom.faderProgress.style.top = `${66 - ((value * 54) + 6)}px`;
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
    this._timelineController.updateTrack(track);
  }


  updateProgress(options) {
    this._dom.progress.innerHTML = Utils.secondsToTimecode(options.progress, true);
    this._waveformController.updateProgress(options);
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
    const hotCue = this._timelineController.setHotCue(options);
    this._waveformController.setHotCue(hotCue);
    this._hotCues.push(hotCue);
  }


  removeHotCue(options) {
    let hotCue = null;
    for (let i = 0; i < this._hotCues.length; ++i) {
      if (this._hotCues[i].label === options.pad) {
        hotCue = this._hotCues[i];
        this._hotCues.splice(i, 1);
        break;
      }
    }

    this._performancePad.removeHotCue(options);
    this._timelineController.removeHotCue(hotCue);
    this._waveformController.removeHotCue(hotCue);
  }


  updateHotCue(options) {
    let hotCue = null;
    for (let i = 0; i < this._hotCues.length; ++i) {
      if (this._hotCues[i].label === options.pad) {
        hotCue = this._hotCues[i];
        break;
      }
    }

    if (hotCue) {
      this._performancePad.updateHotCue(hotCue, options);
      this._timelineController.updateHotCue(hotCue, options);
      this._waveformController.updateHotCue(hotCue, options);
    }
  }


  beatJump(options) {

  }


  setPadType(options) {
    this._performancePad.setPadType(options, this._hotCues);
  }


  timelineColorUpdate(options) {
    this._timelineController.setTimelineColors(options);
  }


  waveformOptionUpdate(options) {
    this._waveformController.setWaveformOptions(options);
  }


  getClosestBeatTime() {
    return this._timelineController.getClosestBeatTime();
  }


}


export default Deck;
