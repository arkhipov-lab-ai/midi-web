import {NOTE_NAMES} from '../lib'

export function getMidiNoteName(note: number | null): string | null {
    if (note === null || note < 0 || note > 127) {
        return null
    }

    const noteName = NOTE_NAMES[note % 12]
    const octave = Math.floor(note / 12) - 1

    return `${noteName}${octave}`
}
