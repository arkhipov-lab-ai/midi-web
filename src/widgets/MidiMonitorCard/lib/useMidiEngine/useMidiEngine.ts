import {useCallback} from 'react'
import type {
    PerformanceInputEvent,
    ParsedMidiMessage,
} from '@shared/lib'
import {useMidiPerformanceState} from '@entities/useMidiPerformanceState'
import {useMidiSynth} from '@entities/useMidiSynth'
import {useMidiRecorder} from '@entities/useMidiRecorder'
import {useMidiPlayback} from '@entities/useMidiPlayback'

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
        isRecording,
        recordingBuffer,
        recordedEvents,
        hasRecording,
        startRecording,
        stopRecording,
        clearRecording,
        handlePerformanceEvent: handlePerformanceEventForRecorder,
    } = useMidiRecorder()

    const handlePerformanceEvent = useCallback((event: PerformanceInputEvent) => {
        handleMidiMessageForState(event.message)
        handleMidiMessageForAudio(event.message)
        handlePerformanceEventForRecorder(event)
    }, [
        handleMidiMessageForState,
        handleMidiMessageForAudio,
        handlePerformanceEventForRecorder,
    ])

    const handleMidiMessage = useCallback((message: ParsedMidiMessage) => {
        handlePerformanceEvent({
            source: 'midi',
            message,
        })
    }, [handlePerformanceEvent])

    const {
        play,
        stop: stopPlayback,
        isPlaying,
    } = useMidiPlayback({
        onEvent: handlePerformanceEvent,
    })

    const playRecording = useCallback(() => {
        play(recordedEvents)
    }, [
        play,
        recordedEvents,
    ])

    return {
        pressedNotes,
        soundingNotes,
        sustainPressed,
        handlePerformanceEvent,
        handleMidiMessage,
        resumeAudio,
        isRecording,
        isPlaying,
        hasRecording,
        recordingBuffer,
        recordedEvents,
        startRecording,
        stopRecording,
        clearRecording,
        playRecording,
        stopPlayback,
        // Same as soundingNotes
        activeNotes,
    }
}
