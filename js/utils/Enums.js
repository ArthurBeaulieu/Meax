

const ElementType = Object.freeze({
    BUTTON: 'BUTTON', // BUTTONs can have 2 states ; OFF (0x00, 0), ON (0x7F, 127)
    KNOB_HIGH: 'KNOB_HIGH',
    KNOB_LOW: 'KNOB_LOW',
    JOGWHEEL: 'JOGWHEEL', // JOGWHEEL can have 2 states ; DECREASE (0x3F, 63), INCREASE (0x41, 65)
    ROTARY: 'ROTARY', // ROTARY can have 2 states ; DECREASE (0x7F, 127), INCREASE (0x01, 1)
    SELECT: 'SELECT' // BUTTONs can have 2 states ; OFF (0x00, 0), ON (0x7F, 127)
});


const Components = Object.freeze({
  DECK_LEFT: '0',
  DECK_RIGHT: '1',
  MIXER: '2',
  EFFECTS: '3',
  PAD_LEFT: '4',
  PAD_LEFT_SHIFT: '5',
  PAD_RIGHT: '6',
  PAD_RIGHT_SHIFT: '7',
});


const Commands = Object.freeze({
  LEFT_PLAY: '001',
  LEFT_TEMPO: '031',
  LEFT_VOLUME: '033',
  LEFT_LOAD_TRACK: '045'
});


export default {
  ElementType: ElementType,
  Components: Components,
  Commands: Commands
};



/*
BUTTON: {
  OFF: 0x00,
  ON: 0x7F
}
KNOB: { // High/low range are both scaled with this
  MIN: 0x00,
  MAX: 0x7F
},
JOGWHEEL: {
  INCREASE: 0x41,
  DECREASE: 0x3F
},
ROTARY: {
  INCREASE: 0x01,
  DECREASE: 0x1E
},
SELECT: {
  OFF: 0x00,
  ON: 0x7F
}*/
