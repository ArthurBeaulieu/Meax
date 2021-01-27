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
      pad8: null,
      less: null,
      more: null,
    };

    this._beatJumpBank = 0;

    this._getElements();
  }


  _getElements() {
    for (let i = 0; i < 4; ++i) { // Four control buttons (eight modes)
      this._dom[`ctrl${i + 1}`] = document.getElementById(`ctrl${i + 1}-${this._name}`);
    }

    for (let i = 0; i < 8; ++i) { // Eight performance pad slots
      this._dom[`pad${i + 1}`] = document.getElementById(`pad${i + 1}-${this._name}`);
      window.CustomEvents.addEvent('click', this._dom[`pad${i + 1}`], this._padClicked, this);
    }

    this._dom.less = document.getElementById(`bank-less-${this._name}`);
    this._dom.more = document.getElementById(`bank-more-${this._name}`);
    window.CustomEvents.addEvent('click', this._dom.less, this._lessClicked, this);
    window.CustomEvents.addEvent('click', this._dom.more, this._moreClicked, this);
  }


  _padClicked(event) {
    let id = event.target.id.split('-')[0].charAt(3);
    if (!id) {
      id = event.target.parentNode.id.split('-')[0].charAt(3);
    }
    window.Meax.pc.setPad(this._name, { value: 'push', raw: [0, 0, 127] }, id, event.shiftKey);
  }


  _lessClicked() {
    if (!this._dom.less.classList.contains('disabled') && this._beatJumpBank > 0) {
      this._dom.more.classList.remove('disabled');
      --this._beatJumpBank;
      this.clearPadSelection();
      this._setBeatJump();
      if (this._beatJumpBank === 0) {
        this._dom.less.classList.add('disabled');
      }
    }
  }


  _moreClicked() {
    if (!this._dom.more.classList.contains('disabled') && this._beatJumpBank < 1) {
      this._dom.less.classList.remove('disabled');
      ++this._beatJumpBank;
      this.clearPadSelection();
      this._setBeatJump();
      if (this._beatJumpBank === 1) {
        this._dom.more.classList.add('disabled');
      }
    }
  }


  _setHotCues(pad, hotCues) {
    for (let i = 0; i < hotCues.length; ++i) {
      // Attach pad number to hotCue for proper setting
      hotCues[i].pad = hotCues[i].label;
      this.saveHotCue(hotCues[i]);
    }
  }


  _setBeatJump() {
    if (this._beatJumpBank === 0) {
      this._dom.more.classList.remove('disabled');
    } else if (this._beatJumpBank === 1) {
      this._dom.less.classList.remove('disabled');
    }

    for (let i = 0; i < 8; ++i) {
      const container = document.createElement('DIV');
      const arrow = document.createElement('P');
      const value = document.createElement('P');
      container.classList.add('beatjump');

      const offset = this._beatJumpBank === 0 ? this._beatJumpBank * 4 : (this._beatJumpBank + 1) * 4;
      if (i % 2 === 1) { // Fast forward
        arrow.classList.add('ff');
        value.innerHTML = `${Math.pow(2, (i - 1 + offset) / 2)}`;
        container.appendChild(value);
        container.appendChild(arrow);
      } else { // Rewind
        arrow.classList.add('rw');
        value.innerHTML = `${Math.pow(2, (i + offset) / 2)}`;
        container.appendChild(arrow);
        container.appendChild(value);
      }

      this._dom[`pad${i + 1}`].appendChild(container);
    }
  }


  setPadControl(options) {
    for (let i = 0; i < 4; ++i) {
      this._dom[`ctrl${i + 1}`].classList.remove('enabled', 'shift-enabled');
    }

    /* Check if shift is held or not (even = !shift, odd = shift) */
    if (options.pad % 2 === 0) { // Even is standard modes
      this._dom[`ctrl${(options.pad / 2) + 1}`].classList.add('enabled');
      for (let i = 0; i < 4; ++i) {
        this._dom[`ctrl${i + 1}`].firstChild.innerHTML = window.Enums.PerformanceType[i * 2].toUpperCase();
      }
    } else { // Odd is shifted modes
      this._dom[`ctrl${((options.pad - 1) / 2) + 1}`].classList.add('shift-enabled');
      for (let i = 0; i < 4; ++i) {
        this._dom[`ctrl${i + 1}`].firstChild.innerHTML = window.Enums.PerformanceType[(i * 2) + 1].toUpperCase();
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
    const container = document.createElement('DIV');
    const button = document.createElement('DIV');
    const title = document.createElement('P');
    const value = document.createElement('P');
    container.classList.add('hotcue');
    button.classList.add(`pad${options.pad - 1}-hotcue-icon`);
    title.classList.add(`pad${options.pad - 1}-hotcue-title`);
    value.classList.add(`pad${options.pad - 1}-hotcue-value`);
    button.style.backgroundColor = window.Enums.DefaultColors.hotCue;
    button.innerHTML = options.pad;
    value.innerHTML = window.Utils.secondsToTimecode(window.Utils.precisionRound(options.time, 2));
    window.CustomEvents.addEvent('click', button, event => {
      event.stopPropagation(); // Avoid event on parent to trigger
      new EditCueModal({
        name: this._name,
        title: title.innerHTML,
        url: 'assets/html/EditCueModal.html',
        hotCue: options
      });
    });
    // Update internal pad object
    container.appendChild(button);
    container.appendChild(title);
    container.appendChild(value);
    this._dom[`pad${options.pad}`].appendChild(container);
    this._dom[`pad${options.pad}`].classList.add('enabled');
  }


  removeHotCue(options) {
    this._dom[`pad${options.pad}`].classList.remove('enabled');
    this._dom[`pad${options.pad}`].innerHTML = '';
  }


  updateHotCue(hotCue, options) {
    const button = this._dom[`pad${options.pad}`].children[0].children[0];
    const title = this._dom[`pad${options.pad}`].children[0].children[1];
    button.style.backgroundColor = options.color;
    title.innerHTML = options.title;
  }


  getBeatJumpOffsetFactor() {
    return this._beatJumpBank === 0 ? this._beatJumpBank * 4 : (this._beatJumpBank + 1) * 4;
  }


  setPadType(options, hotCues) {
    if (options.value) { // Only trigger when pushed
      this.clearPadSelection();
      this._dom.less.classList.add('disabled');
      this._dom.more.classList.add('disabled');
      this._type = window.Enums.PerformanceType[options.pad];
      this._activeTypeIndex = options.pad;
      this.setPadControl(options);

      if (this._type === 'hotcue') {
        this._setHotCues(options.pad, hotCues);
      } else if (this._type === 'beatjump') {
        this._setBeatJump();
      }
    }
  }


}


export default Pad;
