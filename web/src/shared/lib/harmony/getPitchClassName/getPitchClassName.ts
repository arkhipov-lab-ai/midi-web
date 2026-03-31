import {PITCH_CLASS_NAMES_SHARP} from '../constants'

export function getPitchClassName(pitchClass: number): string {
    return PITCH_CLASS_NAMES_SHARP[((pitchClass % 12) + 12) % 12]
}
