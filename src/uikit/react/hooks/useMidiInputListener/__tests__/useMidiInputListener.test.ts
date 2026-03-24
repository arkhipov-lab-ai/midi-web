import {renderHook, act} from '@testing-library/react'
import {useMidiInputListener} from '../useMidiInputListener'
import {parseMidiMessage} from '@shared/lib'

jest.mock('@shared/lib', () => ({
    parseMidiMessage: jest.fn(),
}))

describe('useMidiInputListener', () => {
    const mockParseMidiMessage = parseMidiMessage as jest.Mock

    let midiAccessMock: MIDIAccess
    let inputMock: MIDIInput
    let inputsMap: Map<string, MIDIInput>

    beforeEach(() => {
        jest.clearAllMocks()

        inputMock = {
            id: 'input-1',
            onmidimessage: null,
        } as unknown as MIDIInput

        inputsMap = new Map()
        inputsMap.set('input-1', inputMock)

        midiAccessMock = {
            inputs: inputsMap,
        } as unknown as MIDIAccess

        mockParseMidiMessage.mockReturnValue({
            type: 'noteon',
            channel: 1,
            data1: 60,
            data2: 100,
            note: 60,
            velocity: 100,
            controller: null,
            value: null,
            raw: [144, 60, 100],
        })
    })

    it('does nothing if midiAccess is null', () => {
        const onMessage = jest.fn()
        const handleMidiMessage = jest.fn()

        renderHook(() =>
            useMidiInputListener({
                midiAccess: null,
                selectedInputId: 'input-1',
                onMessage,
                handleMidiMessage,
            })
        )

        expect(inputMock.onmidimessage).toBeNull()
    })

    it('does nothing if selectedInputId is not provided', () => {
        const onMessage = jest.fn()
        const handleMidiMessage = jest.fn()

        renderHook(() =>
            useMidiInputListener({
                midiAccess: midiAccessMock,
                selectedInputId: undefined,
                onMessage,
                handleMidiMessage,
            })
        )

        expect(inputMock.onmidimessage).toBeNull()
    })

    it('does nothing if input is not found', () => {
        const onMessage = jest.fn()
        const handleMidiMessage = jest.fn()

        renderHook(() =>
            useMidiInputListener({
                midiAccess: {
                    inputs: new Map(),
                } as MIDIAccess,
                selectedInputId: 'unknown',
                onMessage,
                handleMidiMessage,
            })
        )

        expect(inputMock.onmidimessage).toBeNull()
    })

    it('subscribes to MIDI input and handles messages', () => {
        const onMessage = jest.fn()
        const handleMidiMessage = jest.fn()

        renderHook(() =>
            useMidiInputListener({
                midiAccess: midiAccessMock,
                selectedInputId: 'input-1',
                onMessage,
                handleMidiMessage,
            })
        )

        expect(typeof inputMock.onmidimessage).toBe('function')

        const midiEvent = {
            data: new Uint8Array([144, 60, 100]),
        } as MIDIMessageEvent

        act(() => {
            inputMock.onmidimessage && inputMock.onmidimessage(midiEvent)
        })

        expect(mockParseMidiMessage).toHaveBeenCalledWith(midiEvent.data)
        expect(onMessage).toHaveBeenCalledWith(
            expect.objectContaining({type: 'noteon'}),
            inputMock
        )
        expect(handleMidiMessage).toHaveBeenCalledWith(
            expect.objectContaining({type: 'noteon'})
        )
    })

    it('cleans up listener on unmount', () => {
        const onMessage = jest.fn()
        const handleMidiMessage = jest.fn()

        const {unmount} = renderHook(() =>
            useMidiInputListener({
                midiAccess: midiAccessMock,
                selectedInputId: 'input-1',
                onMessage,
                handleMidiMessage,
            })
        )

        expect(typeof inputMock.onmidimessage).toBe('function')

        unmount()

        expect(inputMock.onmidimessage).toBeNull()
    })

    it('re-subscribes when selectedInputId changes', () => {
        const onMessage = jest.fn()
        const handleMidiMessage = jest.fn()

        const secondInput: MIDIInput = {
            id: 'input-2',
            onmidimessage: null,
        } as unknown as MIDIInput

        inputsMap.set('input-2', secondInput)

        const {rerender} = renderHook(
            (props: any) => useMidiInputListener(props),
            {
                initialProps: {
                    midiAccess: midiAccessMock,
                    selectedInputId: 'input-1',
                    onMessage,
                    handleMidiMessage,
                },
            }
        )

        expect(typeof inputMock.onmidimessage).toBe('function')

        rerender({
            midiAccess: midiAccessMock,
            selectedInputId: 'input-2',
            onMessage,
            handleMidiMessage,
        })

        expect(inputMock.onmidimessage).toBeNull()
        expect(typeof secondInput.onmidimessage).toBe('function')
    })
})
