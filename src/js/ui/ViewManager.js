import LocalPlaylist from './playlist/LocalPlaylist';
import NewLocalPlaylistModal from "./modal/NewLocalPlaylistModal";
import PlaylistSettingsModal from "./modal/PlaylistSettingsModal";


class ViewManager {


  constructor() {
    this._dom = {
      browser: null,
      container: null,
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
    this._dom.container.innerHTML = '';
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
      const loadLeft = document.createElement('DIV');
      const loadRight = document.createElement('DIV');
      track.classList.add('playlist-track');
      track.innerHTML = `${playlist.tracks[i].artist} - ${playlist.tracks[i].title}`;
      track.dataset.id = i;
      track.info = playlist.tracks[i];
      loadLeft.id = 'inject-left';
      loadRight.id = 'inject-right';
      loadLeft.innerHTML = '<img src="assets/img/inject.svg" alt="inject-left">';
      loadRight.innerHTML = '<img src="assets/img/inject.svg" alt="inject-right">';

      const injectClicked = function() { // Old function markup to get proper this on click elem
        const side = this.id.split('-')[1];
        window.Meax.pc.addTrack(side, track.info)
          .then(track => { window.Meax.ui.addTrack(side, track); });
      };

      this._evtIds.push(window.CustomEvents.addEvent('click', loadLeft, injectClicked, loadLeft));
      this._evtIds.push(window.CustomEvents.addEvent('click', loadRight, injectClicked, loadRight));

      track.appendChild(loadRight); // Reverse inject because float right re-reverse order
      track.appendChild(loadLeft);
      this._dom.container.appendChild(track);
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
    this._dom.container.innerHTML = '';
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
