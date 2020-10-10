class Utils {


  constructor() {

  }


  /** @method
   * @name precisionRound
   * @public
   * @memberof Utils
   * @author Arthur Beaulieu
   * @since September 2018
   * @description Do a Math.round with a given precision (ie amount of integers after the coma)
   * @param {nunmber} value - The value to precisely round
   * @param {number} precision - The number of integers after the coma
   * @return {number} - The rounded value */
  precisionRound(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }


  /** @method
   * @name secondsToTimecode
   * @public
   * @memberof Utils
   * @author Arthur Beaulieu
   * @since September 2018
   * @description Convert a time in seconds into a time DD HH MM SS MS
   * @param {number} time - The time in seconds to convert
   * @return {string} - The output string according to time duration */
  secondsToTimecode(time, float) {
    const output = { h: 0, m: 0, s: 0, ms: 0 };
    // Cutting total seconds
    output.h = Math.floor(time / 3600);
    output.m = Math.floor((time - (output.h * 3600)) / 60);
    output.s = Math.floor(time - (output.h * 3600) - (output.m * 60));
    output.ms = Math.floor((time - (output.m * 60) - output.s) * 100); // If  hour value exists, we will not display ms
    // Adding an extra 0 for values inferior to 10
    if (output.h < 10) { output.h = `0${output.h}`; }
    if (output.m < 10) { output.m = `0${output.m}`; }
    if (output.s < 10) { output.s = `0${output.s}`; }
    if (output.ms < 10) { output.ms = `0${output.ms}`; }
    // Formatting output
    if (output.h > 0) {
      return `${output.h}:${output.m}:${output.s}`;
    } else {
      if (float === true) {
        return `${output.m}:${output.s}:${output.ms}`;
      } else {
        return `${output.m}:${output.s}`;
      }
    }
  }


  convertKnobValue(value, maxRange) {
    const scaledPercentage = (value * maxRange) / 100;
    const breakpoint = (maxRange / 200);
    let amount = 0;

    if (scaledPercentage < breakpoint) {
      amount = this.precisionRound(-(breakpoint - scaledPercentage) * 2, 2);
    } else if (scaledPercentage > breakpoint) {
      amount = this.precisionRound((scaledPercentage - breakpoint) * 2, 2);
    }

    return amount;
  }


  parseHTMLFragment(htmlString) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(htmlString, 'text/html');
    return dom.body.firstChild;
  }


}


export default Utils;
