import {MidiKeyboardKey} from '@entities/useMidiPerformanceState'
import {isBlackKey} from './lib'

interface CreateMidiKeyboardLayoutOptions {
    startMidi?: number
    endMidi?: number
    whiteKeyWidth?: number
    whiteKeyHeight?: number
    blackKeyWidth?: number
    blackKeyHeight?: number
}

export function createMidiKeyboardLayout(options: CreateMidiKeyboardLayoutOptions = {}) {

    const {
        startMidi = 21,
        endMidi = 108,
        whiteKeyWidth = 21,
        whiteKeyHeight = 122,
        blackKeyWidth = 14,
        blackKeyHeight = 77,
    } = options

    const whiteKeys: MidiKeyboardKey[] = []
    const blackKeys: MidiKeyboardKey[] = []

    let whiteIndex = 0
    let lastWhiteX = 0

    for (let midi = startMidi; midi <= endMidi; midi += 1) {
        if (isBlackKey(midi)) {
            blackKeys.push({
                midi,
                kind: 'black',
                x: lastWhiteX + whiteKeyWidth - blackKeyWidth / 2,
                width: blackKeyWidth,
                height: blackKeyHeight,
            })

            continue
        }

        const x = whiteIndex * whiteKeyWidth

        whiteKeys.push({
            midi,
            kind: 'white',
            x,
            width: whiteKeyWidth,
            height: whiteKeyHeight,
        })

        lastWhiteX = x
        whiteIndex += 1
    }

    return {
        whiteKeys,
        blackKeys,
        totalWidth: whiteIndex * whiteKeyWidth,
        totalHeight: whiteKeyHeight,
    }
}
