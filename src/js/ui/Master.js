import Knob from './component/Knob.js';


class Master {


  constructor() {
    this._headphoneCueMaster = null;
    this._headphonesMasterOn = false;

    this._knobs = {
      headphone: null,
      mix: null,
      master: null
    };

    this._dom = {
      clock: null
    };

    this._peakMeter = null;

    this._init();
    this._addEvents();
  }


  _init() {
    this._headphoneCueMaster = document.getElementById(`headphones-master`);

    this._knobs.master = new Knob({
      target: document.getElementById('master-global'),
      type: 'master',
      side: 'global'
    });

    this._knobs.headphone = new Knob({
      target: document.getElementById('headphone-global'),
      type: 'headphone',
      side: 'global',
      fromZero: true
    });

    this._knobs.mix = new Knob({
      target: document.getElementById('mix-global'),
      type: 'mix',
      side: 'global'
    });

    this._peakMeter = new window.AudioVisualizer({
      type: 'peakmeter', // Mandatory, either 'frequencybars', 'frequencycircle', 'oscilloscope', 'peakmeter' or 'spectrum'
      player: window.Meax.pc.getPlayer('left'), // Mandatory, the play to wire visualisation to
      audioContext: window.Meax.pc.audioContext,
      inputNode: window.Meax.pc.getMasterOutputNode(),
      renderTo: document.querySelector(`#peakmeter-master`), // Mandatory, the HTML div to render component
      fftSize: 8192, // Optional (default 1024), Higher is smoother for vuemeter (doesn't consume much CPU)
      merged: false, // Optional (default false), Mix channel into single output
      orientation: 'horizontal' // Optional (default horizontal), 'vertical' or 'horizontal'
    });

    this._dom.clock = document.getElementById('clock');
  }


  _addEvents() {
    window.CustomEvents.addEvent('click', this._headphoneCueMaster, () => {
      this.toggleMasterPhoneCue();
      window.Meax.pc.setMasterCuePhone({
        raw: [
          150,
          99,
          (this._headphoneCueMaster.classList.contains('enabled') ? 127 : 0) // See midi controller for values
        ]
      });
    }, this);

    setInterval(this._updateClock.bind(this), 1000);
  }


  _updateClock() {
    this._dom.clock.innerHTML = new Date().toLocaleTimeString();
  }


  toggleMasterPhoneCue() {
    if (!this._headphonesMasterOn) {
      this._headphoneCueMaster.classList.add('enabled');
    } else {
      this._headphoneCueMaster.classList.remove('enabled');
    }

    this._headphonesMasterOn = !this._headphonesMasterOn;
  }


  setMasterVolume(options) {
    this._knobs.master.setValue(options.value);
  }


  setHeadphoneVolume(value) {
    this._knobs.headphone.setValue(value, true);
  }


  setMix(value) {
    this._knobs.mix.setValue(value);
  }


}


export default Master;
