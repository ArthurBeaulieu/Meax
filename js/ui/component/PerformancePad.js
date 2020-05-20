class PerformancePad {


  constructor(name) {
    this._name = name;
    this._dom = {
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
    for (let i = 0; i < 8; ++i) { // Eight perfo pad slots
      this._dom[`pad${i + 1}`] = document.getElementById(`pad${i + 1}-${this._name}`);
    }
  }


  setPad(options) {
    console.log(options)
    if (options.active === true) {
      this._dom[`pad${options.pad}`].classList.add('enabled');
    } else {
      this._dom[`pad${options.pad}`].classList.remove('enabled');
    }
  }


}


export default PerformancePad;
