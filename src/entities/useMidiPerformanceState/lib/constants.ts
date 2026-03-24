import {MidiPerformanceState} from '../api'

export const SUSTAIN_CONTROLLER = 64
export const SUSTAIN_ON_THRESHOLD = 64

export const INITIAL_MIDI_PERFORMANCE_STATE: MidiPerformanceState = {
    pressedNotes: {},
    sustainedNotes: {},
    sustainPressed: false,
}
