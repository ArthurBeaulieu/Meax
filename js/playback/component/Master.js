class Master {


  constructor() {
    this._audioCtx = null;
    this._nodes = {
      leftGain: null,
      rightGain: null,
      outputGain: null,
    };

    this._players = {};
    this._leftPhoneCue = null;
    this._rightPhoneCue = null;

    this._gainValue = 1;

    this._leftCue = false;
    this._rightCue = false;

    this._setuptNodes()
  }


  _setuptNodes() {
    this._audioCtx = new AudioContext();
    // Crossfader left entry
    this._nodes.leftGain = this._audioCtx.createGain();
    this._nodes.leftGain.gain.value = this._gainValue;
    // Crossfader right entry
    this._nodes.rightGain = this._audioCtx.createGain();
    this._nodes.rightGain.gain.value = this._gainValue;
    // Master output gain
    this._nodes.outputGain = this._audioCtx.createGain();
    this._nodes.outputGain.gain.value = this._gainValue;
    // Node connections to audioCtx output (speaker)
    this._nodes.leftGain.connect(this._nodes.outputGain);
    this._nodes.rightGain.connect(this._nodes.outputGain);

    const maxChannelCount = this._audioCtx.destination.maxChannelCount;
    this._nodes.merger = this._audioCtx.createChannelMerger(maxChannelCount);
    /* Std DJ controller will contain 4 channels */
    this._audioCtx.destination.channelCount = maxChannelCount;
    // Connect L/R outputs to merger 1/2 (Main speaker)
    this._nodes.leftGain.connect(this._nodes.merger, 0, 0);
    this._nodes.rightGain.connect(this._nodes.merger, 0, 1);
    // Add master gain before sending to destination
    this._nodes.merger.connect(this._nodes.outputGain);
    this._nodes.outputGain.connect(this._audioCtx.destination);
  }


  crossFade(value) {
    if (value < 0.5) { // Crossfade to left
      this._nodes.leftGain.gain.value = 1;
      this._nodes.rightGain.gain.value = value * 2;
    } else if (value > 0.5) { // Crossfade to right
      this._nodes.leftGain.gain.value = 1 - (value - 0.5) * 2;
      this._nodes.rightGain.gain.value = 1;
    } else if (value === 0.5) {
      this._nodes.leftGain.gain.value = 0.5;
      this._nodes.rightGain.gain.value = 0.5;
    }
  }


  togglePhoneCue(side, value) {
    if (side === 'left') {
      if (this._leftCue === false) {
        this._leftCue = true;
        value.raw[2] = 127; // Update MIDI event velocity to match status
      } else {
        this._leftCue = false;
        value.raw[2] = 0;
      }
    } else if (side === 'right') {
      if (this._rightCue === false) {
        this._rightCue = true;
        value.raw[2] = 127;
      } else {
        this._rightCue = false;
        value.raw[2] = 0;
      }
    }

    CustomEvents.publish(`Player/CuePhones`, value);

    if (this._leftCue === true && this._rightCue === true) {
      // Both connected
      if (this._leftPhoneCue && this._rightPhoneCue) {
        this._leftPhoneCue.disconnect(this._nodes.merger, 0, 2);
        this._rightPhoneCue.disconnect(this._nodes.merger, 0, 3);
      }

      this._leftPhoneCue = this._players['left'].output;
      this._rightPhoneCue = this._players['right'].output;

      this._leftPhoneCue.connect(this._nodes.merger, 0, 2);
      this._rightPhoneCue.connect(this._nodes.merger, 0, 3);
    } else if (this._leftCue === true || this._rightCue === true) {
      // Left or Right
      if (this._leftPhoneCue && this._rightPhoneCue) {
        this._leftPhoneCue.disconnect(this._nodes.merger, 0, 2);
        this._rightPhoneCue.disconnect(this._nodes.merger, 0, 3);
      }

      if (this._leftCue === true) {
        side = 'left';
      }

      this._leftPhoneCue = this._players[side].output;
      this._rightPhoneCue = this._players[side].output;

      this._leftPhoneCue.connect(this._nodes.merger, 0, 2);
      this._rightPhoneCue.connect(this._nodes.merger, 0, 3);
    } else {
      if (this._leftPhoneCue && this._rightPhoneCue) {
        this._leftPhoneCue.disconnect(this._nodes.merger, 0, 2);
        this._rightPhoneCue.disconnect(this._nodes.merger, 0, 3);
      }
      this._leftPhoneCue = null;
      this._rightPhoneCue = null;
    }
  }


  attachPlayer(side, player) {
    this._players[side] = player;
  }


  getMasterInput(side) {
    return this._nodes[`${side}Gain`];
  }


  get audioContext() {
    return this._audioCtx;
  }


}


export default Master;
