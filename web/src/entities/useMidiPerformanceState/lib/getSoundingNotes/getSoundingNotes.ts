import {ActiveNotesMap, MidiPerformanceState} from '../../api'

/** Keys currently sounding: sustain-held plus physically pressed (pressed wins on velocity overlap). */
export function getSoundingNotes(state: MidiPerformanceState): ActiveNotesMap {
    return {
        ...state.sustainedNotes,
        ...state.pressedNotes,
    }
}
