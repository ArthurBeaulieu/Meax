import EditCueModal from '../modal/EditCueModal.js';


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
      CustomEvents.addEvent('click', this._dom[`pad${i + 1}`], this._padClicked, this);
    }
  }


  _padClicked(event) {
    let id = event.target.id.split('-')[0].charAt(3);
    if (!id) {
      id = event.target.parentNode.id.split('-')[0].charAt(3);
    }
    Meax.pc.setPad(this._name, { value: 'push', raw: [0, 0, 127] }, id, event.shiftKey);
  }



  setPadControl(options) {
    for (let i = 0; i < 4; ++i) {
      this._dom[`ctrl${i + 1}`].classList.remove('enabled', 'shift-enabled');
    }

    /* Check if shift is held or not (even = !shift, odd = shift) */
    if (options.pad % 2 === 0) { // Even is standard modes
      this._dom[`ctrl${(options.pad / 2) + 1}`].classList.add('enabled');
      for (let i = 0; i < 4; ++i) {
        this._dom[`ctrl${i + 1}`].firstChild.innerHTML = Enums.PerformanceType[i * 2].toUpperCase();
      }
    } else { // Odd is shifted modes
      this._dom[`ctrl${((options.pad - 1) / 2) + 1}`].classList.add('shift-enabled');
      for (let i = 0; i < 4; ++i) {
        this._dom[`ctrl${i + 1}`].firstChild.innerHTML = Enums.PerformanceType[(i * 2) + 1].toUpperCase();
      }
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
    const button = document.createElement('DIV');
    const value = document.createElement('P');
    button.classList.add(`pad${options.pad - 1}-hotcue-icon`);
    value.classList.add(`pad${options.pad - 1}-hotcue-value`);
    button.innerHTML = options.pad;
    value.innerHTML = Utils.secondsToTimecode(Utils.precisionRound(options.time, 2));
    CustomEvents.addEvent('click', button, event => {
      event.stopPropagation(); // Avoid event on parent to trigger
      const modal = new EditCueModal({
        name: this._name,
        number: options.pad - 1,
        url: 'assets/html/EditCueModal.html'
      });
    });
    // Update internal pad object
    this._dom[`pad${options.pad}`].appendChild(button);
    this._dom[`pad${options.pad}`].appendChild(value);
    this._dom[`pad${options.pad}`].classList.add('enabled');
  }


  removeHotCue(options) {
    this._dom[`pad${options.pad}`].classList.remove('enabled');
    this._dom[`pad${options.pad}`].innerHTML = '';
  }


  setPadType(options) {
    this._type = Enums.PerformanceType[options.pad];
    this._activeTypeIndex = options.pad;
    this.setPadControl(options);
  }


}


export default Pad;
