import React, {useMemo} from 'react'
import {createMidiKeyboardLayout, renderKey} from './lib'
import {ActiveNotesMap} from '@entities/useMidiPerformanceState'
import {MidiKeyboard as StyledMidiKeyboard} from './MidiKeyboard.styles'

interface MidiKeyboardProps {
    activeNotes: ActiveNotesMap
    startMidi?: number
    endMidi?: number
    whiteKeyWidth?: number
    whiteKeyHeight?: number
    blackKeyWidth?: number
    blackKeyHeight?: number
}

export const MidiKeyboard: React.FC<MidiKeyboardProps> = (props) => {

    const {
        activeNotes,
        startMidi = 21,
        endMidi = 108,
        whiteKeyWidth = 19,
        whiteKeyHeight = 118,
        blackKeyWidth = 13,
        blackKeyHeight = 75,
    } = props

    const layout = useMemo(() => {
        return createMidiKeyboardLayout({
            startMidi,
            endMidi,
            whiteKeyWidth,
            whiteKeyHeight,
            blackKeyWidth,
            blackKeyHeight,
        })
    }, [
        startMidi,
        endMidi,
        whiteKeyWidth,
        whiteKeyHeight,
        blackKeyWidth,
        blackKeyHeight,
    ])

    return (
        <StyledMidiKeyboard>
            <svg
                width={layout.totalWidth}
                height={layout.totalHeight}
                role='img'
                aria-label='MIDI keyboard'
            >
                {layout.whiteKeys.map((key) => renderKey(key, activeNotes[key.midi]))}
                {layout.blackKeys.map((key) => renderKey(key, activeNotes[key.midi]))}
            </svg>
        </StyledMidiKeyboard>
    )
}
