import {detectChordWithDebug} from '../detectChordWithDebug'
import {DetectedChordInfo} from '@shared/lib'
import {ActiveNotesMap} from '@entities/useMidiPerformanceState'

export function detectChord(activeNotes: ActiveNotesMap): DetectedChordInfo | null {
    return detectChordWithDebug(activeNotes).selected
}
