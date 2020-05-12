class Player {


  constructor(options) {
    this._name = options.name;
    this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this._audioBuffer = null;

    this._nodes = {
      source: null,
      gain: null
    }

    this._endEvtId = -1;

    this._playbackStarted = false;
    this._isPlaying = false;
    this._gainValue = 1;
    this._tempoValue = 1;
  }


  loadTrack(url) {
    console.log('load track')
    // Checking if any previous source node is playing. If true, we clean it
    if (this._isPlaying || this._playbackStarted) {
      this.stopPlayback();
      CustomEvents.removeEvent(this._endEvtId);
      this._isPlaying = true; // Must restore flag to automatically start playback if load occured on playing track
    }

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = () => {
      console.log('track loaded')
      this._audioCtx.decodeAudioData(request.response, buffer => {
        this._audioBuffer = buffer; // Save audio buffer data to recreate source node
        this._connectNodes();
        // In case load occured during playback, we startPlayback
        if (this._isPlaying === true) {
          this.startPlayback();
        }

        this._endEvtId = CustomEvents.addEvent('ended', this._nodes.source, this._trackEnded, this);
      }, err => {
        console.log(err)
      });
    };

    request.send();
  }


  _connectNodes() {
    this._nodes.source = this._audioCtx.createBufferSource();
    this._nodes.source.buffer = this._audioBuffer;
    this._nodes.gain = this._audioCtx.createGain();
    this._nodes.gain.gain.value = this._gainValue;
    this._nodes.source.connect(this._nodes.gain);
    this._nodes.gain.connect(this._audioCtx.destination);
  }


  _disconnectNodes() {
    this._nodes.gain.disconnect(this._audioCtx.destination);
  }


  togglePlayback() {
    if (this._audioBuffer) {
      // New track has been loaded, need to start playback
      if (this._playbackStarted === false) {
        this.startPlayback();
        return;
      }
      // Play/Pause toggle using API promises
      if (this._audioCtx.state === 'running') {
        this.pausePlayback();
      } else if (this._audioCtx.state === 'suspended') {
        this.resumePlayback();
      } else {
        console.log('Can not play, unsupported AudioContext state :', this._audioCtx.state);
      }
    }
  }


  startPlayback() {
    console.log('Start');
    this._nodes.source.start(this._audioCtx.currentTime);
    this._playbackStarted = true;
    this._isPlaying = true;
    this.resumePlayback();
  }


  resumePlayback() {
    this._audioCtx.resume().then(() => {
      this._isPlaying = false;
      // Fire event to refresh UI
      console.log('play')
      CustomEvents.publish(`Player/Play`, {
        name: this._name
      });
    });
  }


  pausePlayback() {
    this._audioCtx.suspend().then(() => {
      this._isPlaying = true;
      // Fire event to refresh UI
      CustomEvents.publish(`Player/Pause`, {
        name: this._name
      });
    });
  }


  stopPlayback() {
    this._isPlaying = false;
    console.log('stopPlayback');
    this._nodes.source.stop(0);
    this._disconnectNodes();
  }


  _trackEnded() {
    // Not updating isPlayoing as we want to keep this flag in case of new track loading
    console.log('track ended');
    this._disconnectNodes();
    this._connectNodes();
    this._playbackStarted = false; // Prepare to call start on next play call
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


  setTempo(value) {
    // Update internal gain value
    this._tempoValue = value;
    console.log(value, this._nodes.source.playbackRate.value)
    // If gain node exists, apply new gain value
    if (this._nodes.source) {
      let amount = 0;
      if (value < 0.5) {
        amount = -(0.5 + value);
      } else if (value > 0.5) {
        amount = value - 0.5;
      }

      this._nodes.source.playbackRate.value = 1 + amount;
    }
    // Fire event to refresh UI
    CustomEvents.publish(`Player/SetTempo`, {
      name: this._name,
      value: value
    });
  }


}


export default Player;
