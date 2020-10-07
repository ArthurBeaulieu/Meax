

class Timeline {


  constructor(name) {
    this._name = name;
    this._timeline = null;
    this._buildWaveform();
  }


  _buildWaveform() {
    this._timeline = new AudioVisualizer({
      type: 'timeline',
      player: Meax.pc.getPlayer(this._name), // Mandatory, the play to wire visualisation to
      audioContext: Meax.pc.audioContext,
      inputNode: Meax.pc.getPlayerOutputNode(this._name),
      renderTo: document.querySelector(`#timeline-${this._name}`), // Mandatory, the HTML div to render component
      fftSize: 1024, // Optional (default 1024), Higher is smoother for vuemeter (doesn't consume much CPU)
      speed: 9, // Optional (default 5), how many seconds does the canvas fit at once
      beat: {
        offset: 0.19,
        bpm: 170,
        timeSignature: 4
      },
      colors: { // Optional
        background: '#1D1E25', // Mzk background
        track: '#12B31D', // Dark green
        mainBeat: '#FF6B67', // Mzk red
        subBeat: '#56D45B' // Light grey
      },
      hotCues: []
    });
  }


  getClosestBeatTime() {
    return this._timeline.setHotCuePoint(true);
  }


  setHotCuePoint() {
    return this._timeline.setHotCuePoint();
  }


}


export default Timeline;
