class Pad {


  constructor(options) {
    this._name = options.name;
    this._player = options.player;

    this._activeMode = 0; // HotCue by default

    this._hotCues = [-1, -1, -1, -1, -1, -1, -1, -1]; // 8 items as for DDJ-400
  }


  togglePad(deckSide, value, index) {
    // Fire event to refresh UI (border mostly)
    window.CustomEvents.publish('Pad/Set', {
      name: deckSide,
      pad: index + 1,
      shift: false,
      active: value.raw[2] === 127
    });

    if (value.value === 'push') { // Only do model actions on push action
      if (this._activeMode === 0) { // HotCue
        if (this._hotCues[index] === -1) { // Save the cue point
          const time = window.Meax.ui.getClosestBeatTime(deckSide);
          this._hotCues[index] = time;
          window.CustomEvents.publish('Pad/SaveHotCue', {
            name: deckSide,
            pad: index + 1,
            active: value.raw[2] === 127,
            time: time,
            color: window.Enums.DefaultColors.hotCue
          });
        } else { // Jump to its value
          this._player.currentTime = this._hotCues[index];
        }
      } else if (this._activeMode === 4) {
        const trackInfo = window.Meax.pc.getTrackInfo(deckSide);
        const offsetFactor = window.Meax.ui.getBeatJumpOffsetFactor(deckSide);
        if (trackInfo) { // A track is load, and as a bpm set
          if (index % 2 === 1) { // Fast forward
            this._player.currentTime += (60 / trackInfo.bpm) * Math.pow(2, (index - 1 + offsetFactor) / 2);
          } else { // Rewind
            this._player.currentTime -= (60 / trackInfo.bpm) * Math.pow(2, (index + offsetFactor) / 2);
          }
        }
      }
    }
  }


  shiftTogglePad(deckSide, value, index) {
    window.CustomEvents.publish('Pad/ShiftSet', {
      name: deckSide,
      pad: index + 1,
      shift: true,
      active: value.raw[2] === 127
    });

    if (value.value === 'push') { // Only do model actions on push action
      if (this._activeMode === 0) { // HotCue
        if (this._hotCues[index] !== -1) {
          window.CustomEvents.publish('Pad/RemoveHotCue', {
            name: deckSide,
            pad: index + 1,
            active: value.raw[2] === 127
          });

          if (this._hotCues[index] !== -1) {
            this._hotCues[index] = -1;
          }
        }
      }
    }
  }


  setPadType(deckSide, value, padNumber) {
    this._type = window.Enums.PerformanceType[padNumber + 1];
    this._activeMode = padNumber + 1;

    window.CustomEvents.publish('Pad/Type', {
      name: deckSide,
      pad: padNumber + 1,
      value: value.raw[2] === 127
    });
  }


  getHotCue(index) {
    if (index < this._hotCues.length) {
      return this._hotCues[index];
    }

    return null;
  }


}


export default Pad;
