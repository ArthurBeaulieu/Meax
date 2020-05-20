

class Timeline {


  constructor(name) {
    this._name = name;
    this._buildWaveform();
  }


  _buildWaveform() {
    new MzkVisualizer({
      type: 'timeline',
      player: MzkMeax.pc.getPlayer(this._name), // Mandatory, the play to wire visualisation to
      audioContext: MzkMeax.pc.audioContext,
      input: MzkMeax.pc.getPlayerOutputNode(this._name),
      renderTo: document.querySelector(`#timeline-${this._name}`), // Mandatory, the HTML div to render component
      fftSize: 1024, // Optional (default 1024), Higher is smoother for vuemeter (doesn't consume much CPU)
      speed: 10, // Optional (default 5), how many seconds does the canvas fit at once
      beatStart: 0, // The time where first beat kick (so far, handle 4/4 time signature only)
      bpm: 75,
      timeSignature: '4/4', // Optional (default 4/4), the track time signature
      colors: { // Optional
        background: '#1D1E25', // The canvas bg color (default #1D1E25)
        track: '#56D45B' // The waveform color (default #E7E9E7)
      }
    });
  }


}


export default Timeline;
