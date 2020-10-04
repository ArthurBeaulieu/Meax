import Pad from './Pad.js';


class HotCuePad extends Pad {


  constructor(options) {
    super({
      name: options.name,
      type: 'hotcue'
    });

    this._player = options.player;
    this._hotCues = [-1, -1, -1, -1, -1, -1, -1, -1]; // 8 items as for DDJ-400
  }


  togglePad(deckSide, value, index) {
    if (value.value === 'push') { // Only do model actions on push action
      if (this._hotCues[index] === -1) {
        this._hotCues[index] = this._player.currentTime;
        // Fire event to refresh UI
        CustomEvents.publish('Pad/SaveHotCue', {
          name: deckSide,
          pad: index + 1,
          active: value.raw[2] === 127 ? true : false,
          time: this._player.currentTime
        });
      } else {
        this._player.currentTime = this._hotCues[index];
        // Fire event to refresh UI
        CustomEvents.publish('Pad/Fire', {
          name: deckSide,
          pad: index + 1,
          active: value.raw[2] === 127 ? true : false
        });
      }
    }
    // Fire event to refresh UI
    CustomEvents.publish('Pad/Set', {
      name: deckSide,
      pad: index + 1,
      active: value.raw[2] === 127 ? true : false
    });
  }


  shiftTogglePad(index) {
    if (this._hotCues[index] !== -1) {
      this._hotCues[index] = -1;
    }
  }


}


export default HotCuePad;
