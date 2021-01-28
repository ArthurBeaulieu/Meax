import LocalPlaylist from './playlist/LocalPlaylist';
import NewLocalPlaylistModal from "./modal/NewLocalPlaylistModal";
import PlaylistSettingsModal from "./modal/PlaylistSettingsModal";


class ViewManager {


  constructor() {
    this._dom = {
      browser: null,
      container: null,
      trackContainer: null,
      loadingOverlay: null,
      loadingProgress: null,
      newLocalPlaylist: null
    };

    this._playlists = [];
    this._tracks = [];
    this._selected = 0; // First track always selected on pl creation

    this._evtIds = [];

    this._init();
    this._events();
  }

  _init() {
    this._dom.browser = document.getElementById('saved-playlists');
    this._dom.container = document.getElementById('playlist-container');
    this._dom.trackContainer = document.getElementById('playlist-tracks');
    this._dom.loadingOverlay = document.createElement('DIV');
    this._dom.loadingProgress = document.createElement('P');
    this._dom.newLocalPlaylist = document.getElementById('new-local-playlist');

    this._dom.loadingOverlay.classList.add('loading-overlay');
    this._dom.loadingProgress.innerHTML = 'Scanning in progress...';
    this._dom.loadingOverlay.appendChild(this._dom.loadingProgress);

    const playlists = window.Meax.sm.getSavedPlaylists();
    for (let i = 0; i < playlists.length; ++i) {
      this._appendPlaylistInBrowser({
        name: playlists[i].key.split('-')[1]
      });
    }

    if (playlists.length > 0) {
      this._fillPlaylist(playlists[0].value);
    }
    /*
    const simulatedPl = [{
      url: './assets/audio/Teminite - 01 - Elevate.mp3',
      title: 'Elevate',
      artist: 'Teminite',
      bpm: '85',
      key: 'Fm',
      beatOffset: 0.16
    }, {
      url: './assets/audio/Teminite - 02 - Hot Fizz.mp3',
      title: 'Hot Fizz',
      artist: 'Teminite',
      bpm: '105',
      key: 'G♯m',
      beatOffset: 0.955
    }, {
      url: './assets/audio/Teminite - 03 - Don\'t Stop.mp3',
      title: 'Don\'t Stop',
      artist: 'Teminite',
      bpm: '140',
      key: 'Fm',
      beatOffset: 0.955
    }];
*/
  }


  _events() {
    window.CustomEvents.addEvent('click', this._dom.newLocalPlaylist, this._newLocalPlaylistClicked, this);
  }


  _newLocalPlaylistClicked() {
    new NewLocalPlaylistModal({
      url: 'assets/html/NewLocalPlaylistModal.html',
      callback: this._createNewPlaylist.bind(this)
    });
  }


  _createNewPlaylist(options) {
    const playlist = new LocalPlaylist(Object.assign(options, {
      createViewCB: this._initPlaylistView.bind(this),
      updateProgressCB: this._updateScanProgress.bind(this),
      scanEndedCB: this._scanEnded.bind(this)
    }));

    this._playlists.push(playlist);
    this._appendPlaylistInBrowser(playlist);
  }


  _appendPlaylistInBrowser(playlist) {
    const item = document.createElement('DIV');
    const name = document.createElement('P');
    const settings = document.createElement('IMG');
    item.classList.add('playlist-item');
    name.innerHTML = playlist.name;
    settings.src = './assets/img/menu.svg';
    item.appendChild(name);
    item.appendChild(settings);
    this._dom.browser.appendChild(item);

    window.CustomEvents.addEvent('click', settings, this._updatePlaylistSettingsClicked, {scope: this, pl: playlist });
  }


  _initPlaylistView() {
    this._dom.trackContainer.innerHTML = '';
    this._dom.container.appendChild(this._dom.loadingOverlay);
  }


  _updateScanProgress(number, total) {
    this._dom.loadingProgress.innerHTML = `Scanning in progress...<br>${number}/${total} tracks (${window.Utils.precisionRound((number / total) * 100, 2)}%)`;
  }


  _scanEnded(playlist, error) {
    this._dom.container.removeChild(this._dom.loadingOverlay);
    this._dom.loadingProgress.innerHTML = 'Scanning in progress...';

    if (error) {
      console.log('Something wrong happened in playlist scan', error);
    }

    this._fillPlaylist(playlist);
  }


  _fillPlaylist(playlist) {
    this._clearPlaylistView();

    for (let i = 0; i < playlist.tracks.length; ++i) {
      const track = document.createElement('DIV');
      const number = document.createElement('P');
      const title = document.createElement('P');
      const artist = document.createElement('P');
      const composer = document.createElement('P');
      const genre = document.createElement('P');
      const bpm = document.createElement('P');
      const key = document.createElement('P');

      track.classList.add('playlist-track');
      number.innerHTML = i + 1;
      title.innerHTML = playlist.tracks[i].title || '';
      artist.innerHTML = playlist.tracks[i].artist || '';
      composer.innerHTML = playlist.tracks[i].composer || '';
      genre.innerHTML = playlist.tracks[i].genre || '';
      bpm.innerHTML = playlist.tracks[i].bpm || '';
      key.innerHTML = playlist.tracks[i].key || '';

      track.dataset.id = i;
      track.info = playlist.tracks[i];

      track.appendChild(number);
      track.appendChild(title);
      track.appendChild(artist);
      track.appendChild(composer);
      track.appendChild(genre);
      track.appendChild(bpm);
      track.appendChild(key);

      this._dom.trackContainer.appendChild(track);
      this._tracks.push(track);
    }

    this._tracks[0].classList.add('selected');
    this._selected = 0;
  }


  _updatePlaylistSettingsClicked() {
    new PlaylistSettingsModal({
      url: 'assets/html/PlaylistSettingsModal.html',
      playlist: this.pl,
      deleteCB: this.scope.deletePlaylist.bind(this.scope),
      updateCB: this.scope.updatePlaylistSettings.bind(this.scope)
    });
  }


  _clearPlaylistView() {
    for (let i = 0; i < this._evtIds.length; ++i) {
      window.CustomEvents.removeEvent(this._evtIds[i]);
    }

    this._evtIds = [];
    this._tracks = [];
    this._dom.trackContainer.innerHTML = '';
  }


  deletePlaylist(playlist) {
    window.Meax.sm.remove(`playlist-${playlist.name}`);
    for (let i = 0; i < this._dom.browser.children.length; ++i) {
      // Taking P children (0) as reference to compare pl name
      if (this._dom.browser.children[i].children[0].innerHTML === playlist.name) {
        this._dom.browser.removeChild(this._dom.browser.children[i]);
        break;
      }
    }
    this._clearPlaylistView();
  }


  updatePlaylistSettings(options) {
    console.log('Update', options)
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

    this._tracks[this._selected].scrollIntoView({ block: 'center' });
  }


  get selectedTrack() {
    return this._tracks[this._selected].info;
  }


}


export default ViewManager;
