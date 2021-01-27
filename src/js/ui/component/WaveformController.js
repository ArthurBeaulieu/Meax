import WaveformOptionsModal from '../modal/WaveformOptionsModal.js';


class WaveformController {


  constructor(name) {
    this._name = name;
    this._waveform = null;

    this._controls = {
      modal: null,
      progressBar: null,
    };

    this._colors = {
      background: window.Meax.sm.get(`${this._name}-waveform-color-background`) || '#1D1E25', // Mzk background
      track: window.Meax.sm.get(`${this._name}-waveform-color-track`) || '#FFFFFF', // Dark green
      progress: window.Meax.sm.get(`${this._name}-waveform-color-progress`) || '#56D45B', // Mzk red
      progressBar: window.Meax.sm.get(`${this._name}-waveform-color-progress-bar`) || '#FF6B67' // Light grey
    };

    this._alignValue = window.Meax.sm.get(`${this._name}-waveform-alignment`) || 'bottom';

    this._buildWaveform();
    this._setControls();
    this._updateModalPosition();
  }


  _buildWaveform() {
    if (this._waveform) {
      document.querySelector(`#waveform-${this._name}`).innerHTML = '';
      this._waveform.destroy();
      this._waveform = null;
    }

    this._waveform = new window.AudioVisualizer({
      type: 'waveform',
      player: window.Meax.pc.getPlayer(this._name),
      renderTo: document.querySelector(`#waveform-${this._name}`),
      fftSize: 1024,
      audioContext: window.Meax.pc.audioContext,
      inputNode: window.Meax.pc.getPlayerOutputNode(this._name),
      animation: 'gradient',
      wave: {
        align: this._alignValue,
        barWidth: 1,
        barMarginScale: 0,
      },
      colors: {
        background: this._colors.background,
        track: this._colors.track,
        progress: this._colors.progress
      },
      hotCues: this._hotCues
    });
  }


  _setControls() {
    this._controls.modal = document.getElementById(`waveform-${this._name}-colors`);
    this._controls.progressBar = document.getElementById(`track-waveform-progress-${this._name}`);

    window.CustomEvents.addEvent('click', this._controls.modal, this.optionsUpdateModal, this);

    window.CustomEvents.addEvent('click', this._controls.progressBar.parentNode, event => {
      const percentage = (event.offsetX / this._controls.progressBar.parentNode.offsetWidth);
      window.Meax.pc.setProgress(this._name, percentage);
    }, this);

    window.CustomEvents.addEvent('timeupdate', window.Meax.pc.getPlayer(this._name), () => {
      this.updateProgress({
        progress: window.Meax.pc.getPlayer(this._name).currentTime,
        duration: window.Meax.pc.getPlayer(this._name).duration
      });
    }, this);
  }


  _updateModalPosition() {
    if (this._alignValue === 'top') {
      this._controls.modal.classList.add('bottom');
    } else {
      this._controls.modal.classList.remove('bottom');
    }
  }


  optionsUpdateModal(event) {
    event.stopPropagation();
    new WaveformOptionsModal({
      name: this._name,
      colors: this._colors,
      align: this._alignValue,
      url: 'assets/html/WaveformOptionsModal.html'
    });
  }


  updateProgress(options) {
    this._controls.progressBar.style.width = `${(options.progress / options.duration) * 100}%`;
  }


  setHotCue(hotCue) {
    if (hotCue) {
      this._waveform.setHotCuePoint(hotCue);
    }
  }


  removeHotCue(hotCue) {
    if (hotCue) {
      this._waveform.removeHotCuePoint(hotCue);
    }
  }


  updateHotCue(hotCue, options) {
    if (hotCue) {
      this._waveform.updateHotCuePoint(hotCue, options);
    }
  }


  setWaveformOptions(options) {
    this._colors.background = options.background;
    this._colors.track = options.track;
    this._colors.progress = options.progress;
    this._colors.progressBar = options.progressBar;
    this._alignValue = options.align;
    this._updateModalPosition();
    this._buildWaveform();
  }


}


export default WaveformController;
