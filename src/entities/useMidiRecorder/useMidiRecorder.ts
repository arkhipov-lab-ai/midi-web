import {useCallback, useRef, useState} from 'react'
import type {
    PerformanceInputSource,
    RecordedMidiEvent,
    ParsedMidiMessage,
} from '@shared/lib'
import {mapParsedMidiMessageToRecordedEvent} from './lib'

export function useMidiRecorder() {
    const startedAtMsRef = useRef<number | null>(null)
    const [recordedEvents, setRecordedEvents] = useState<RecordedMidiEvent[]>([])

    const handleMidiMessage = useCallback((
        message: ParsedMidiMessage,
        source: PerformanceInputSource,
    ) => {
        const now = Date.now()
        if (startedAtMsRef.current === null) {
            startedAtMsRef.current = now
        }

        const timeMs = now - (startedAtMsRef.current ?? now)
        const recordedEvent = mapParsedMidiMessageToRecordedEvent({
            source,
            timeMs,
            message,
        })

        setRecordedEvents((prev) => [...prev, recordedEvent])
    }, [])

    return {
        recordedEvents,
        handleMidiMessage,
    }
}

