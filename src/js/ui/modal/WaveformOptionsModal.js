import ModalBase from './ModalBase.js';


class WaveformOptionsModal extends ModalBase {


  constructor(options) {
    super(options);

    this._name = options.name;
    this._colors = options.colors;

    this._dom = {
      title: null,
      background: null,
      track: null,
      progress: null,
      progressBar: null,
      update: null
    };

    this._align = {
      top: null,
      center: null,
      bottom: null
    };

    this._alignValue = options.align || 'bottom';
  }


  _fillAttributes() {
    this._dom.title = document.getElementById('edit-waveform-options-title');
    this._dom.background = document.getElementById('waveform-background-color');
    this._dom.track = document.getElementById('waveform-track-color');
    this._dom.progress = document.getElementById('waveform-progress-color');
    this._dom.progressBar = document.getElementById('waveform-progress-bar-color');
    this._dom.update = document.getElementById('edit-waveform-options-submit');

    this._align.top = document.getElementById('waveform-align-top');
    this._align.center = document.getElementById('waveform-align-center');
    this._align.bottom = document.getElementById('waveform-align-bottom');

    this._align[this._alignValue].classList.add('selected');

    this._dom.background.value = this._colors.background;
    this._dom.track.value = this._colors.track;
    this._dom.progress.value = this._colors.progress;
    this._dom.progressBar.value = this._colors.progressBar;

    this._dom.title.innerHTML = `${this._name.charAt(0).toUpperCase()}${this._name.slice(1)} Waveform Options`;

    CustomEvents.addEvent('click', this._align.top, this.alignUpdate, this);
    CustomEvents.addEvent('click', this._align.center, this.alignUpdate, this);
    CustomEvents.addEvent('click', this._align.bottom, this.alignUpdate, this);
    CustomEvents.addEvent('click', this._dom.update, this.updateOptions, this);
  }


  updateOptions() {
    Meax.sm.save(`${this._name}-waveform-color-background`, this._dom.background.value);
    Meax.sm.save(`${this._name}-waveform-color-track`, this._dom.track.value);
    Meax.sm.save(`${this._name}-waveform-color-progress`, this._dom.progress.value);
    Meax.sm.save(`${this._name}-waveform-color-progress-bar`, this._dom.progressBar.value);
    Meax.sm.save(`${this._name}-waveform-align`, this._alignValue);
    Meax.ui.waveformOptionUpdate({
      name: this._name,
      background: this._dom.background.value,
      track: this._dom.track.value,
      progress: this._dom.progress.value,
      progressBar: this._dom.progressBar.value,
      align: this._alignValue
    });
    CustomEvents.removeEvent('click', this._dom.update, this.updateOptions, this);
    this.close();
  }


  alignUpdate(event) {
    this._align[this._alignValue].classList.remove('selected');
    this._alignValue = event.target.id.split('-')[2];
    this._align[this._alignValue].classList.add('selected');
    Meax.sm.save(`${this._name}-waveform-alignment`, this._alignValue);
  }


}


export default WaveformOptionsModal;
