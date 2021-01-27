class Master {


  constructor() {
    // Audio context app wide ; Master provide a getter to get app AudioCtx
    this._audioCtx = null;
    // Audio nodes
    this._nodes = {
      leftGain: null,
      rightGain: null,
      outputGain: null
    };
    // L/R players to feed master with
    this._players = {};
    // Headphones L/R audio nodes
    this._leftPhoneCue = null;
    this._rightPhoneCue = null;
    // Default neutral gain value
    this._gainValue = 0.7079; // -3 dB attenuation
    // Internal flag to save headphone cue state for each deck
    this._leftCue = false;
    this._rightCue = false;
    // TODO : add all internal in constructor
    this._setupNodes();
  }


  _setupNodes() {
    // Create Meax audio context
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
    // Get channel count and create merger accordingly to properly route 0/1 to speaker and 2/3 to headphones
    const maxChannelCount = this._audioCtx.destination.maxChannelCount;
    this._nodes.merger = this._audioCtx.createChannelMerger(maxChannelCount);
    /* Std DJ controller will contain 4 channels, otherwise... hf implementing this */
    this._audioCtx.destination.channelCount = maxChannelCount;
    // Connect L/R outputs to merger 0/1 (Main speaker). L/R for headphones (2/3) are to be set in phone cue methods
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

    window.CustomEvents.publish(`Player/Crossfade`, {
      leftGain: this._nodes.leftGain.gain.value,
      rightGain: this._nodes.rightGain.gain.value,
      value: value
    });
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
    // Publish CuePhones with side
    value.name = side;
    window.CustomEvents.publish(`Player/CuePhones`, value);
    // Audio nodes routing to provide proper headphones output (channel 3/4)
    if (this._leftCue === true && this._rightCue === true) { // Both deck are listened
      // Disconnect any previous routing to headphones
      if (this._leftPhoneCue && this._rightPhoneCue) {
        this._leftPhoneCue.disconnect(this._nodes.merger, 0, 2);
        this._rightPhoneCue.disconnect(this._nodes.merger, 0, 3);
      }
      // Update headphones audio nodes
      this._leftPhoneCue = this._players['left'].output;
      this._rightPhoneCue = this._players['right'].output;
      // Connect to merger on headphone channels
      this._leftPhoneCue.connect(this._nodes.merger, 0, 2);
      this._rightPhoneCue.connect(this._nodes.merger, 0, 3);
    } else if (this._leftCue === true || this._rightCue === true) { // Only one channel is listened
      // Disconnect any previous routing to headphones
      if (this._leftPhoneCue && this._rightPhoneCue) {
        this._leftPhoneCue.disconnect(this._nodes.merger, 0, 2);
        this._rightPhoneCue.disconnect(this._nodes.merger, 0, 3);
      }
      // Update side value if left side, right otherwise
      if (this._leftCue === true) {
        side = 'left';
      }
      // Update headphones audio nodes
      this._leftPhoneCue = this._players[side].output;
      this._rightPhoneCue = this._players[side].output;
      // Connect to merger on headphone channels
      this._leftPhoneCue.connect(this._nodes.merger, 0, 2);
      this._rightPhoneCue.connect(this._nodes.merger, 0, 3);
    } else { // No channel deck to headphones
      // Disconnect any previous routing to headphones
      if (this._leftPhoneCue && this._rightPhoneCue) {
        this._leftPhoneCue.disconnect(this._nodes.merger, 0, 2);
        this._rightPhoneCue.disconnect(this._nodes.merger, 0, 3);
      }
      // Clear audio nodes
      this._leftPhoneCue = null;
      this._rightPhoneCue = null;
    }
  }


  toggleMasterPhoneCue(value) {
    window.CustomEvents.publish(`Player/MasterCuePhones`, value);
  }


  setMasterVolume(value) {
    // Range [0, 0.66]/[0, 0.7079], [0.66, 1]/[0.7079, 1.995]
    // 0.7079 is for -3 dB attenuation, 1.995 is for +6 dB boost
    // Decibel conversion ; db = 20 * log10(gainValue) and gainValue = Math.pow(10, (db / 20))
    // 0.66 is threshold value as in DDJ-400, the master zero is a the two third of the knob
    // Formula to convert from one scale to another :
    // NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
    if (value < 0.66) {
      this._nodes.outputGain.gain.value = (value * 0.7079) / 0.66;
    } else if (value > 0.66) {
      this._nodes.outputGain.gain.value = (((value - 0.66) * (1.995 - 0.7079)) / (1 - 0.66)) + 0.7079;
    } else if (value === 0.66) {
      this._nodes.outputGain.gain.value = 0.7079; // -3 dB attenuation
    }
    // Publish event to update components
    window.CustomEvents.publish(`Master/Volume`, {
      gain: this._nodes.outputGain.gain.value,
      value: value
    });
  }


  attachPlayer(side, player) {
    this._players[side] = player;
  }


  getMasterInput(side) {
    return this._nodes[`${side}Gain`];
  }


  getMasterOutput() {
    return this._nodes.outputGain;
  }


  get audioContext() {
    return this._audioCtx;
  }


}


export default Master;
