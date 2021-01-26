import Master from '../ui/Master.js';
import Deck from '../ui/Deck.js';
import Mixer from '../ui/Mixer.js';
import Playlist from '../ui/Playlist.js';
import ProgressRing from '../ui/component/ProgressRing.js';


class UserInterface {


  constructor() {
    // Define custom HTML element for knob radial gauge
    window.customElements.define('progress-ring', ProgressRing);

    this._master = new Master();
    this._leftDeck = new Deck('left');
    this._rightDeck = new Deck('right');
    this._mixer = new Mixer();
    this._playlist = new Playlist();

    this._setEventSubscriptions();
  }


  _setEventSubscriptions() {
    CustomEvents.subscribe(`Player/SetVolume`, this._setVolume.bind(this));
    CustomEvents.subscribe(`Player/SetTempo`, this._setTempo.bind(this));
    CustomEvents.subscribe(`Player/Play`, this._setPlay.bind(this));
    CustomEvents.subscribe(`Player/Pause`, this._setPause.bind(this));
    CustomEvents.subscribe(`Player/Progress`, this._updateProgress.bind(this));
    CustomEvents.subscribe(`Player/EQ`, this._updateKnobs.bind(this));
    CustomEvents.subscribe(`Player/CuePhones`, this._cuePhones.bind(this));
    CustomEvents.subscribe(`Player/Crossfade`, this._crossfade.bind(this));

    CustomEvents.subscribe(`Master/Volume`, this._setMasterVolume.bind(this));

    CustomEvents.subscribe(`Pad/Set`, this._setPad.bind(this));
    CustomEvents.subscribe(`Pad/ShiftSet`, this._setPad.bind(this));
    CustomEvents.subscribe(`Pad/Fire`, this._firePad.bind(this));
    CustomEvents.subscribe(`Pad/SaveHotCue`, this._saveHotCue.bind(this));
    CustomEvents.subscribe(`Pad/RemoveHotCue`, this._removeHotCue.bind(this));
    CustomEvents.subscribe(`Pad/Type`, this._setPadType.bind(this));
  }


  addTrack(deckSide, track) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Deck`].loadTrack(track);
    }
  }


  setFilter(deckSide, options) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${deckSide}Deck`].setFilter(options);
    }
  }


  _setPlay(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].setPlay();
    }
  }


  _setPause(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].setPause();
    }
  }


  /* Player */


  _setVolume(options) {
    if (options.name === 'left' || options.name === 'right') {
      // Update left or right deck with loaded track info (stored in options.value)
      this[`_${options.name}Deck`].setVolume(options.value); // TODO Put in Mixer.js ui component ?
    }
  }


  _setTempo(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].setTempo(options.value);
    }
  }


  _updateProgress(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].updateProgress(options.value);
    } else {

    }
  }


  _updateKnobs(options) {
    if (options.name === 'left' || options.name === 'right') {
      this._mixer.updateKnob(options);
    }
  }


  _cuePhones(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].updateCuePhone(options);
    }
  }


  _crossfade(options) {
    this._mixer.updateCrossfader(options);
  }


  /* Master */


  toggleMasterPhoneCue() {
    this._master.toggleMasterPhoneCue();
  }


  _setMasterVolume(options) {
    this._master.setMasterVolume(options);
  }


  setHeadphoneMix(options) {
    this._master.setMix(options);
  }


  setHeadphoneVolume(options) {
    this._master.setHeadphoneVolume(options);
  }


  /* Pad */


  _setPad(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].setPad(options);
    }
  }


  _firePad(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].setPad(options);
    }
  }


  _saveHotCue(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].saveHotCue(options);
    }
  }


  _removeHotCue(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].removeHotCue(options);
    }
  }


  updateHotCue(deckSide, options) {
    if (deckSide === 'left' || deckSide === 'right') {
      this[`_${options.name}Deck`].updateHotCue(options);
    }
  }


  _setPadType(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].setPadType(options);
    }
  }


  navigateInPlaylist(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this._playlist.navigateInPlaylist(value);
    }
  }


  timelineColorUpdate(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].timelineColorUpdate(options);
    }
  }


  waveformOptionUpdate(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].waveformOptionUpdate(options);
    }
  }


  getSelectedTrack() {
    return this._playlist.selectedTrack;
  }


  getClosestBeatTime(name) {
    if (name === 'left' || name === 'right') {
      return this[`_${name}Deck`].getClosestBeatTime();
    }
  }


  getBeatJumpOffsetFactor(deckSide) {
    if (deckSide === 'left' || deckSide === 'right') {
      return this[`_${deckSide}Deck`].getBeatJumpOffsetFactor();
    }
  }


}


export default UserInterface;
