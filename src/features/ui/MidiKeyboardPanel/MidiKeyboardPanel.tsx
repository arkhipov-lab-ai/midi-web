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
    activeNotes: ActiveNotesMap
    sustainPressed: boolean
}

export const MidiKeyboardPanel: React.FC<MidiKeyboardPanelProps> = (props) => {

    const {
        activeNotes,
        sustainPressed,
    } = props

    return (
        <StyledMidiKeyboardPanel>
            <MidiKeyboardMidiKeyboardContainer>
                <MidiKeyboard
                    activeNotes={activeNotes}
                />
            </MidiKeyboardMidiKeyboardContainer>

            <SustainPedalIndicator
                pressed={sustainPressed}
            />
        </StyledMidiKeyboardPanel>
    )
}
