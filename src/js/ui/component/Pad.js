class Pad {


  constructor(options) {
    this._name = options.name;

    this._activeType = options.type;
    this._activeTypeIndex = 0; // Default to hotcue

    this._dom = {
      ctrl1: null,
      ctrl2: null,
      ctrl3: null,
      ctrl4: null,
      pad1: null,
      pad2: null,
      pad3: null,
      pad4: null,
      pad5: null,
      pad6: null,
      pad7: null,
      pad8: null
    };

    this._getElements();
  }


  _getElements() {
    for (let i = 0; i < 4; ++i) { // Four control buttons (eight modes)
      this._dom[`ctrl${i + 1}`] = document.getElementById(`ctrl${i + 1}-${this._name}`);
    }

    for (let i = 0; i < 8; ++i) { // Eight perfo pad slots
      this._dom[`pad${i + 1}`] = document.getElementById(`pad${i + 1}-${this._name}`);
    }
  }


  setPadControl(options) {
    for (let i = 0; i < 4; ++i) {
      this._dom[`ctrl${i + 1}`].classList.remove('enabled', 'shift-enabled');
    }
    /* Check if shift is held or not (even = !shift, odd = shift) */
    if (options.pad % 2 === 0) { // Even is standard modes
      this._dom[`ctrl${(options.pad / 2) + 1}`].classList.add('enabled');
    } else { // Odd is shifted modes
      this._dom[`ctrl${((options.pad - 1) / 2) + 1}`].classList.add('shift-enabled');
    }
  }


  setPad(options) {
    if (this._activeTypeIndex === 0) {
      return;
    }

    let className = 'enabled'
    if (options.shift) {
      className = 'shift-enabled';
    }

    if (options.active === true) {
      this._dom[`pad${options.pad}`].classList.add(className);
    } else {
      this._dom[`pad${options.pad}`].classList.remove('enabled', 'shift-enabled');
    }
  }


  clearPadSelection() {
    for (let i = 0; i < 8; ++i) {
      this._dom[`pad${i + 1}`].classList.remove('enabled', 'shift-enabled');
      this._dom[`pad${i + 1}`].innerHTML = '';
    }
  }


  saveHotCue(options) {
    this._dom[`pad${options.pad}`].classList.add('enabled');
    this._dom[`pad${options.pad}`].innerHTML = options.time;
  }


  removeHotCue(options) {
    this._dom[`pad${options.pad}`].classList.remove('enabled');
    this._dom[`pad${options.pad}`].innerHTML = '';
  }


  setPadType(options) {
    this._type = Enums.PerformanceType[options.pad];
    this._activeTypeIndex = options.pad;
    console.log(this._activeTypeIndex)
    this.setPadControl(options);
  }


}


export default Pad;
