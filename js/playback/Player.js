class Player {


  constructor(options) {
    this._name = options.name;
    this._audioCtx = options.ac;
    this._outputNode = options.output;
    this._audioBuffer = null;

    this._nodes = {
      source: null,
      low: null,
      mid: null,
      high: null,
      filterLow: null,
      filterHigh: null,
      gain: null,
      trimGain: null
    };

    this._endEvtId = -1;
    this._progressRafId = -1;
    this._isPlaying = false;
    this._gainValue = 1;

    this._lowFiltered = false;
    this._highFiltered = false;

    this._setupNodes();
  }


  loadTrack(track) {
    console.log('load track')
    // Checking if any previous source node is playing. If true, we clean it
    if (this._isPlaying) {
      this.stopPlayback();
      CustomEvents.removeEvent(this._endEvtId);
      this._isPlaying = true; // Must restore flag to automatically start playback if load occured on playing track
    }

    this._player.src = track.url;

    const loadedListener = () => {
      console.log('loaded')
      this._player.removeEventListener('loadedmetadata', loadedListener); // Remove loaded track listener
      // Restore context playing state in case it turned suspended
      this._audioCtx.resume();
      // In case load occured during playback, we startPlayback
      if (this._isPlaying === true) {
        this.resumePlayback();
      }
      // Register ended event on track to reset player to time 0 when it occurs
      this._endEvtId = CustomEvents.addEvent('ended', this._player, this._trackEnded, this);
      // Fire event to refresh UI
      track.duration = this._player.duration;
      CustomEvents.publish(`Player/LoadTrack`, {
        name: this._name,
        value: track
      });
    };

    this._player.addEventListener('loadedmetadata', loadedListener);
  }


  _setupNodes() {
    this._player = document.createElement('AUDIO');
    this._nodes.source = this._audioCtx.createMediaElementSource(this._player);

    this._nodes.gain = this._audioCtx.createGain();
    this._nodes.gain.gain.value = this._gainValue;

    this._nodes.trimGain = this._audioCtx.createGain();
    this._nodes.trimGain.gain.value = 1;

    this._nodes.low = this._audioCtx.createBiquadFilter();
  	this._nodes.low.type = "lowshelf";
  	this._nodes.low.frequency.value = 320.0;
  	this._nodes.low.gain.value = 0.0;

  	this._nodes.mid = this._audioCtx.createBiquadFilter();
  	this._nodes.mid.type = "peaking";
  	this._nodes.mid.frequency.value = 1000.0;
  	this._nodes.mid.Q.value = 0.5;
  	this._nodes.mid.gain.value = 0.0;

  	this._nodes.high = this._audioCtx.createBiquadFilter();
  	this._nodes.high.type = "highshelf";
  	this._nodes.high.frequency.value = 3200.0;
  	this._nodes.high.gain.value = 0.0;

    this._nodes.filterLow = this._audioCtx.createBiquadFilter();
    this._nodes.filterLow.type = "lowpass";
    this._nodes.filterLow.Q.value = 0;

    this._nodes.filterHigh = this._audioCtx.createBiquadFilter();
    this._nodes.filterHigh.type = "highpass";
    this._nodes.filterHigh.Q.value = 0;

    this._connectNodes();
  }


  _connectNodes(lowFilter = false) {
    this._nodes.source.connect(this._nodes.low);
    this._nodes.low.connect(this._nodes.mid);
    this._nodes.mid.connect(this._nodes.high);
    this._nodes.high.connect(this._nodes.gain);
    this._nodes.gain.connect(this._nodes.trimGain);
    this._nodes.trimGain.connect(this._outputNode);
  }


  togglePlayback() {
    // Play/Pause toggle using API promises
    if (this._isPlaying === true) {
      this.pausePlayback();
    } else {
      this.resumePlayback();
    }
  }


  startPlayback() {
    if (this._player && this._player.src) {
      console.log('Start');
      this._isPlaying = true;
      this.resumePlayback();
    }
  }


  resumePlayback() {
    if (this._player && this._player.src) {
      this._isPlaying = true;
      this._player.play();
      this._startProgressClock();
      // Fire event to refresh UI
      CustomEvents.publish(`Player/Play`, {
        name: this._name
      });
    }
  }


  pausePlayback() {
    if (this._player && this._player.src) {
      this._isPlaying = false;
      this._player.pause();
      this._stopProgressClock();
      // Fire event to refresh UI
      CustomEvents.publish(`Player/Pause`, {
        name: this._name
      });
    }
  }


  stopPlayback() {
    if (this._player && this._player.src) {
      this.pausePlayback();
      this._player.currentTime = 0;
      console.log('stopPlayback');
    }
  }


  _trackEnded() {
    // Not updating isPlayoing as we want to keep this flag in case of new track loading
    console.log('track ended');
    this.stopPlayback();
    // Fire event to refresh UI
    CustomEvents.publish(`Player/Progress`, {
      name: this._name,
      value: {
        progress: 0,
        duration: this._player.duration
      }
    });
  }


  _startProgressClock() {
    // Fire event to refresh UI
    CustomEvents.publish(`Player/Progress`, {
      name: this._name,
      value: {
        progress: this._player.currentTime,
        duration: this._player.duration
      }
    });
    this._progressRafId = requestAnimationFrame(this._startProgressClock.bind(this));
  }


  _stopProgressClock() {
    cancelAnimationFrame(this._progressRafId);
    this._progressRafId = -1;
  }


  setVolume(value) {
    // Update internal gain value
    this._gainValue = value;
    // If gain node exists, apply new gain value
    if (this._nodes.gain) {
      this._nodes.gain.gain.value = value;
    }
    // Fire event to refresh UI
    CustomEvents.publish(`Player/SetVolume`, {
      name: this._name,
      value: value
    });
  }


  setTrimVolume(value) {
    const amount = Utils.convertKnobValue(value, 100);
    this._nodes.trimGain.gain.value = 1 + amount;
  }


  setProgress(percentage) {
    this._player.currentTime = (this._player.duration * percentage);
  }


  adjustProgressSlow(value) {
    this._adjustProgress(value, this._player.duration / this._audioCtx.sampleRate);
  }


  adjustProgressFast(value) {
    this._adjustProgress(value, (this._player.duration / this._audioCtx.sampleRate) * 5);
  }


  _adjustProgress(value, amount) {
    if (this._player && this._player.src) {
      if (value === 'increase') {
        this._player.currentTime += amount;
      } else if (value === 'decrease') {
        this._player.currentTime -= amount;
      }
    }
  }


  setTempo(value) {
    // If gain node exists, apply new gain value
    if (this._player && this._player.src) {
      const amount = Utils.convertTempoValue(value, 16);
      // Update player playback rate
      this._player.playbackRate = 1 + amount;
      // Fire event to refresh UI
      CustomEvents.publish(`Player/SetTempo`, {
        name: this._name,
        value: amount
      });
    }
  }


  /* EQ */


  setHighEQ(value) {
    this._setEQ('high', value);
  }


  setMidEQ(value) {
    this._setEQ('mid', value);
  }


  setLowEQ(value) {
    this._setEQ('low', value);
  }


  _setEQ(type, value) {
    // If gain node exists, apply new gain value
    if (this._player && this._player.src) {
      const amount = Utils.convertKnobValue(value, 26);
      // Update player playback rate
      this._nodes[type].gain.value = amount * 100;
    }
  }


  setFilter(value) {
    // Knob is not centered
    if (value !== 0.5) {
      // Disconnect high in chain to insert filter
      this._nodes.high.disconnect(0);
      if (value < 0.5) {
        this._lowFiltered = true;
        this._highFiltered = false;
        this._nodes.high.connect(this._nodes.filterLow);
        this._nodes.filterLow.connect(this._nodes.gain);
        const amount = Utils.convertKnobValue(value, 22050 - 320); // Keep 320Hz when lower end is reached
        this._nodes.filterLow.frequency.value = 22050 + (amount * 100); // Amount is negative
      } else if (value > 0.5) {
        this._lowFiltered = false;
        this._highFiltered = true;
        this._nodes.high.connect(this._nodes.filterHigh);
        this._nodes.filterHigh.connect(this._nodes.gain);
        const amount = Utils.convertKnobValue(value, 22050);
        this._nodes.filterLow.frequency.value = (amount * 100);
      }
    } else { // Remove filter from audio chain
      if (this._lowFiltered === true) {
        this._lowFiltered = false;
        this._nodes.filterLow.disconnect(0);
        this._nodes.high.connect(this._nodes.gain);
      } else if (this._highFiltered === true) {
        this._highFiltered = false;
        this._nodes.filterHigh.disconnect(0);
        this._nodes.high.connect(this._nodes.gain);
      }
    }
  }


  get sourceNode() {
    return this._nodes.trimGain;
  }


}


export default Player;
