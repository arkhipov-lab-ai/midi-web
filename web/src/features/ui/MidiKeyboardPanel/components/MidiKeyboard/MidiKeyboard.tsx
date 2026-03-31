import React, {useMemo} from 'react'
import {createMidiKeyboardLayout, renderKey} from './lib'
import {ActiveNotesMap} from '@entities/useMidiPerformanceState'
import {MidiKeyboard as StyledMidiKeyboard} from './MidiKeyboard.styles'

interface MidiKeyboardProps {
    pressedNotes: ActiveNotesMap
    soundingNotes: ActiveNotesMap
    startMidi?: number
    endMidi?: number
    whiteKeyWidth?: number
    whiteKeyHeight?: number
    blackKeyWidth?: number
    blackKeyHeight?: number
    onNotePress?: (midi: number) => void
    onNoteRelease?: (midi: number) => void
}

export const MidiKeyboard: React.FC<MidiKeyboardProps> = (props) => {

    const {
        pressedNotes,
        soundingNotes,
        startMidi = 21,
        endMidi = 108,
        whiteKeyWidth = 19,
        whiteKeyHeight = 118,
        blackKeyWidth = 13,
        blackKeyHeight = 75,
        onNotePress,
        onNoteRelease,
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

    const interaction = onNotePress || onNoteRelease
        ? {onNotePress, onNoteRelease}
        : undefined

    return (
        <StyledMidiKeyboard>
            <svg
                width={layout.totalWidth}
                height={layout.totalHeight}
                role='img'
                aria-label='MIDI keyboard'
            >
                {layout.whiteKeys.map((key) => renderKey(
                    key,
                    pressedNotes[key.midi],
                    soundingNotes[key.midi],
                    interaction,
                ))}
                {layout.blackKeys.map((key) => renderKey(
                    key,
                    pressedNotes[key.midi],
                    soundingNotes[key.midi],
                    interaction,
                ))}
            </svg>
        </StyledMidiKeyboard>
    )
}
