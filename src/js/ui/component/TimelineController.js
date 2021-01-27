import TimelineColorsModal from '../modal/TimelineColorsModal.js';


class TimelineController {


  constructor(name) {
    this._name = name;
    this._timeline = null;
    this._align = {
      top: null,
      center: null,
      bottom: null
    };

    this._controls = {
      speedPlus: null,
      speedLess: null,
      scaleMore: null,
      scaleLess: null,
      colors: null
    };

    this._colors = {
      background: window.Meax.sm.get(`${this._name}-timeline-color-background`) || '#1D1E25', // Mzk background
      track: window.Meax.sm.get(`${this._name}-timeline-color-track`) || '#12B31D', // Dark green
      mainBeat: window.Meax.sm.get(`${this._name}-timeline-color-main-beat`) || '#FF6B67', // Mzk red
      subBeat: window.Meax.sm.get(`${this._name}-timeline-color-sub-beat`) || '#56D45B' // Light grey
    };

    this._alignValue = window.Meax.sm.get(`${this._name}-timeline-alignment`) || 'center';
    this._speed = window.Meax.sm.get(`${this._name}-timeline-speed`) || 8;
    this._scale = window.Meax.sm.get(`${this._name}-timeline-scale`) || 90;

    this._buildTimeline();
    this._setControls();
  }


  _buildTimeline() {
    if (this._timeline) {
      document.querySelector(`#timeline-container-${this._name}`).innerHTML = '';
      this._timeline.destroy();
      this._timeline = null;
    }

    this._timeline = new window.AudioVisualizer({
      type: 'timeline',
      player: window.Meax.pc.getPlayer(this._name),
      audioContext: window.Meax.pc.audioContext,
      inputNode: window.Meax.pc.getPlayerOutputNode(this._name),
      renderTo: document.querySelector(`#timeline-container-${this._name}`),
      fftSize: 1024,
      speed: this._speed,
      beat: {
        offset: 0.15053,
        bpm: 85,
        timeSignature: 4
      },
      wave: {
        align: this._alignValue,
        scale: this._scale / 100
      },
      colors: {
        background: this._colors.background,
        track: this._colors.track,
        mainBeat: this._colors.mainBeat,
        subBeat: this._colors.subBeat
      },
      hotCues: []
    });
  }


  _setControls() {
    this._align.top = document.getElementById(`timeline-${this._name}-align-top`);
    this._align.center = document.getElementById(`timeline-${this._name}-align-center`);
    this._align.bottom = document.getElementById(`timeline-${this._name}-align-bottom`);

    window.CustomEvents.addEvent('click', this._align.top, this.alignUpdate, this);
    window.CustomEvents.addEvent('click', this._align.center, this.alignUpdate, this);
    window.CustomEvents.addEvent('click', this._align.bottom, this.alignUpdate, this);

    this._controls.speedPlus = document.getElementById(`timeline-${this._name}-speed-plus`);
    this._controls.speedLess = document.getElementById(`timeline-${this._name}-speed-less`);
    this._controls.scaleMore = document.getElementById(`timeline-${this._name}-scale-more`);
    this._controls.scaleLess = document.getElementById(`timeline-${this._name}-scale-less`);
    this._controls.colors = document.getElementById(`timeline-${this._name}-colors`);

    this._align[this._alignValue].classList.add('selected');

    if (this._speed === 1) {
      this._controls.speedPlus.classList.add('disabled');
    } else if (this._speed === 17) {
      this._controls.speedLess.classList.add('disabled');
    }

    if (this._scale === 100) {
      this._controls.scaleMore.classList.add('disabled');
    } else if (this._scale === 10) {
      this._controls.scaleLess.classList.add('disabled');
    }

    window.CustomEvents.addEvent('click', this._controls.speedPlus, this.speedUpdate, this);
    window.CustomEvents.addEvent('click', this._controls.speedLess, this.speedUpdate, this);
    window.CustomEvents.addEvent('click', this._controls.scaleMore, this.scaleUpdate, this);
    window.CustomEvents.addEvent('click', this._controls.scaleLess, this.scaleUpdate, this);
    window.CustomEvents.addEvent('click', this._controls.colors, this.colorUpdateModal, this);
  }


  updateTrack(track) {
    this._timeline.updateBeatInfo({
      offset: track.beatOffset,
      bpm: track.bpm,
      timeSignature: 4
    });
  }


  alignUpdate(event) {
    this._align[this._alignValue].classList.remove('selected');
    this._alignValue = event.target.id.split('-')[3];
    this._align[this._alignValue].classList.add('selected');
    window.Meax.sm.save(`${this._name}-timeline-alignment`, this._alignValue);
    this._buildTimeline();
  }


  speedUpdate(event) {
    const updateTimeline = () => {
      window.Meax.sm.save(`${this._name}-timeline-speed`, this._speed);
      this._buildTimeline();
    };

    if (event.target.id.indexOf('plus') !== -1) {
      this._controls.speedPlus.classList.add('disabled');

      if (this._speed === 1) {
        return;
      }

      this._speed -= 2;

      if (this._speed <= 0) {
        this._speed = 1;
        updateTimeline();
        return;
      }

      updateTimeline();
    } else {
      this._controls.speedLess.classList.add('disabled');

      if (this._speed === 17) {
        return;
      }

      this._speed += 2;
      if (this._speed >= 17) {
        this._speed = 17;
        updateTimeline();
        return;
      }

      updateTimeline();
    }
    this._controls.speedLess.classList.remove('disabled');
    this._controls.speedPlus.classList.remove('disabled');
  }


  scaleUpdate() {
    const updateTimeline = () => {
      window.Meax.sm.save(`${this._name}-timeline-scale`, this._scale);
      this._buildTimeline();
    };

    if (event.target.id.indexOf('more') !== -1) {
      this._controls.scaleMore.classList.add('disabled');

      if (this._scale === 100) {
        return;
      }

      this._scale += 10;

      if (this._scale >= 100) {
        this._scale = 100;
        updateTimeline();
        return;
      }

      updateTimeline();
    } else {
      this._controls.scaleLess.classList.add('disabled');

      if (this._scale === 10) {
        return;
      }

      this._scale -= 10;

      if (this._scale <= 10) {
        this._scale = 10;
        updateTimeline();
        return;
      }

      updateTimeline();
    }

    this._controls.scaleMore.classList.remove('disabled');
    this._controls.scaleLess.classList.remove('disabled');
  }


  colorUpdateModal() {
    new TimelineColorsModal({
      name: this._name,
      colors: this._colors,
      url: 'assets/html/TimelineColorsModal.html'
    });
  }


  setTimelineColors(options) {
    this._colors.background = options.background;
    this._colors.track = options.track;
    this._colors.mainBeat = options.mainBeat;
    this._colors.subBeat = options.subBeat;
    this._buildTimeline();
  }


  getClosestBeatTime() {
    return this._timeline.getClosestBeat(true);
  }


  setHotCue(options) {
    return this._timeline.setHotCuePoint({
      color: window.Enums.DefaultColors.hotCue,
      label: options.pad
    });
  }


  removeHotCue(hotCue) {
    if (hotCue) {
      this._timeline.removeHotCuePoint(hotCue);
    }
  }


  updateHotCue(hotCue, options) {
    if (hotCue) {
      this._timeline.updateHotCuePoint(hotCue, options);
    }
  }


}


export default TimelineController;
