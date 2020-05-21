

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
  PLAY: '001',
  CUE_PHONES_LEFT: '018',
  PERFORMANCE_TAB_1: '020',
  PERFORMANCE_TAB_2: '021',
  PERFORMANCE_TAB_3: '022',
  PERFORMANCE_TAB_4: '023',
  PERFORMANCE_TAB_5: '024',
  PERFORMANCE_TAB_6: '025',
  PERFORMANCE_TAB_7: '026',
  PERFORMANCE_TAB_8: '027',
  JOGWHEEL_SLOW: '028',
  JOGWHEEL_FAST: '029',
  TEMPO: '031',
  VOLUME: '033',
  VOLUME_TRIM: '035',
  HIGH_EQ: '037',
  MID_EQ: '039',
  LOW_EQ: '041',
  LEFT_LOAD_TRACK: '045',
  RIGHT_LOAD_TRACK: '047',
  SELECTION_ROTARY: '051',
  LEFT_FILTER: '059',
  RIGHT_FILTER: '061',
  CROSSFADER: '063',
  PAD_1: '078',
  PAD_2: '079',
  PAD_3: '080',
  PAD_4: '081',
  PAD_5: '082',
  PAD_6: '083',
  PAD_7: '084',
  PAD_8: '085'
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
