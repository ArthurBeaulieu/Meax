class Playlist {


  constructor() {
    this._dom = {
      container: null,
    };

    this._tracks = [];
    this._selected = 0; // First track always selcted on pl creation

    this._init();
  }

  _init() {
    this._dom.container = document.getElementById('playlist-container');

    const simulatedPl = [{
      url: '../ManaMeax/assets/audio/Teminite - 01 - Elevate.mp3',
      title: 'Elevate',
      artist: 'Teminite',
      bpm: '170',
      key: 'Fm'
    }, {
      url: '../ManaMeax/assets/audio/Teminite - 02 - Hot Fizz.mp3',
      title: 'Hot Fizz',
      artist: 'Teminite',
      bpm: '105',
      key: 'G♯m'
    }, {
      url: '../ManaMeax/assets/audio/Teminite - 03 - Don\'t Stop.mp3',
      title: 'Don\'t Stop',
      artist: 'Teminite',
      bpm: '140',
      key: 'Fm'
    }];

    for (let i = 0; i < simulatedPl.length; ++i) {
      const track = document.createElement('DIV');
      track.classList.add('playlist-track');
      track.innerHTML = `${simulatedPl[i].artist} - ${simulatedPl[i].title}`;
      track.dataset.id = i;
      track.info = simulatedPl[i];
      this._dom.container.appendChild(track);
      this._tracks.push(track);
    }

    this._tracks[0].classList.add('selected');
    this._selected = 0;
  }


  navigateInPlaylist(value) {
    if (value === 'increase') {
      this._tracks[this._selected].classList.remove('selected');
      this._selected = (this._selected + 1) % this._tracks.length;
      this._tracks[this._selected].classList.add('selected');
    } else if (value === 'decrease') {
      this._tracks[this._selected].classList.remove('selected');
      this._selected = (this._selected - 1 + this._tracks.length) % this._tracks.length;
      this._tracks[this._selected].classList.add('selected');
    }
  }


  get selectedTrack() {
    return this._tracks[this._selected].info;
  }


}


export default Playlist;
