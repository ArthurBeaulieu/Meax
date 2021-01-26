class Pad {


  constructor(options) {
    this._name = options.name;
    this._player = options.player;

    this._activeMode = 0; // HotCue by default

    this._hotCues = [-1, -1, -1, -1, -1, -1, -1, -1]; // 8 items as for DDJ-400
  }


  togglePad(deckSide, value, index) {
    // Fire event to refresh UI (border mostly)
    CustomEvents.publish('Pad/Set', {
      name: deckSide,
      pad: index + 1,
      shift: false,
      active: value.raw[2] === 127
    });

    if (value.value === 'push') { // Only do model actions on push action
      if (this._activeMode === 0) { // HotCue
        if (this._hotCues[index] === -1) { // Save the cue point
          const time = Meax.ui.getClosestBeatTime(deckSide);
          this._hotCues[index] = time;
          CustomEvents.publish('Pad/SaveHotCue', {
            name: deckSide,
            pad: index + 1,
            active: value.raw[2] === 127,
            time: time,
            color: Enums.DefaultColors.hotCue
          });
        } else { // Jump to its value
          this._player.currentTime = this._hotCues[index];
        }
      } else if (this._activeMode === 4) {
        const trackInfo = Meax.pc.getTrackInfo(deckSide);
        // TODO change scale (offseting index value for longer jump, need addition in UI)
        if (trackInfo) { // A track is load, and as a bpm set
          if (index % 2 === 1) { // Fast forward
            this._player.currentTime += (60 / trackInfo.bpm) * Math.pow(2, (index - 1) / 2);
          } else { // Rewind
            this._player.currentTime -= (60 / trackInfo.bpm) * Math.pow(2, index / 2);
          }
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
    this._type = Enums.PerformanceType[padNumber + 1];
    this._activeMode = padNumber + 1;

    CustomEvents.publish('Pad/Type', {
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
