import React from 'react'
import {
    MidiKeyboard,
    SustainPedalIndicator,
} from './components'
import type {ActiveNotesMap} from '@entities/useMidiPerformanceState'
import {
    MidiKeyboardPanel as StyledMidiKeyboardPanel,
    MidiKeyboardMidiKeyboardContainer,
} from './MidiKeyboardPanel.styles'

interface MidiKeyboardPanelProps {
    pressedNotes: ActiveNotesMap
    soundingNotes: ActiveNotesMap
    sustainPressed: boolean
    onNotePress?: (midi: number) => void
    onNoteRelease?: (midi: number) => void
}

export const MidiKeyboardPanel: React.FC<MidiKeyboardPanelProps> = (props) => {

    const {
        pressedNotes,
        soundingNotes,
        sustainPressed,
        onNotePress,
        onNoteRelease,
    } = props

    return (
        <StyledMidiKeyboardPanel>
            <MidiKeyboardMidiKeyboardContainer>
                <MidiKeyboard
                    pressedNotes={pressedNotes}
                    soundingNotes={soundingNotes}
                    onNotePress={onNotePress}
                    onNoteRelease={onNoteRelease}
                />
            </MidiKeyboardMidiKeyboardContainer>

            <SustainPedalIndicator
                pressed={sustainPressed}
            />
        </StyledMidiKeyboardPanel>
    )
}
