class Master {


  constructor() {
    this._audioCtx = null;
    this._nodes = {
      leftGain: null,
      rightGain: null,
      outputGain: null,
    };

    this._deckGain = 0.5;
    this._gainValue = 1;

    this._setuptNodes()
  }


  _setuptNodes() {
    this._audioCtx = new AudioContext();
    // Crossfader left entry
    this._nodes.leftGain = this._audioCtx.createGain();
    this._nodes.leftGain.gain.value = this._deckGain;
    // Crossfader right entry
    this._nodes.rightGain = this._audioCtx.createGain();
    this._nodes.rightGain.gain.value = this._deckGain;
    // Master output gain
    this._nodes.outputGain = this._audioCtx.createGain();
    this._nodes.outputGain.gain.value = this._gainValue;
    // Node connections to audioCtx output (speaker)
    this._nodes.leftGain.connect(this._nodes.outputGain);
    this._nodes.rightGain.connect(this._nodes.outputGain);
    this._nodes.outputGain.connect(this._audioCtx.destination);
  }


  crossFade(value) {
    if (value < 0.5) { // Crossfade to left
      this._nodes.leftGain.gain.value = 1 - value;
      this._nodes.rightGain.gain.value = value;
    } else if (value > 0.5) { // Crossfade to right
      this._nodes.leftGain.gain.value = 1 - value;
      this._nodes.rightGain.gain.value = value;
    } else if (value === 0.5) {
      this._nodes.leftGain.gain.value = 0.5;
      this._nodes.rightGain.gain.value = 0.5;
    }
  }


  getMasterInput(side) {
    return this._nodes[`${side}Gain`];
  }


  get audioContext() {
    return this._audioCtx;
  }


}


export default Master;
