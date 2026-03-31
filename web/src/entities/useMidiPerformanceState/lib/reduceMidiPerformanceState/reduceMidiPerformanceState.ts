import {MidiPerformanceState} from '../../api'
import {
    ParsedMidiMessage,
    SUSTAIN_CONTROLLER,
    SUSTAIN_ON_THRESHOLD,
} from '@shared/lib'
import {removeNote} from './lib'

export function reduceMidiPerformanceState(state: MidiPerformanceState, message: ParsedMidiMessage): MidiPerformanceState {
    if (message.type === 'noteon' && message.data1 !== null && message.data2 !== null) {
        const midi = message.data1
        const velocity = message.data2

        if (velocity === 0) {
            return reduceMidiPerformanceState(state, {
                ...message,
                type: 'noteoff',
            })
        }

        return {
            ...state,
            pressedNotes: {
                ...state.pressedNotes,
                [midi]: velocity,
            },
            sustainedNotes: removeNote(state.sustainedNotes, midi),
        }
    }

    if (message.type === 'noteoff' && message.data1 !== null) {
        const midi = message.data1
        const currentVelocity = state.pressedNotes[midi] ?? state.sustainedNotes[midi] ?? 0

        if (state.sustainPressed) {
            return {
                ...state,
                pressedNotes: removeNote(state.pressedNotes, midi),
                sustainedNotes: currentVelocity > 0
                    ? {
                        ...state.sustainedNotes,
                        [midi]: currentVelocity,
                    }
                    : state.sustainedNotes,
            }
        }

        return {
            ...state,
            pressedNotes: removeNote(state.pressedNotes, midi),
            sustainedNotes: removeNote(state.sustainedNotes, midi),
        }
    }

    if (
        message.type === 'controlchange'
        && message.data1 === SUSTAIN_CONTROLLER
        && message.data2 !== null
    ) {
        const sustainPressed = message.data2 >= SUSTAIN_ON_THRESHOLD

        if (sustainPressed) {
            return {
                ...state,
                sustainPressed: true,
            }
        }

        return {
            ...state,
            sustainPressed: false,
            sustainedNotes: {},
        }
    }

    return state
}
