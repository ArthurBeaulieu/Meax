import ModalBase from './ModalBase.js';


class EditCueModal extends ModalBase  {


  constructor(options) {
    super(options);

    this._name = options.name;
    this._title = options.title;
    this._hotCue = options.hotCue;

    this._dom = {
      title: null,
      color: null,
      update: null
    };
  }


  _fillAttributes() {
    this._dom.title = document.getElementById('hot-cue-title');
    this._dom.color = document.getElementById('hot-cue-color');
    this._dom.update = document.getElementById('edit-hot-cue-submit');
    this._dom.color.value = this._hotCue.color;
    this._dom.title.value = this._title;
    CustomEvents.addEvent('click', this._dom.update, this.updateHotCue, this);
  }


  updateHotCue() {
    this._hotCue.color = this._dom.color.value;
    this._hotCue.title = this._dom.title.value;
    Meax.ui.updateHotCue(this._name, this._hotCue);
    CustomEvents.removeEvent('click', this._dom.update, this.updateHotCue, this);
    this.close();
  }


}


export default EditCueModal;
