import ModalBase from './ModalBase.js';


class TimelineColorsModal extends ModalBase {


  constructor(options) {
    super(options);

    this._name = options.name;
    this._colors = options.colors;

    this._dom = {
      title: null,
      background: null,
      track: null,
      mainBeat: null,
      subBeat: null,
      update: null
    };
  }


  _fillAttributes() {
    this._dom.title = document.getElementById('edit-timeline-colors-title');
    this._dom.background = document.getElementById('timeline-background-color');
    this._dom.track = document.getElementById('timeline-track-color');
    this._dom.mainBeat = document.getElementById('timeline-main-beats-color');
    this._dom.subBeat = document.getElementById('timeline-sub-beats-color');
    this._dom.update = document.getElementById('edit-timeline-colors-submit');

    this._dom.background.value = this._colors.background;
    this._dom.track.value = this._colors.track;
    this._dom.mainBeat.value = this._colors.mainBeat;
    this._dom.subBeat.value = this._colors.subBeat;

    this._dom.title.innerHTML = `${this._name.charAt(0).toUpperCase()}${this._name.slice(1)} Timeline Colors`;

    CustomEvents.addEvent('click', this._dom.update, this.updateColors, this);
  }


  updateColors() {
    Meax.sm.save(`${this._name}-timeline-color-background`, this._dom.background.value);
    Meax.sm.save(`${this._name}-timeline-color-track`, this._dom.track.value);
    Meax.sm.save(`${this._name}-timeline-color-main-beat`, this._dom.mainBeat.value);
    Meax.sm.save(`${this._name}-timeline-color-sub-beat`, this._dom.subBeat.value);
    Meax.ui.timelineColorUpdate({
      name: this._name,
      background: this._dom.background.value,
      track: this._dom.track.value,
      mainBeat: this._dom.mainBeat.value,
      subBeat: this._dom.subBeat.value
    });
    CustomEvents.removeEvent('click', this._dom.update, this.updateColors, this);
    this.close();
  }


}


export default TimelineColorsModal;
