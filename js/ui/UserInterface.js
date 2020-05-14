import Timeline from './component/Timeline.js';
import Deck from './component/Deck.js';
import Mixer from './component/Mixer.js';
import Playlist from './component/Playlist.js';
import ProgressRing from './component/ProgressRing.js';


class UserInterface {


  constructor() {
    // Define custom element for knob radial gauge
    window.customElements.define('progress-ring', ProgressRing);

    this._leftTimeline = new Timeline('left');
    this._rightTimeline = new Timeline('right');

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
    CustomEvents.subscribe(`Player/LoadTrack`, this._loadTrack.bind(this));
    CustomEvents.subscribe(`Player/Progress`, this._updateProgress.bind(this));
    CustomEvents.subscribe(`Player/EQ`, this._updateKnobs.bind(this));
  }


  _loadTrack(options) {
    if (options.name === 'left' || options.name === 'right') {
      // Update left or right deck with loaded track info (stored in options.value)
      this[`_${options.name}Deck`].loadTrack(options.value);
    } else {

    }
  }


  _setPlay(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].setPlay();
    } else {

    }
  }


  _setPause(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].setPause();
    } else {

    }
  }


  _setVolume(options) {
    if (options.name === 'left' || options.name === 'right') {
      // Update left or right deck with loaded track info (stored in options.value)
      this[`_${options.name}Deck`].setVolume(options.value); // TODO Put in Mixer.js ui component ?
    } else {

    }
  }


  _setTempo(options) {
    if (options.name === 'left' || options.name === 'right') {
      this[`_${options.name}Deck`].setTempo(options.value);
    } else {

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



  navigateInPlaylist(deckSide, value) {
    if (deckSide === 'left' || deckSide === 'right') {
      this._playlist.navigateInPlaylist(value);
    } else {

    }
  }


  getSelectedTrack() {
    return this._playlist.selectedTrack;
  }


}


export default UserInterface;
