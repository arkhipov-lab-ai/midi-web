import {useMemo} from 'react'
import {
    detectChordWithDebug,
    formatChordDebugText,
} from './lib'
import {ActiveNotesMap} from '@entities/useMidiPerformanceState'

export function useHarmonyChordAnalysis(soundingNotes: ActiveNotesMap) {
    return useMemo(() => {
        const debug = detectChordWithDebug(soundingNotes)
        const debugText = formatChordDebugText(debug)

        return {
            chord: debug.selected,
            debug,
            debugText,
        }
    }, [soundingNotes])
}
