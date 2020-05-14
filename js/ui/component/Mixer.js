import Knob from './Knob.js';


class Mixer {


  constructor() {
    this._knobs = {};

    this._buildKnobs();
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

    new MzkVisualizer({
      type: 'peakmeter', // Mandatory, either 'frequencybars', 'frequencycircle', 'oscilloscope', 'peakmeter' or 'spectrum'
      player: MzkMeax.pc.getPlayer('left'), // Mandatory, the play to wire visualisation to
      audioContext: MzkMeax.pc.audioContext,
      input: MzkMeax.pc.getPlayerOutputNode('left'),
      renderTo: document.querySelector(`#peakmeter-left`), // Mandatory, the HTML div to render component
      fftSize: 8192, // Optional (default 1024), Higher is smoother for vuemeter (doesn't consume much CPU)
      merged: true,
      legend: false,
      orientation: 'vertical'
    });

    new MzkVisualizer({
      type: 'peakmeter', // Mandatory, either 'frequencybars', 'frequencycircle', 'oscilloscope', 'peakmeter' or 'spectrum'
      player: MzkMeax.pc.getPlayer('right'), // Mandatory, the play to wire visualisation to
      audioContext: MzkMeax.pc.audioContext,
      input: MzkMeax.pc.getPlayerOutputNode('right'),
      renderTo: document.querySelector(`#peakmeter-right`), // Mandatory, the HTML div to render component
      fftSize: 8192, // Optional (default 1024), Higher is smoother for vuemeter (doesn't consume much CPU)
      merged: true,
      legend: false,
      orientation: 'vertical'
    });
  }


  updateKnob(options) {
    if (options.name === 'left' || options.name === 'right') {
      this._knobs[`${options.type}${options.name}EQ`].setValue(options.value);
    }
  }


}


export default Mixer;
