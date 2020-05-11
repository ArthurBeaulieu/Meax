class DeviceHandler {


  constructor() {
    this._channels = [];

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(this.requestMIDIAccessSuccess.bind(this), this.requestMIDIAccessFailure);
    } else {
      console.log('navigator.requestMIDIAccess undefined on this browser. Try on Chromium/Chrome.');
    }

  }


  requestMIDIAccessSuccess(midi) {
    var inputs = midi.inputs.values();
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      console.log('midi input', input.value.name);
      if (input.value.name === 'DDJ-400') {
        this._readJSONFile('./assets/json/DDJ-400.json').then(response => {
          this._channels = response.channels;
        });
        input.value.onmidimessage = this.midiOnMIDImessage.bind(this);
      }
    }
    midi.onstatechange = this.midiOnStateChange;
  }


  midiOnMIDImessage(event) {
    var cmd = event.data[0] >> 4;
    var channel = event.data[0] & 0xf;
    var type = event.data[0] & 0xf0;
    var pitch = event.data[1];
    var velocity = event.data[2];
    // Parse devices channels defined in JSON file associated with controller
    for (let i = 0; i < this._channels.length; ++i) {
      // Parse current channel subchannels (several channel can map a same set of keys)
      for (let j = 0; j < this._channels[i].channel.length; ++j) {
        // In case we match the channel value in sub channels, proceed to retrieve element
        if (channel === this._channels[i].channel[j].value) {
          // Parse channel elements to match pitch and type
          for (let k = 0; k < this._channels[i].elements.length; ++k) {
            // Several pitch value can map a same element, we iterate through them
            for (let l = 0; l < this._channels[i].elements[k].pitch.length; ++l) {
              // In case we matched both pitch and type, we got the element
              if (pitch === this._channels[i].elements[k].pitch[l] && type === this._channels[i].elements[k].type) {
                console.log(this._channels[i].elements[k]);
                // Break since mapping are unique
                break;
              }
            }
          }
        }
      }
    }
    //console.error(cmd, channel, type, pitch, velocity)
  }


  midiOnStateChange(event) {
    console.log('midiOnStateChange', event, event.port.manufacturer + ' ' + event.port.name + ' ' + event.port.state);
  }


  requestMIDIAccessFailure(e) {
    console.log('requestMIDIAccessFailure', e);
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
}


export default DeviceHandler;
