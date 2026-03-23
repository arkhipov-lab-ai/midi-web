import {act, renderHook, waitFor} from '@testing-library/react'
import {useMidiAccess} from '../useMidiAccess'
import {
    getMidiInputs,
    isWebMidiSupported,
    requestMidiAccess,
} from '@shared/lib'

jest.mock('@shared/lib', () => ({
    getMidiInputs: jest.fn(),
    isWebMidiSupported: jest.fn(),
    requestMidiAccess: jest.fn(),
}))

describe('useMidiAccess', () => {
    const mockIsWebMidiSupported = isWebMidiSupported as jest.MockedFunction<typeof isWebMidiSupported>
    const mockRequestMidiAccess = requestMidiAccess as jest.MockedFunction<typeof requestMidiAccess>
    const mockGetMidiInputs = getMidiInputs as jest.MockedFunction<typeof getMidiInputs>

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('returns initial unsupported state when Web MIDI is not supported', () => {
        mockIsWebMidiSupported.mockReturnValue(false)

        const {result} = renderHook(() => useMidiAccess())

        expect(result.current.isSupported).toBe(false)
        expect(result.current.midiAccess).toBeNull()
        expect(result.current.inputs).toEqual([])
        expect(typeof result.current.connect).toBe('function')
    })

    it('returns initial supported state when Web MIDI is supported', () => {
        mockIsWebMidiSupported.mockReturnValue(true)

        const {result} = renderHook(() => useMidiAccess())

        expect(result.current.isSupported).toBe(true)
        expect(result.current.midiAccess).toBeNull()
        expect(result.current.inputs).toEqual([])
    })

    it('connects to MIDI access and sets midiAccess and inputs', async () => {
        mockIsWebMidiSupported.mockReturnValue(true)

        const midiAccess = {
            onstatechange: null,
        } as unknown as MIDIAccess

        const mappedInputs = [
            {id: '1', name: 'Keyboard', manufacturer: 'Yamaha'},
            {id: '2', name: 'Pad', manufacturer: 'Akai'},
        ]

        mockRequestMidiAccess.mockResolvedValue(midiAccess)
        mockGetMidiInputs.mockReturnValue(mappedInputs)

        const {result} = renderHook(() => useMidiAccess())

        await act(async () => {
            await result.current.connect()
        })

        await waitFor(() => {
            expect(result.current.midiAccess).toBe(midiAccess)
            expect(result.current.inputs).toEqual(mappedInputs)
        })

        expect(mockRequestMidiAccess).toHaveBeenCalledTimes(1)
        expect(mockGetMidiInputs).toHaveBeenCalledWith(midiAccess)
    })

    it('assigns onstatechange handler after successful connect', async () => {
        mockIsWebMidiSupported.mockReturnValue(true)

        const midiAccess: MIDIAccess = {
            onstatechange: null,
        } as MIDIAccess

        mockRequestMidiAccess.mockResolvedValue(midiAccess)
        mockGetMidiInputs.mockReturnValue([])

        const {result} = renderHook(() => useMidiAccess())

        await act(async () => {
            await result.current.connect()
        })

        await waitFor(() => {
            expect(typeof midiAccess.onstatechange).toBe('function')
        })
    })

    it('refreshes inputs when midiAccess state changes', async () => {
        mockIsWebMidiSupported.mockReturnValue(true)

        const midiAccess: MIDIAccess = {
            onstatechange: null,
        } as MIDIAccess

        mockRequestMidiAccess.mockResolvedValue(midiAccess)
        mockGetMidiInputs
            .mockReturnValueOnce([{id: '1', name: 'Keyboard', manufacturer: 'Yamaha'}])
            .mockReturnValueOnce([
                {id: '1', name: 'Keyboard', manufacturer: 'Yamaha'},
                {id: '2', name: 'Pad', manufacturer: 'Akai'},
            ])

        const {result} = renderHook(() => useMidiAccess())

        await act(async () => {
            await result.current.connect()
        })

        await waitFor(() => {
            expect(result.current.inputs).toEqual([
                {id: '1', name: 'Keyboard', manufacturer: 'Yamaha'},
            ])
        })

        act(() => {
            if (midiAccess.onstatechange) {
                midiAccess.onstatechange(new Event('statechange') as MIDIConnectionEvent)
            }
        })

        await waitFor(() => {
            expect(result.current.inputs).toEqual([
                {id: '1', name: 'Keyboard', manufacturer: 'Yamaha'},
                {id: '2', name: 'Pad', manufacturer: 'Akai'},
            ])
        })

        expect(mockGetMidiInputs).toHaveBeenCalledTimes(2)
        expect(mockGetMidiInputs).toHaveBeenNthCalledWith(1, midiAccess)
        expect(mockGetMidiInputs).toHaveBeenNthCalledWith(2, midiAccess)
    })

    it('cleans up onstatechange on unmount', async () => {
        mockIsWebMidiSupported.mockReturnValue(true)

        const midiAccess: MIDIAccess = {
            onstatechange: null,
        } as MIDIAccess

        mockRequestMidiAccess.mockResolvedValue(midiAccess)
        mockGetMidiInputs.mockReturnValue([])

        const {result, unmount} = renderHook(() => useMidiAccess())

        await act(async () => {
            await result.current.connect()
        })

        await waitFor(() => {
            expect(typeof midiAccess.onstatechange).toBe('function')
        })

        unmount()

        expect(midiAccess.onstatechange).toBeNull()
    })

    it('propagates connect error from requestMidiAccess', async () => {
        mockIsWebMidiSupported.mockReturnValue(true)
        mockRequestMidiAccess.mockRejectedValue(new Error('MIDI denied'))

        const {result} = renderHook(() => useMidiAccess())

        await expect(
            act(async () => {
                await result.current.connect()
            })
        ).rejects.toThrow('MIDI denied')

        expect(result.current.midiAccess).toBeNull()
        expect(result.current.inputs).toEqual([])
        expect(mockGetMidiInputs).not.toHaveBeenCalled()
    })
})
