import {useCallback} from 'react'
import type {
    PerformanceInputEvent,
    ParsedMidiMessage,
} from '@shared/lib'
import {useMidiPerformanceState} from '@entities/useMidiPerformanceState'
import {useMidiSynth} from '@entities/useMidiSynth'
import {useMidiRecorder} from '@entities/useMidiRecorder'

export function useMidiEngine() {

    const {
        pressedNotes,
        soundingNotes,
        sustainPressed,
        handleMidiMessage: handleMidiMessageForState,
        activeNotes,
    } = useMidiPerformanceState()

    const {
        handleMidiMessageForAudio,
        resumeAudio,
    } = useMidiSynth(true)

    const {
        handleMidiMessage: handleMidiMessageForRecorder,
    } = useMidiRecorder()

    const handlePerformanceEvent = useCallback((event: PerformanceInputEvent) => {
        handleMidiMessageForState(event.message)
        handleMidiMessageForAudio(event.message)
        handleMidiMessageForRecorder(event.message, event.source)
    }, [
        handleMidiMessageForState,
        handleMidiMessageForAudio,
        handleMidiMessageForRecorder,
    ])

    const handleMidiMessage = useCallback((message: ParsedMidiMessage) => {
        handlePerformanceEvent({
            source: 'midi',
            message,
        })
    }, [handlePerformanceEvent])

    return {
        pressedNotes,
        soundingNotes,
        sustainPressed,
        handlePerformanceEvent,
        handleMidiMessage,
        resumeAudio,
        // Same as soundingNotes
        activeNotes,
    }
}
