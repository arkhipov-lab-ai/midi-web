import {ActiveNotesMap, MidiPerformanceState} from '../../api'

export function getVisibleActiveNotes(state: MidiPerformanceState): ActiveNotesMap {
    return {
        ...state.sustainedNotes,
        ...state.pressedNotes,
    }
}
