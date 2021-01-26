import Master from '../playback/Master.js';
import Player from '../playback/Player.js';


class PlaybackController {


  constructor() {
    this._master = null;
    this._leftPlayer = null;
    this._rightPlayer = null;

    this._init();
  }


  _init() {
    // Virtual Table output
    this._master = new Master();
    // Separated players for each deck
    this._leftPlayer = new Player({
      name: 'left',
      ac: this._master.audioContext,
      output: this._master.getMasterInput('left')
    });
    this._rightPlayer = new Player({
      name: 'right',
      ac: this._master.audioContext,
      output: this._master.getMasterInput('right')
    });
    // For headphones routing
    this._master.attachPlayer('left', this._leftPlayer);
    this._master.attachPlayer('right', this._rightPlayer);
  }


  addTrack(deckSide, track) {
    if (deckSide === 'left' || deckSide === 'right') {
      return this[`_${deckSide}Player`].loadTrack(track);
    }
  }


  togglePlayback(deckSide, options) {
    if (deckSide === 'left' || deckSide === 'right') {
      return this[`_${deckSide}Player`].togglePlayback(options);
    }
  }


  setMasterVolume(value) {
    this._master.setMasterVolume(value);
  }


  setVolume(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setVolume(value);
    }
  }


  setTrimVolume(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setTrimVolume(value);
    }
  }


  setProgress(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setProgress(value);
    }
  }


  adjustProgressSlow(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].adjustProgressSlow(value);
    }
  }


  adjustProgressFast(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].adjustProgressFast(value);
    }
  }


  setTempo(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setTempo(value);
    }
  }


  setHighEQ(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setHighEQ(value);
    }
  }


  setMidEQ(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setMidEQ(value);
    }
  }


  setLowEQ(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setLowEQ(value);
    }
  }


  setFilter(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      return this[`_${deckSide}Player`].setFilter(value);
    }
  }


  setCuePhone(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this._master.togglePhoneCue(deckSide, value);
    }
  }


  setMasterCuePhone(value) {
    this._master.toggleMasterPhoneCue(value);
  }


  crossFade(value) {
    this._master.crossFade(value);
  }


  setPad(deckSide, value, padNumber, shift) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setPad(deckSide, value, padNumber, shift);
    }
  }


  setPadType(deckSide, value, padNumber) {
    return new Promise(resolve => {
      if (deckSide === 'left' || deckSide === 'right') {
        this[`_${deckSide}Player`].setPadType(deckSide, value, padNumber);
      }

      resolve();
    });
  }


  getPlayer(deckSide) {
    return this[`_${deckSide}Player`].player;
  }


  getTrackInfo(deckSide) {
    return this[`_${deckSide}Player`].trackInfo;
  }


  getMasterPlayer() {
    return this._master.player;
  }


  getMasterOutputNode(deckSide) {
    return this._master.getMasterOutput();
  }


  getPlayerOutputNode(deckSide) {
    return this[`_${deckSide}Player`].sourceNode;
  }


  getHotCue(deckSide, index) {
    return this[`_${deckSide}Player`].getHotCue(index);
  }


  get audioContext() {
    return this._master.audioContext;
  }


}


export default PlaybackController;
