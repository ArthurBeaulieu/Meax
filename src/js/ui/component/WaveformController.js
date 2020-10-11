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
      background: Meax.sm.get(`${this._name}-waveform-color-background`) || '#1D1E25', // Mzk background
      track: Meax.sm.get(`${this._name}-waveform-color-track`) || '#FFFFFF', // Dark green
      progress: Meax.sm.get(`${this._name}-waveform-color-progress`) || '#56D45B', // Mzk red
      progressBar: Meax.sm.get(`${this._name}-waveform-color-progress-bar`) || '#FF6B67' // Light grey
    };

    this._alignValue = Meax.sm.get(`${this._name}-waveform-alignment`) || 'bottom';

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

    this._waveform = new AudioVisualizer({
      type: 'waveform',
      player: Meax.pc.getPlayer(this._name),
      renderTo: document.querySelector(`#waveform-${this._name}`),
      fftSize: 1024,
      audioContext: Meax.pc.audioContext,
      inputNode: Meax.pc.getPlayerOutputNode(this._name),
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

    CustomEvents.addEvent('click', this._controls.modal, this.optionsUpdateModal, this);

    CustomEvents.addEvent('click', this._controls.progressBar.parentNode, event => {
      const percentage = (event.offsetX / this._controls.progressBar.parentNode.offsetWidth);
      Meax.pc.setProgress(this._name, percentage);
    }, this);

    CustomEvents.addEvent('timeupdate', Meax.pc.getPlayer(this._name), event => {
      this.updateProgress({
        progress: Meax.pc.getPlayer(this._name).currentTime,
        duration: Meax.pc.getPlayer(this._name).duration
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
    const modal = new WaveformOptionsModal({
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
