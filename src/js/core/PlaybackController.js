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
    } else {

    }
  }


  togglePlayback(deckSide, options) {
    if (deckSide === 'left' || deckSide === 'right') {
      return this[`_${deckSide}Player`].togglePlayback(options);
    } else {

    }
  }

  setVolume(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setVolume(value);
    } else {

    }
  }


  setTrimVolume(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setTrimVolume(value);
    } else {

    }
  }


  setProgress(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setProgress(value);
    } else {

    }
  }


  adjustProgressSlow(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].adjustProgressSlow(value);
    } else {

    }
  }


  adjustProgressFast(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].adjustProgressFast(value);
    } else {

    }
  }


  setTempo(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setTempo(value);
    } else {

    }
  }


  setHighEQ(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setHighEQ(value);
    } else {

    }
  }


  setMidEQ(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setMidEQ(value);
    } else {

    }
  }


  setLowEQ(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Player`].setLowEQ(value);
    } else {

    }
  }


  setFilter(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      return this[`_${deckSide}Player`].setFilter(value);
    } else {

    }
  }


  setCuePhone(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this._master.togglePhoneCue(deckSide, value);
    } else {

    }
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


  getPlayerOutputNode(deckSide) {
    return this[`_${deckSide}Player`].sourceNode;
  }


  get audioContext() {
    return this._master.audioContext;
  }


}


export default PlaybackController;
