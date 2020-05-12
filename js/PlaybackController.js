import Player from './core/Player.js';


class PlaybackController {


  constructor() {
    this._leftPlayer = new Player({ name: 'left' });
    this._rightPlayer = new Player({ name: 'right' });
  }


  addTrack(deckSide, trackPath) {
    if (deckSide === 'left') {
      this._leftPlayer.loadTrack(trackPath);
      console.log(deckSide, trackPath)
    } else if (deckSide === 'rigt') {
      this._rightPlayer.loadTrack(trackPath);
    }
  }


  togglePlayback(deckSide) {
    if (deckSide === 'left') {
      this._leftPlayer.togglePlayback();
    } else if (deckSide === 'rigt') {
      this._rightPlayer.togglePlayback();
    }
  }

  setVolume(deckSide, value) {
    if (deckSide === 'left') {
      this._leftPlayer.setVolume(value);
    } else if (deckSide === 'rigt') {
      this._rightPlayer.setVolume(value);
    }
  }


  setTempo(deckSide, value) {
    if (deckSide === 'left') {
      this._leftPlayer.setTempo(value);
    } else if (deckSide === 'rigt') {
      this._rightPlayer.setTempo(value);
    }
  }


}


export default PlaybackController;
