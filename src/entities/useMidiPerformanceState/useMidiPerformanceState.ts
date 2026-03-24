import {useCallback, useMemo, useReducer} from 'react'
import {
    getVisibleActiveNotes,
    INITIAL_MIDI_PERFORMANCE_STATE,
    reduceMidiPerformanceState,
} from './lib'
import type {ParsedMidiMessage} from '@shared/lib'

export function useMidiPerformanceState() {

    const [state, dispatch] = useReducer(
        reduceMidiPerformanceState,
        INITIAL_MIDI_PERFORMANCE_STATE,
    )

    const handleMidiMessage = useCallback((message: ParsedMidiMessage) => {
        dispatch(message)
    }, [])

    const activeNotes = useMemo(() => getVisibleActiveNotes(state), [state])

    return {
        activeNotes,
        sustainPressed: state.sustainPressed,
        handleMidiMessage,
    }
}
