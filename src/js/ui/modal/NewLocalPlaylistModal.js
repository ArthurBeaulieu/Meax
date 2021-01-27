import ModalBase from './ModalBase.js';
import DropElement from '../../utils/DropElement';


class NewLocalPlaylistModal extends ModalBase  {


  constructor(options) {
    super(options);

    this._callback = options.callback;

    this._dom = {
      name: null,
      color: null,
      drop: null,
      create: null
    };

    this._dropContainer = null;
    this._jsonFilename = '';
    this._jsonData = null;
  }


  _fillAttributes() {
    this._dom.title = document.getElementById('new-local-playlist-name');
    this._dom.color = document.getElementById('new-local-playlist-color');
    this._dom.drop = document.getElementById('new-local-playlist-drop');
    this._dom.create = document.getElementById('new-local-playlist-submit');
    this._evtIds.push(window.CustomEvents.addEvent('click', this._dom.create, this.createLocalPlaylist, this));

    this._dropContainer = new DropElement({
      target: this._dom.drop,
      onDrop: this._fileDropped.bind(this)
    });
  }


  _fileDropped(file, data) {
    this._dom.drop.innerHTML = `<p>${file.name}</p>`;
    this._jsonFilename = file.name;
    this._jsonData = data;
  }


  createLocalPlaylist() {
    if (this._jsonData) {
      let title = this._dom.title.value;
      if (title === '') {
        title = this._jsonFilename.split('.')[0];
      }

      this._dropContainer.destroy();
      this.close();
      this._callback({
        name: title,
        color: this._dom.color.value,
        data: this._jsonData,
        fromLs: false
      });
    } else {
      console.log('Please drop a JSON file');
    }
  }


}


export default NewLocalPlaylistModal;
