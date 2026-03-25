import {
    midiToPitchClass,
    normalizePitchClasses,
    NormalizedActiveNotes,
    WeightedPitchClass,
} from '@shared/lib'
import {ActiveNotesMap} from '@entities/useMidiPerformanceState'

/**
 * Converts current active MIDI notes into a normalized music-oriented structure.
 */
export function normalizeActiveNotes(activeNotes: ActiveNotesMap): NormalizedActiveNotes {
    const midiNotes = Object.entries(activeNotes)
        .filter(([, velocity]) => typeof velocity === 'number' && velocity > 0)
        .map(([note]) => Number(note))
        .sort((a, b) => a - b)

    const pitchClassWeightsMap = new Map<number, number>()

    midiNotes.forEach((midi) => {
        const velocity = activeNotes[midi] ?? 0
        const pitchClass = midiToPitchClass(midi)
        const currentWeight = pitchClassWeightsMap.get(pitchClass) ?? 0

        pitchClassWeightsMap.set(pitchClass, currentWeight + velocity)
    })

    const weightedPitchClasses: WeightedPitchClass[] = Array.from(pitchClassWeightsMap.entries())
        .map(([pitchClass, weight]) => ({
            pitchClass,
            weight,
        }))
        .sort((a, b) => b.weight - a.weight)

    const bassMidiNote = midiNotes.length > 0 ? midiNotes[0] : null
    const bassPitchClass = bassMidiNote !== null ? midiToPitchClass(bassMidiNote) : null

    return {
        midiNotes,
        pitchClasses: normalizePitchClasses(midiNotes.map(midiToPitchClass)),
        weightedPitchClasses,
        bassMidiNote,
        bassPitchClass,
    }
}
