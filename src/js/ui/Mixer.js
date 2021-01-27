import Knob from './component/Knob.js';


class Mixer {


  constructor() {
    this._knobs = {};
    this._crossfaderTrack = null;
    this._crossfaderProgress = null;

    this._peakMeter = {
      left: null,
      right: null
    }

    this._buildCrossfader();
    this._buildKnobs();
  }


  _buildCrossfader() {
    this._crossfaderTrack = document.getElementById('crossfader-track');
    this._crossfaderProgress = document.getElementById('crossfader-progress');
  }


  _buildKnobs() {
    const sides = ['left', 'right'];
    const types = ['high', 'mid', 'low']
    for (let i = 0; i < sides.length; ++i) {
      for (let j = 0; j < types.length; ++j) {
        this._knobs[`${types[j]}${sides[i]}EQ`] = new Knob({
          target: document.getElementById(`eq-${types[j]}-${sides[i]}`),
          type: types[j],
          side: sides[i]
        });
      }
    }

    this._peakMeter.left = new window.AudioVisualizer({
      type: 'peakmeter', // Mandatory, either 'frequencybars', 'frequencycircle', 'oscilloscope', 'peakmeter' or 'spectrum'
      player: window.Meax.pc.getPlayer('left'), // Mandatory, the play to wire visualisation to
      audioContext: window.Meax.pc.audioContext,
      inputNode: window.Meax.pc.getPlayerOutputNode('left'),
      renderTo: document.querySelector(`#peakmeter-left`), // Mandatory, the HTML div to render component
      fftSize: 8192, // Optional (default 1024), Higher is smoother for vuemeter (doesn't consume much CPU)
      merged: true, // Optional (default false), Mix channel into single output
      orientation: 'vertical', // Optional (default horizontal), 'vertical' or 'horizontal'
      colors: { // Optional
        background: '#1D1E25', // Optional (default #1D1E25, dark grey), The canvas bg color
        min: '#56D45B', // Optional (default #56D45B, green), index 0
        step0: '#AFF2B3', // (default #AFF2B3, light green), index 0.7
        step1: '#FFAD67', // (default #FFAD67, orange), index 0.833
        step2: '#FF6B67', // (default #FF6B67, red), index 0.9
        max: '#FFBAB8' // (default #FFBAB8, light red), index 1
      }
    });

    this._peakMeter.right = new window.AudioVisualizer({
      type: 'peakmeter', // Mandatory, either 'frequencybars', 'frequencycircle', 'oscilloscope', 'peakmeter' or 'spectrum'
      player: window.Meax.pc.getPlayer('right'), // Mandatory, the play to wire visualisation to
      audioContext: window.Meax.pc.audioContext,
      inputNode: window.Meax.pc.getPlayerOutputNode('right'),
      renderTo: document.querySelector(`#peakmeter-right`), // Mandatory, the HTML div to render component
      fftSize: 8192, // Optional (default 1024), Higher is smoother for vuemeter (doesn't consume much CPU)
      merged: true, // Optional (default false), Mix channel into single output
      orientation: 'vertical', // Optional (default horizontal), 'vertical' or 'horizontal'
      colors: { // Optional
        background: '#1D1E25', // Optional (default #1D1E25, dark grey), The canvas bg color
        min: '#56D45B', // Optional (default #56D45B, green), index 0
        step0: '#AFF2B3', // (default #AFF2B3, light green), index 0.7
        step1: '#FFAD67', // (default #FFAD67, orange), index 0.833
        step2: '#FF6B67', // (default #FF6B67, red), index 0.9
        max: '#FFBAB8' // (default #FFBAB8, light red), index 1
      }
    });
  }


  updateCrossfader(options) {
    this._crossfaderProgress.style.right = `calc(${100 - (options.value * 100)}% - 5px)`;
  }


  updateKnob(options) {
    if (options.name === 'left' || options.name === 'right') {
      this._knobs[`${options.type}${options.name}EQ`].setValue(options.value);
    }
  }


}


export default Mixer;
