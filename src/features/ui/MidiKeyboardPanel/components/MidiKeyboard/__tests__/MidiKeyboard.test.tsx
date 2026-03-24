import React from 'react'
import {render, screen} from '@testing-library/react'
import {MidiKeyboard} from '../MidiKeyboard'
import {createMidiKeyboardLayout, renderKey} from '../lib'

jest.mock('../lib', () => ({
    createMidiKeyboardLayout: jest.fn(),
    renderKey: jest.fn(),
}))

jest.mock('../MidiKeyboard.styles', () => ({
    MidiKeyboard: ({children}: React.PropsWithChildren) => (
        <div data-testid='styled-midi-keyboard'>{children}</div>
    ),
}))

const mockCreateMidiKeyboardLayout = createMidiKeyboardLayout as jest.MockedFunction<typeof createMidiKeyboardLayout>
const mockRenderKey = renderKey as jest.MockedFunction<typeof renderKey>

describe('MidiKeyboard', () => {
    beforeEach(() => {
        jest.clearAllMocks()

        mockCreateMidiKeyboardLayout.mockReturnValue({
            whiteKeys: [
                {midi: 60, kind: 'white', x: 0, width: 19, height: 118},
                {midi: 62, kind: 'white', x: 19, width: 19, height: 118},
            ],
            blackKeys: [
                {midi: 61, kind: 'black', x: 12.5, width: 13, height: 75},
            ],
            totalWidth: 38,
            totalHeight: 118,
        })

        mockRenderKey.mockImplementation((key, velocity) => (
            <g data-testid={`key-${key.midi}`} key={key.midi} data-velocity={velocity ?? ''} />
        ))
    })

    it('renders keyboard svg with aria attributes and dimensions from layout', () => {
        render(<MidiKeyboard activeNotes={{}} />)

        const svg = screen.getByRole('img', {name: 'MIDI keyboard'})

        expect(svg).toBeInTheDocument()
        expect(svg).toHaveAttribute('width', '38')
        expect(svg).toHaveAttribute('height', '118')
    })

    it('calls createMidiKeyboardLayout with default props', () => {
        render(<MidiKeyboard activeNotes={{}} />)

        expect(mockCreateMidiKeyboardLayout).toHaveBeenCalledTimes(1)
        expect(mockCreateMidiKeyboardLayout).toHaveBeenCalledWith({
            startMidi: 21,
            endMidi: 108,
            whiteKeyWidth: 19,
            whiteKeyHeight: 118,
            blackKeyWidth: 13,
            blackKeyHeight: 75,
        })
    })

    it('calls createMidiKeyboardLayout with custom props', () => {
        render(
            <MidiKeyboard
                activeNotes={{}}
                startMidi={36}
                endMidi={84}
                whiteKeyWidth={20}
                whiteKeyHeight={120}
                blackKeyWidth={12}
                blackKeyHeight={70}
            />
        )

        expect(mockCreateMidiKeyboardLayout).toHaveBeenCalledWith({
            startMidi: 36,
            endMidi: 84,
            whiteKeyWidth: 20,
            whiteKeyHeight: 120,
            blackKeyWidth: 12,
            blackKeyHeight: 70,
        })
    })

    it('renders white and black keys using renderKey', () => {
        render(<MidiKeyboard activeNotes={{}} />)

        expect(mockRenderKey).toHaveBeenCalledTimes(3)
        expect(screen.getByTestId('key-60')).toBeInTheDocument()
        expect(screen.getByTestId('key-61')).toBeInTheDocument()
        expect(screen.getByTestId('key-62')).toBeInTheDocument()
    })

    it('passes active note velocities to renderKey', () => {
        render(
            <MidiKeyboard
                activeNotes={{
                    60: 100,
                    61: 64,
                }}
            />
        )

        expect(mockRenderKey).toHaveBeenNthCalledWith(
            1,
            {midi: 60, kind: 'white', x: 0, width: 19, height: 118},
            100
        )
        expect(mockRenderKey).toHaveBeenNthCalledWith(
            2,
            {midi: 62, kind: 'white', x: 19, width: 19, height: 118},
            undefined
        )
        expect(mockRenderKey).toHaveBeenNthCalledWith(
            3,
            {midi: 61, kind: 'black', x: 12.5, width: 13, height: 75},
            64
        )
    })

    it('renders inside styled wrapper', () => {
        render(<MidiKeyboard activeNotes={{}} />)

        expect(screen.getByTestId('styled-midi-keyboard')).toBeInTheDocument()
    })
})
