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


  togglePad(index, fire) {
    if (fire === true) {
      if (this._hotCues[index] === -1) {
        this._hotCues[index] = this._player.currentTime;
      } else {
        this._player.currentTime = this._hotCues[index];
      }
    } else if (this._hotCues[index] !== -1) {
      this._hotCues[index] === -1;
    }
  }


}


export default HotCuePad;
