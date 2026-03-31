import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {
    PerformanceInputEvent,
    RecordedMidiEvent,
} from '@shared/lib'

interface UseMidiPlaybackParams {
    onEvent: (event: PerformanceInputEvent) => void
}

export function useMidiPlayback(params: UseMidiPlaybackParams) {
    const {
        onEvent,
    } = params

    const [isPlaying, setIsPlaying] = useState(false)

    const timersRef = useRef<number[]>([])
    const sessionIdRef = useRef(0)

    const clearTimers = useCallback(() => {
        for (const t of timersRef.current) {
            window.clearTimeout(t)
        }
        timersRef.current = []
    }, [])

    const stop = useCallback(() => {
        sessionIdRef.current++
        clearTimers()
        setIsPlaying(false)
    }, [clearTimers])

    useEffect(() => {
        return () => {
            clearTimers()
        }
    }, [clearTimers])

    const play = useCallback((events: RecordedMidiEvent[]) => {
        if (events.length === 0) return

        stop()

        const sorted = [...events].sort((a, b) => a.atMs - b.atMs)
        const firstAtMs = sorted[0]?.atMs ?? 0

        const sessionId = sessionIdRef.current
        const nowFn = globalThis.performance?.now?.bind(globalThis.performance)
            ?? (() => Date.now())
        const playbackStart = nowFn()

        setIsPlaying(true)

        let lastDelay = 0

        for (const event of sorted) {
            const delayMs = Math.max(0, event.atMs - firstAtMs)
            lastDelay = Math.max(lastDelay, delayMs)

            const timerId = window.setTimeout(() => {
                // Ignore timeouts from previous sessions.
                if (sessionId !== sessionIdRef.current) return

                onEvent({
                    source: 'playback',
                    message: event.message,
                })
            }, delayMs)

            timersRef.current.push(timerId)
        }

        // Mark as finished after the last scheduled event.
        const doneTimerId = window.setTimeout(() => {
            if (sessionId !== sessionIdRef.current) return
            setIsPlaying(false)
        }, lastDelay + 1)

        timersRef.current.push(doneTimerId)

        // Use playbackStart so scheduling is anchored to current time.
        // (PerformanceInputEvent has no `atMs`; we only use it to compute relative delays.)
        void playbackStart
    }, [onEvent, stop])

    // Keep stable return shape without re-creating callbacks.
    const api = useMemo(() => ({
        play,
        stop,
        isPlaying,
    }), [isPlaying, play, stop])

    return api
}

