import UserInterface from './core/UserInterface.js';
import DeviceHandler from './DeviceHandler.js';
import PlaybackController from './PlaybackController.js';
import Enums from './utils/Enums.js';
import CustomEvents from './utils/CustomEvents.js';


window.CustomEvents = new CustomEvents();


class ManaMeax {


  constructor() {
    console.log('created')
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
      if (actionId === Enums.Commands.LEFT_LOAD_TRACK && element.value === 'push') {
        this._pc.addTrack('left', '../assets/audio/FrequencyTest.flac');
      }
    } else if (componentId === Enums.Components.DECK_LEFT) {
      if (actionId === Enums.Commands.LEFT_PLAY) {
        if (element.value === 'push') {
          this._pc.togglePlayback('left');
        }
      } else if (actionId === Enums.Commands.LEFT_VOLUME) {
        this._pc.setVolume('left', element.value);
      } else if (actionId === Enums.Commands.LEFT_TEMPO) {
        this._pc.setTempo('left', element.value);
      }
    }
  }


}


export default ManaMeax;
