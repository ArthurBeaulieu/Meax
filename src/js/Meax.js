import UserInterface from './core/UserInterface.js';
import DeviceHandler from './core/DeviceHandler.js';
import PlaybackController from './core/PlaybackController.js';

import Enums from './utils/Enums.js';
import Utils from './utils/Utils.js';
import CustomEvents from './utils/CustomEvents.js';


window.CustomEvents = new CustomEvents();
window.Utils = new Utils();
window.Enums = Enums;

class Meax {


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
    console.log(element);
    // First bit is component ID
    const componentId = element.id.charAt(0);
    // Remove ID bit to get command unique ID
    const actionId = element.id.slice(1);
    // Analyse event origin and type to call proper method
    if (componentId === Enums.Components.MIXER) {
      this._mixerEvents(element, actionId);
    } else if (componentId === Enums.Components.DECK_LEFT) {
      this._deckEvents('left', element, actionId);
    } else if (componentId === Enums.Components.DECK_RIGHT) {
      this._deckEvents('right', element, actionId);
    } else if (componentId === Enums.Components.PAD_LEFT) {
      this._padEvents('left', element, actionId, false);
    } else if (componentId === Enums.Components.PAD_LEFT_SHIFT) {
      this._padEvents('left', element, actionId, true);
    } else if (componentId === Enums.Components.PAD_RIGHT) {
      this._padEvents('right', element, actionId, false);
    } else if (componentId === Enums.Components.PAD_RIGHT_SHIFT) {
      this._padEvents('right', element, actionId, true);
    }
  }


  _mixerEvents(element, actionId) {
    if (actionId === Enums.Commands.LEFT_LOAD_TRACK && element.value === 'push') {
      // Add track on left deck update model in pc then update UI with track info (duration, bpm etc)
      this._pc.addTrack('left', this._ui.getSelectedTrack())
        .then(track => { this._ui.addTrack('left', track); });
    } else if (actionId === Enums.Commands.RIGHT_LOAD_TRACK && element.value === 'push') {
      // Add track on right deck update model in pc then update UI with track info (duration, bpm etc)
      this._pc.addTrack('right', this._ui.getSelectedTrack())
        .then(track => { this._ui.addTrack('right', track); });
    } else if (actionId === Enums.Commands.SELECTION_ROTARY) {
      // Navigate on pl is a UI only action
      this._ui.navigateInPlaylist('left', element.value);
    } else if (actionId === Enums.Commands.LEFT_FILTER) {
      // Left filter knob first applies HPF or HPF on channel output, then update the UI knob
      this._pc.setFilter('left', element.value).then(options => { this._ui.setFilter('left', options); });
    } else if (actionId === Enums.Commands.RIGHT_FILTER) {
      // Right filter knob first applies HPF or HPF on channel output, then update the UI knob
      this._pc.setFilter('right', element.value).then(options => { this._ui.setFilter('right', options); });
    } else if (actionId === Enums.Commands.CROSSFADER) {
      this._pc.crossFade(element.value);
    }
  }


  _deckEvents(side, element, actionId) {
    if (actionId === Enums.Commands.PLAY && element.value === 'push') {
      const playStatus = this._pc.togglePlayback(side, element);
      this._dh.sendMIDIMessage([element.raw[0], element.raw[1], playStatus]);
    } else if (actionId === Enums.Commands.CUE_PHONES_LEFT && element.value === 'push') {
      this._pc.setCuePhone(side, element);
    } else if (actionId === Enums.Commands.PERFORMANCE_TAB_1) {
      this._pc.setPadType(side, element, 0);
    } else if (actionId === Enums.Commands.PERFORMANCE_TAB_2) {
      this._pc.setPadType(side, element, 1);
    } else if (actionId === Enums.Commands.PERFORMANCE_TAB_3) {
      this._pc.setPadType(side, element, 2);
    } else if (actionId === Enums.Commands.PERFORMANCE_TAB_4) {
      this._pc.setPadType(side, element, 3);
    } else if (actionId === Enums.Commands.PERFORMANCE_TAB_5) {
      this._pc.setPadType(side, element, 4);
    } else if (actionId === Enums.Commands.PERFORMANCE_TAB_6) {
      this._pc.setPadType(side, element, 5);
    } else if (actionId === Enums.Commands.PERFORMANCE_TAB_7) {
      this._pc.setPadType(side, element, 6);
    } else if (actionId === Enums.Commands.PERFORMANCE_TAB_8) {
      this._pc.setPadType(side, element, 7);
    } else if (actionId === Enums.Commands.VOLUME) {
      this._pc.setVolume(side, element.value);
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


  _padEvents(side, element, actionId, shift) {
    if (actionId === Enums.Commands.PAD_1) {
      this._pc.setPad(side, element, 1, shift);
    } else if (actionId === Enums.Commands.PAD_2) {
      this._pc.setPad(side, element, 2, shift);
    } else if (actionId === Enums.Commands.PAD_3) {
      this._pc.setPad(side, element, 3, shift);
    } else if (actionId === Enums.Commands.PAD_4) {
      this._pc.setPad(side, element, 4, shift);
    } else if (actionId === Enums.Commands.PAD_5) {
      this._pc.setPad(side, element, 5, shift);
    } else if (actionId === Enums.Commands.PAD_6) {
      this._pc.setPad(side, element, 6, shift);
    } else if (actionId === Enums.Commands.PAD_7) {
      this._pc.setPad(side, element, 7, shift);
    } else if (actionId === Enums.Commands.PAD_8) {
      this._pc.setPad(side, element, 8, shift);
    }

    this._dh.sendMIDIMessage(element.raw);
  }


  get pc() {
    return this._pc;
  }

  get dh() {
    return this._dh;
  }


}


window.Meax = new Meax();
export default Meax;
