import {ActiveNotesMap} from '../../../../api'

export function removeNote(notes: ActiveNotesMap, midi: number): ActiveNotesMap {
    const next = {...notes}
    delete next[midi]
    return next
}
