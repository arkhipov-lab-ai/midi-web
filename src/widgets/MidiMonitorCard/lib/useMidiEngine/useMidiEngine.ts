import {useCallback} from 'react'
import type {ParsedMidiMessage} from '@shared/lib'
import {useMidiPerformanceState} from '@entities/useMidiPerformanceState'
import {useMidiSynth} from '@entities/useMidiSynth'

export function useMidiEngine() {

    const {
        activeNotes,
        sustainPressed,
        handleMidiMessage: handleMidiMessageForState,
    } = useMidiPerformanceState()

    const {
        handleMidiMessageForAudio,
        resumeAudio,
    } = useMidiSynth(true)

    const handleMidiMessage = useCallback((message: ParsedMidiMessage) => {
        handleMidiMessageForState(message)
        handleMidiMessageForAudio(message)
    }, [handleMidiMessageForState, handleMidiMessageForAudio])

    return {
        activeNotes,
        sustainPressed,
        handleMidiMessage,
        resumeAudio,
    }
}
