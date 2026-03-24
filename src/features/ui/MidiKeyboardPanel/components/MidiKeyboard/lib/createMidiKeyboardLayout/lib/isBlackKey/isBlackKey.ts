import {BLACK_PITCH_CLASSES} from '../../../constants'

export function isBlackKey(midi: number): boolean {
    return BLACK_PITCH_CLASSES.has(midi % 12)
}
