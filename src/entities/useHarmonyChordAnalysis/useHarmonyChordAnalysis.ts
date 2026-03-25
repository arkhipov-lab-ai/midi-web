import {useMemo} from 'react'
import {
    detectChordWithDebug,
    formatChordDebugText,
} from './lib'
import {ActiveNotesMap} from '@entities/useMidiPerformanceState'

export function useHarmonyChordAnalysis(activeNotes: ActiveNotesMap) {
    return useMemo(() => {
        const debug = detectChordWithDebug(activeNotes)
        const debugText = formatChordDebugText(debug)

        return {
            chord: debug.selected,
            debug,
            debugText,
        }
    }, [activeNotes])
}
