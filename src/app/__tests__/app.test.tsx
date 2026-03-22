import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {App} from '../app'

type MockMidiMessageEvent = {
    data: Uint8Array
}

type MockMidiInput = {
    id: string
    name: string
    manufacturer?: string
    onmidimessage: ((event: MockMidiMessageEvent) => void) | null
}

type MockMidiAccess = {
    inputs: Map<string, MIDIInput>
    onstatechange: (() => void) | null
}

function createMockMidiInput(params?: Partial<MockMidiInput>): MockMidiInput {
    return {
        id: params?.id ?? 'input-1',
        name: params?.name ?? 'Test MIDI Keyboard',
        manufacturer: params?.manufacturer ?? 'Test Manufacturer',
        onmidimessage: null,
    }
}

function createMockMidiAccess(inputs: MockMidiInput[]): MockMidiAccess {
    return {
        inputs: new Map(inputs.map((input) => [input.id, input as unknown as MIDIInput])),
        onstatechange: null,
    }
}

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    })
})

describe('App', () => {
    const originalRequestMidiAccess = (
        navigator as Navigator & {
            requestMIDIAccess?: () => Promise<MIDIAccess>
        }
    ).requestMIDIAccess

    afterEach(() => {
        jest.restoreAllMocks()

        if (originalRequestMidiAccess) {
            ;(
                navigator as Navigator & {
                    requestMIDIAccess?: () => Promise<MIDIAccess>
                }
            ).requestMIDIAccess = originalRequestMidiAccess
        } else {
            delete (
                navigator as Navigator & {
                    requestMIDIAccess?: () => Promise<MIDIAccess>
                }
            ).requestMIDIAccess
        }
    })

    it('shows "not supported" when Web MIDI API is unavailable', () => {
        delete (
            navigator as Navigator & {
                requestMIDIAccess?: () => Promise<MIDIAccess>
            }
        ).requestMIDIAccess

        render(<App/>)

        expect(screen.getByText(/web midi support:/i)).toBeInTheDocument()
        expect(screen.getByText(/not supported/i)).toBeInTheDocument()
        expect(
            screen.getByText(/this browser does not support web midi api/i),
        ).toBeInTheDocument()
    })

    it('shows "supported" and calls requestMIDIAccess after clicking Connect MIDI', async () => {
        const mockInput = createMockMidiInput()
        const mockAccess = createMockMidiAccess([mockInput])

        const requestMidiAccessMock = jest.fn().mockResolvedValue(mockAccess)

        ;(
            navigator as Navigator & {
                requestMIDIAccess?: jest.Mock
            }
        ).requestMIDIAccess = requestMidiAccessMock

        const user = userEvent.setup()

        render(<App/>)

        expect(screen.getByText(/supported/i)).toBeInTheDocument()

        await user.click(screen.getByRole('button', {name: /connect midi/i}))

        await waitFor(() => {
            expect(requestMidiAccessMock).toHaveBeenCalledTimes(1)
        })
    })

    it('parses note-on with velocity 0 as noteoff', async () => {
        const mockInput = createMockMidiInput({name: 'Zero Velocity Keyboard'})
        const mockAccess = createMockMidiAccess([mockInput])

        const requestMidiAccessMock = jest.fn().mockResolvedValue(mockAccess)

        ;(
            navigator as Navigator & {
                requestMIDIAccess?: jest.Mock
            }
        ).requestMIDIAccess = requestMidiAccessMock

        const user = userEvent.setup()

        render(<App/>)

        await user.click(screen.getByRole('button', {name: /connect midi/i}))

        await waitFor(() => {
            expect(mockInput.onmidimessage).toEqual(expect.any(Function))
        })

        mockInput.onmidimessage?.({
            data: new Uint8Array([0x90, 60, 0]),
        })

        expect(await screen.findByText('noteoff')).toBeInTheDocument()
        expect(screen.getByText('[144, 60, 0]')).toBeInTheDocument()
    })
})
