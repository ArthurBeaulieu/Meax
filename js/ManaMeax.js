import UserInterface from './ui/UserInterface.js';
import DeviceHandler from './DeviceHandler.js';
import PlaybackController from './playback/PlaybackController.js';
import Enums from './utils/Enums.js';
import Utils from './utils/Utils.js';
import CustomEvents from './utils/CustomEvents.js';


window.CustomEvents = new CustomEvents();
window.Utils = new Utils();


class ManaMeax {


  constructor() {
    this._dh = null;
    this._pc = null;
    this._ui = null;
  }


  init() {
    this._dh = new DeviceHandler({
      onEvent: this._onControllerEvent.bind(this)
    });

    this._pc = new PlaybackController();
    this._ui = new UserInterface();
  }


  _onControllerEvent(element) {
    const componentId = element.id.charAt(0); // First bit is component ID
    const actionId = element.id.slice(1); // Remove ID bit to get command unique ID
    console.log(element, actionId)
    if (componentId === Enums.Components.MIXER) {
      this._mixerEvents(element, actionId);
    } else if (componentId === Enums.Components.DECK_LEFT) {
      this._deckEvents('left', element, actionId);
    } else if (componentId === Enums.Components.DECK_RIGHT) {
      this._deckEvents('right', element, actionId);
    } else if (componentId === Enums.Components.PAD_LEFT) {
      this._padEvents('left', element, actionId);
    } else if (componentId === Enums.Components.PAD_RIGHT) {
      this._padEvents('right', element, actionId);
    }
  }


  _mixerEvents(element, actionId) {
    if (actionId === Enums.Commands.LEFT_LOAD_TRACK && element.value === 'push') {
      const track = this._ui.getSelectedTrack();
      this._pc.addTrack('left', track);
    } else if (actionId === Enums.Commands.RIGHT_LOAD_TRACK && element.value === 'push') {
      const track = this._ui.getSelectedTrack();
      this._pc.addTrack('right', track);
    } else if (actionId === Enums.Commands.SELECTION_ROTARY) {
      this._ui.navigateInPlaylist('left', element.value);
    } else if (actionId === Enums.Commands.LEFT_FILTER) {
      this._pc.setFilter('left', element.value);
    } else if (actionId === Enums.Commands.RIGHT_FILTER) {
      this._pc.setFilter('right', element.value);
    } else if (actionId === Enums.Commands.CROSSFADER) {
      this._pc.crossFade(element.value);
    }
  }


  _deckEvents(side, element, actionId) {
    if (actionId === Enums.Commands.PLAY) {
      if (element.value === 'push') {
        this._pc.togglePlayback(side);
      }
    } else if (actionId === Enums.Commands.PLAY) {
      if (element.value === 'push') {
        this._pc.togglePlayback(side);
      }
    } else if (actionId === Enums.Commands.CUE_PHONES_LEFT) {
      if (element.value === 'push') {
        this._pc.setCuePhone(side, element);
      }
    } else if (actionId === Enums.Commands.VOLUME_TRIM) {
      this._pc.setTrimVolume(side, element.value);
    } else if (actionId === Enums.Commands.TEMPO) {
      this._pc.setTempo(side, element.value);
    } else if (actionId === Enums.Commands.JOGWHEEL_SLOW) {
      this._pc.adjustProgressSlow(side, element.value);
    } else if (actionId === Enums.Commands.JOGWHEEL_FAST) {
      this._pc.adjustProgressFast(side, element.value);
    } else if (actionId === Enums.Commands.HIGH_EQ) {
      this._pc.setHighEQ(side, element.value);
    } else if (actionId === Enums.Commands.MID_EQ) {
      this._pc.setMidEQ(side, element.value);
    } else if (actionId === Enums.Commands.LOW_EQ) {
      this._pc.setLowEQ(side, element.value);
    }
  }


  _padEvents(side, element, actionId) {
    if (actionId === Enums.Commands.PAD_1) {
      this._pc.setPad(side, element, 1);
    } else if (actionId === Enums.Commands.PAD_2) {
      this._pc.setPad(side, element, 2);
    } else if (actionId === Enums.Commands.PAD_3) {
      this._pc.setPad(side, element, 3);
    } else if (actionId === Enums.Commands.PAD_4) {
      this._pc.setPad(side, element, 4);
    } else if (actionId === Enums.Commands.PAD_5) {
      this._pc.setPad(side, element, 5);
    } else if (actionId === Enums.Commands.PAD_6) {
      this._pc.setPad(side, element, 6);
    } else if (actionId === Enums.Commands.PAD_7) {
      this._pc.setPad(side, element, 7);
    } else if (actionId === Enums.Commands.PAD_8) {
      this._pc.setPad(side, element, 8);
    }
  }


  get pc() {
    return this._pc;
  }


}


export default ManaMeax;
