class Knob {


  constructor(options) {
    this._container = options.target;
    this._type = options.type;
    this._side = options.side;
    this._fromZero = options.fromZero || false; // Do the knob needs to start from 50% or 0

    this._meterContainer = document.createElement('DIV');
    this._dial = document.createElement('DIV');
    this._pin = document.createElement('DIV');
    this._label = document.createElement('P');

    this._meterContainer.classList.add('meter-container');
    this._dial.classList.add('dial');
    this._pin.classList.add('pin');
    this._dial.style.transform = 'rotate(0)';
    this._pin.style.transform = 'rotate(-45deg)';
    this._label.innerHTML = this._type.toUpperCase();

    this._meterContainer.appendChild(this._dial);
    this._meterContainer.appendChild(this._pin);
    this._container.appendChild(this._meterContainer);
    this._container.appendChild(this._label);
    /* Gauge */
    this._gauge = document.querySelector(`progress-ring.${this._type}-${this._side}`);
    this._gauge.setAttribute('progress', 0);
    // if (this._fromZero) {
    //   this._gauge.style.transform = `rotate(-135deg)`;
    // }
  }


  setValue(value, fromZero = false) {
    if (this._fromZero || fromZero) {
      const dialAngle = 135 * ((value - 0.5) * 2); // 135 bc knob track total radius is 3Pi/4
      const gaugeAngle = ((value) * 100) * (3 / 4);
      this._dial.style.transform = `rotate(${dialAngle}deg)`;
      this._pin.style.transform = `rotate(${dialAngle - 45}deg)`;
      this._gauge.setAttribute('progress', `${gaugeAngle}`);
    } else {
      if (value > 0.5) {
        const dialAngle = 135 * ((value - 0.5) * 2); // 135 bc knob track total radius is 3Pi/4
        const gaugeAngle = ((value - 0.5) * 100) * (3 / 4);
        this._dial.style.transform = `rotate(${dialAngle}deg)`;
        this._pin.style.transform = `rotate(${dialAngle - 45}deg)`;
        this._gauge.setAttribute('progress', `${gaugeAngle}`);
      } else if (value < 0.5) {
        const dialAngle = 135 * (1 - (value * 2)); // 135 bc knob track total radius is 3Pi/4
        const gaugeAngle = ((0.5 - value) * 100) * (3 / 4);
        this._dial.style.transform = `rotate(${-dialAngle}deg)`;
        this._pin.style.transform = `rotate(${-dialAngle - 45}deg)`;
        this._gauge.setAttribute('progress', `${-gaugeAngle}`);
      } else if (value === 0.5) {
        this._dial.style.transform = 'rotate(0)';
        this._pin.style.transform = 'rotate(-45deg)';
      }
    }
  }


}


export default Knob;
