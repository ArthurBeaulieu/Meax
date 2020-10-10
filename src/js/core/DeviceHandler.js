import Enums from '../utils/Enums.js';


class DeviceHandler {


  constructor(options) {
    this._onEvent = options.onEvent;
    this._channels = [];

    this._input = null;
    this._output = null;
    this._knobLow = null;

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(this.requestMIDIAccess.bind(this), this.requestMIDIAccessFailure);
    } else {
      console.log('navigator.requestMIDIAccess undefined on this browser. Try on Chromium/Chrome.');
    }

    this._setEventSubscriptions();
  }


  _setEventSubscriptions() {
    CustomEvents.subscribe(`Player/CuePhones`, this._sendMIDIRaw.bind(this));
  }


  requestMIDIAccess(midi) {
    var inputs = midi.inputs.values();
    var outputs = midi.outputs.values();

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      if (input.value.name === 'DDJ-400') {
        this._input = input;
        this._readJSONFile(`./assets/json/${input.value.name}.json`).then(response => {
          this._channels = response.channels;
          input.value.onmidimessage = this.midiOnMIDImessage.bind(this);
          input.value.onstatechange = this.midiOnStateChange;
        });
        break;
      } else {
        console.log(`Unsupported device ${input.value.name}, contact support@manazeak.org to support this device.`);
      }
    }

    for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
      if (output.value.name === 'DDJ-400') {
        this._output = output;
      } else {
        console.log(`Unsupported device ${output.value.name}, contact support@manazeak.org to support this device.`);
      }
    }
  }


  sendMIDIMessage(options) {
    console.trace();
    this._output.value.send(options);
  }


  midiOnMIDImessage(event) {
    const args = this._parseMIDIArguments(event.data);
    // Send MIDI input arguments to retrieve the mapped element
    const element = this._retrieveElementFromDeviceMapping(args);
    // Only send calback if element exists in device mapping
    if (element) {
      element.args = args; // If element exists, we add its arguments
      element.raw = event.data; // Use on MIDI out to notify controller of state change
      const evt = this._buildMIDIEvent(element);
      if (evt) {
        this._onEvent(evt);
      }
    }
  }


  _parseMIDIArguments(data) {
    return {
      type: event.data[0] & 0xf0,
      cmd: event.data[0] >> 4,
      channel: event.data[0] & 0xf,
      note: event.data[1],
      velocity: event.data[2], //  / 127 to get percenatge
    }
  }


  _retrieveElementFromDeviceMapping(args) {
    // Output object, default to null (not found)
    let output = null;
    // Parse devices channels defined in JSON file associated with controller
    for (let i = 0; i < this._channels.length; ++i) {
      // Parse current channel subchannels (several channel can map a same set of keys)
      for (let j = 0; j < this._channels[i].channel.length; ++j) {
        // In case we match the channel value in sub channels, proceed to retrieve element from channel definition
        if (args.channel === this._channels[i].channel[j].value) {
          const element = this._findMatchingElementInChannel(args, this._channels[i]);
          if (element) {
            output = Object.assign({}, element); // Create element copy to not alter element structure
            output.name =  `${this._channels[i].name}/${element.name}`; // Assign full event name
            output.id =  `${Enums.Components[this._channels[i].channel[j].name]}${element.id}`; // Prefix  element ID with channel number
          } else {
            console.log('Unmapped key', args);
          }
          // Break whatever the result as matching channel is either found or not.
          break;
        }
      }
    }
    // Send output (either null or matching element)
    return output;
  }


  _findMatchingElementInChannel(args, channel) {
    let output = null;
    // Parse channel elements to match pitch and type
    for (let i = 0; i < channel.elements.length; ++i) {
      // Several pitch value can map a same element, we iterate through them
      for (let j = 0; j < channel.elements[i].note.length; ++j) {
        // In case we matched both pitch and type, we got the element
        if (args.note === channel.elements[i].note[j] && args.type === channel.elements[i].type) {
          output = channel.elements[i];
          // Break since mapping are unique
          break;
        }
      }
    }

    return output;
  }


  _buildMIDIEvent(element) {
    // Handle MIDI buttons (pushed or released)
    element.value = '';
    const type = element.elementType;
    const args = element.args;
    if (type === Enums.ElementType.BUTTON) {
      if (args.velocity === 0x7F) {
        element.value = 'push';
      } else if (args.velocity === 0x00) {
        element.value = 'release';
      }
    } else if (type === Enums.ElementType.JOGWHEEL) {
      if (args.velocity === 0x41) {
        element.value = 'increase';
      } else if (args.velocity === 0x3F) {
        element.value = 'decrease';
      }
    } else if (type === Enums.ElementType.ROTARY) {
      if (args.velocity === 0x01) {
        element.value = 'increase';
      } else if (args.velocity === 0x7F) {
        element.value = 'decrease';
      }
    } else if (type === Enums.ElementType.SELECT) {
      if (args.velocity === 0x7F) {
        element.value = 'select';
      } else if (args.velocity === 0x00) {
        element = null; // We return null to notify that no event is to fire
      }
    } else if (type === Enums.ElementType.KNOB_LOW) {
      this._knobLow = element; // Store low value then return null
      this._knobLow.args = args; // Saved args straight into knob low element
      element = null; // We return null to notify that no event is to fire
    } else if (type === Enums.ElementType.KNOB_HIGH) {
      const totalValue = (this._knobLow.args.velocity * 0x7F) + args.velocity;
      const percentage = totalValue / ((0x7F * 0x7F) + 0x7F);
      element.value = percentage; // Update value in percentage for element
      this._knobLow = null; // Reset know low for next knob event
    }
    // Return element with value
    return element;
  }


  _readJSONFile(path) {
    return new Promise((resolve, reject) => {
      try {
        const request = new XMLHttpRequest();
        request.overrideMimeType('application/json');
        request.open('GET', path, true);
        request.onreadystatechange = () => {
          if (request.readyState === 4) {
            if (request.status === 200) {
              resolve(JSON.parse(request.responseText));
            } else {
              reject(`Error when loading ${path}`);
            }
          }
        };
        request.send();
      } catch(err) {
        reject(`Error when loading ${path}`);
      }
    });
  }


  _sendMIDIRaw(options) {
    this.sendMIDIMessage(options.raw);
  }


  requestMIDIAccessFailure(e) {
    console.log('requestMIDIAccessFailure', e);
  }


  midiOnStateChange(event) {
    console.log('midiOnStateChange', event, event.port.name + ' ' + event.port.state);
  }


}


export default DeviceHandler;
