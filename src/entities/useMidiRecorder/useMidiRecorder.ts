import {useCallback, useMemo, useRef, useState} from 'react'
import type {
    PerformanceInputEvent,
    PerformanceInputSource,
    RecordedMidiEvent,
    ParsedMidiMessage,
} from '@shared/lib'
import {mapParsedMidiMessageToRecordedEvent} from './lib'

export function useMidiRecorder() {
    const startedAtMsRef = useRef<number | null>(null)
    const stoppedAtMsRef = useRef<number | null>(null)

    const [isRecording, setIsRecording] = useState(false)
    const isRecordingRef = useRef(false)

    const [recordingBuffer, setRecordingBuffer] = useState<RecordedMidiEvent[]>([])
    const recordingBufferRef = useRef<RecordedMidiEvent[]>([])
    const [recordedEvents, setRecordedEvents] = useState<RecordedMidiEvent[]>([])

    const hasRecording = recordedEvents.length > 0

    const clearInternalTimings = useCallback(() => {
        startedAtMsRef.current = null
        stoppedAtMsRef.current = null
    }, [])

    const clearRecording = useCallback(() => {
        isRecordingRef.current = false
        setIsRecording(false)
        recordingBufferRef.current = []
        setRecordingBuffer([])
        setRecordedEvents([])
        clearInternalTimings()
    }, [
        clearInternalTimings,
    ])

    const startRecording = useCallback(() => {
        // Start a fresh session: clear both buffer + finished history.
        isRecordingRef.current = true
        setIsRecording(true)
        recordingBufferRef.current = []
        setRecordingBuffer([])
        setRecordedEvents([])
        clearInternalTimings()

        startedAtMsRef.current = Date.now()
    }, [
        clearInternalTimings,
    ])

    const stopRecording = useCallback(() => {
        if (!isRecordingRef.current) return

        isRecordingRef.current = false
        setIsRecording(false)

        stoppedAtMsRef.current = Date.now()

        // Promote current buffer as the finished recording snapshot.
        setRecordedEvents(recordingBufferRef.current)
    }, [])

    const appendToBuffer = useCallback((
        message: ParsedMidiMessage,
        source: PerformanceInputSource,
    ) => {
        // Prevent feedback loop: playback must not be recorded.
        if (source === 'playback') return
        if (!isRecordingRef.current) return

        const now = Date.now()
        const startedAtMs = startedAtMsRef.current ?? now
        const atMs = now - startedAtMs

        const recordedEvent = mapParsedMidiMessageToRecordedEvent({
            source,
            atMs,
            message,
        })

        const next = [...recordingBufferRef.current, recordedEvent]
        recordingBufferRef.current = next
        setRecordingBuffer(next)
    }, [])

    const handlePerformanceEvent = useCallback((event: PerformanceInputEvent) => {
        appendToBuffer(event.message, event.source)
    }, [appendToBuffer])

    const api = useMemo(() => ({
        isRecording,
        recordingBuffer,
        recordedEvents,
        hasRecording,
        startRecording,
        stopRecording,
        clearRecording,
        handlePerformanceEvent,
    }), [
        appendToBuffer,
        clearRecording,
        hasRecording,
        isRecording,
        recordedEvents,
        recordingBuffer,
        startRecording,
        stopRecording,
        handlePerformanceEvent,
    ])

    return api
}

