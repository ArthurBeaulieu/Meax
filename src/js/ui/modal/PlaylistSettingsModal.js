import ModalBase from './ModalBase.js';


class PlaylistSettingsModal extends ModalBase  {


  constructor(options) {
    super(options);

    this._playlist = options.playlist;
    this._callback = options.callback;

    this._cb = {
      update: options.updateCB,
      delete: options.deleteCB
    };

    this._dom = {
      name: null,
      color: null,
      update: null,
      delete: null
    };
  }


  _fillAttributes() {
    this._dom.title = document.getElementById('edit-playlist-settings-name');
    this._dom.color = document.getElementById('edit-playlist-settings-color');
    this._dom.update = document.getElementById('edit-playlist-settings-submit');
    this._dom.delete = document.getElementById('edit-playlist-settings-delete');
    this._evtIds.push(window.CustomEvents.addEvent('click', this._dom.update, this.updatePlaylist, this));
    this._evtIds.push(window.CustomEvents.addEvent('click', this._dom.delete, this.deletePlaylist, this));
  }


  updatePlaylist() {
    this._cb.update(this._playlist);
    this.close();
  }


  deletePlaylist() {
    this._cb.delete(this._playlist);
    this.close();
  }


}


export default PlaylistSettingsModal;
