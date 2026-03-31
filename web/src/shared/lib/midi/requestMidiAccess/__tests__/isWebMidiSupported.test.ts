import {isWebMidiSupported} from '../requestMidiAccess'

describe('isWebMidiSupported', () => {
    const originalNavigator = global.navigator

    afterEach(() => {
        Object.defineProperty(global, 'navigator', {
            value: originalNavigator,
            configurable: true,
        })
    })

    it('returns true when navigator.requestMIDIAccess exists', () => {
        Object.defineProperty(global, 'navigator', {
            value: {
                requestMIDIAccess: jest.fn(),
            },
            configurable: true,
        })

        expect(isWebMidiSupported()).toBe(true)
    })
})
