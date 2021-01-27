import BeatDetect from '../../utils/BeatDetect';


class LocalPlaylist {


  constructor(options) {
    this._name = options.name;
    this._color = options.color;
    this._data = options.data;
    this._fromLs = options.fromLs;

    this._cb = {
      createView: options.createViewCB,
      updateProgress: options.updateProgressCB,
      scanEnded: options.scanEndedCB
    };

    this._tracks = [];

    if (this._fromLs) {
      this._cb.createView();
      this._cb.scanEnded(this);
    } else {
      this._loadTrackInfo();
    }
  }


  _loadTrackInfo() {
    const beatDetect = new BeatDetect({
      sampleRate: 44100, // Most track are using this sample rate
      float: 4, // The floating precision in [1, Infinity]
      bpmRange: [90, 180], // The BPM range to output
      timeSignature: 4 // The number of beat in a measure
    });

    this._computeBpm(beatDetect, 0);
    this._cb.createView();
  }


  _computeBpm(beatDetect, i) {
    beatDetect.getBeatInfo({
      url: this._data.tracks[i].url
    }).then(info => {
      this._data.tracks[i].bpm = info.bpm;
      this._data.tracks[i].beatOffset = info.offset;
      this._data.tracks[i].firstBar = info.firstBar;
      this._cb.updateProgress(i + 1, this._data.tracks.length);
      if (i + 1 === this._data.tracks.length) {
        this._cb.scanEnded(this);
        this._savePlaylistInLs();
      } else {
        this._computeBpm(beatDetect, i + 1);
      }
    }).catch(error => {
      this._cb.scanEnded(this, error);
    });
  }


  _savePlaylistInLs() {
    window.Meax.sm.save(`playlist-${this._name}`, this._data);
  }


  get name() {
    return this._name;
  }


  get tracks() {
    return this._data.tracks;
  }


}


export default LocalPlaylist;