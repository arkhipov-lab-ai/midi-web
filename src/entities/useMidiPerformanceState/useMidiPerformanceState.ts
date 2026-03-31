import {useCallback, useMemo, useReducer} from 'react'
import {
    getSoundingNotes,
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

    const pressedNotes = state.pressedNotes
    const soundingNotes = useMemo(() => getSoundingNotes(state), [state])

    return {
        pressedNotes,
        soundingNotes,
        sustainPressed: state.sustainPressed,
        handleMidiMessage,
        // Same as soundingNotes (legacy name from when “active” mixed concerns).
        activeNotes: soundingNotes,
    }
}
