class Pad {


  constructor(options) {
    this._name = options.name;
    this._player = options.player;

    this._activeMode = 0; // HotCue by default

    this._hotCues = [-1, -1, -1, -1, -1, -1, -1, -1]; // 8 items as for DDJ-400
  }


  togglePad(deckSide, value, index, shift) {
    // Fire event to refresh UI (border mostly)
    CustomEvents.publish('Pad/Set', {
      name: deckSide,
      pad: index + 1,
      shift: false,
      active: value.raw[2] === 127 ? true : false
    });

    if (value.value === 'push') { // Only do model actions on push action
      if (this._activeMode === 0) {
         /* HotCue */
        if (this._hotCues[index] === -1) {
          this._hotCues[index] = this._player.currentTime;
          CustomEvents.publish('Pad/SaveHotCue', {
            name: deckSide,
            pad: index + 1,
            active: value.raw[2] === 127 ? true : false,
            time: this._player.currentTime
          });
        } else {
          this._player.currentTime = this._hotCues[index];
        }
      }
    }
  }


  shiftTogglePad(deckSide, value, index) {
    CustomEvents.publish('Pad/ShiftSet', {
      name: deckSide,
      pad: index + 1,
      shift: true,
      active: value.raw[2] === 127 ? true : false
    });

    if (value.value === 'push') { // Only do model actions on push action
      if (this._activeMode === 0) { // HotCue
        if (this._hotCues[index] !== -1) {
          CustomEvents.publish('Pad/RemoveHotCue', {
            name: deckSide,
            pad: index + 1,
            active: value.raw[2] === 127 ? true : false
          });

          if (this._hotCues[index] !== -1) {
            this._hotCues[index] = -1;
          }
        }
      }
    }
  }


  setPadType(deckSide, value, padNumber) {
    if (this._activeMode === 0 && this._activeMode !== padNumber) {
      this._hotCues = [-1, -1, -1, -1, -1, -1, -1, -1];
      CustomEvents.publish('Pad/ClearSelection', {
        name: deckSide,
        pad: padNumber + 1,
        active: value.raw[2] === 127 ? true : false
      });
    }

    this._type = Enums.PerformanceType[padNumber + 1];
    this._activeMode = padNumber + 1;

    CustomEvents.publish('Pad/Type', {
      name: deckSide,
      pad: padNumber + 1,
      value: value.raw[2] === 127 ? true : false
    });
  }


}


export default Pad;
