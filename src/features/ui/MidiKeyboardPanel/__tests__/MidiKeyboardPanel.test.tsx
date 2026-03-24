import React from 'react'
import {render, screen} from '@testing-library/react'
import {MidiKeyboardPanel} from '../MidiKeyboardPanel'

const mockMidiKeyboard = jest.fn()
const mockSustainPedalIndicator = jest.fn()
const mockStyledMidiKeyboardPanel = jest.fn()
const mockMidiKeyboardMidiKeyboardContainer = jest.fn()

jest.mock('../components', () => ({
    MidiKeyboard: (props: any) => {
        mockMidiKeyboard(props)
        return <div data-testid='midi-keyboard' />
    },
    SustainPedalIndicator: (props: any) => {
        mockSustainPedalIndicator(props)
        return <div data-testid='sustain-pedal-indicator' />
    },
}))

jest.mock('../MidiKeyboardPanel.styles', () => ({
    MidiKeyboardPanel: (props: any) => {
        mockStyledMidiKeyboardPanel(props)
        return <div data-testid='midi-keyboard-panel'>{props.children}</div>
    },
    MidiKeyboardMidiKeyboardContainer: (props: any) => {
        mockMidiKeyboardMidiKeyboardContainer(props)
        return <div data-testid='midi-keyboard-container'>{props.children}</div>
    },
}))

describe('MidiKeyboardPanel', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders panel structure', () => {
        render(
            <MidiKeyboardPanel
                activeNotes={{60: 100}}
                sustainPressed={true}
            />
        )

        expect(screen.getByTestId('midi-keyboard-panel')).toBeInTheDocument()
        expect(screen.getByTestId('midi-keyboard-container')).toBeInTheDocument()
        expect(screen.getByTestId('midi-keyboard')).toBeInTheDocument()
        expect(screen.getByTestId('sustain-pedal-indicator')).toBeInTheDocument()
    })

    it('passes activeNotes to MidiKeyboard', () => {
        const activeNotes = {
            60: 100,
            64: 90,
        }

        render(
            <MidiKeyboardPanel
                activeNotes={activeNotes}
                sustainPressed={false}
            />
        )

        expect(mockMidiKeyboard).toHaveBeenCalledWith(
            expect.objectContaining({
                activeNotes,
            })
        )
    })

    it('passes sustainPressed to SustainPedalIndicator', () => {
        render(
            <MidiKeyboardPanel
                activeNotes={{}}
                sustainPressed={true}
            />
        )

        expect(mockSustainPedalIndicator).toHaveBeenCalledWith(
            expect.objectContaining({
                pressed: true,
            })
        )
    })

    it('renders with empty activeNotes', () => {
        render(
            <MidiKeyboardPanel
                activeNotes={{}}
                sustainPressed={false}
            />
        )

        expect(mockMidiKeyboard).toHaveBeenCalledWith(
            expect.objectContaining({
                activeNotes: {},
            })
        )
        expect(mockSustainPedalIndicator).toHaveBeenCalledWith(
            expect.objectContaining({
                pressed: false,
            })
        )
    })
})
