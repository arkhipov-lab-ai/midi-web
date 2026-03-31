import {requestMidiAccess} from '../requestMidiAccess'

describe('requestMidiAccess', () => {
    const originalNavigator = global.navigator

    afterEach(() => {
        Object.defineProperty(global, 'navigator', {
            value: originalNavigator,
            configurable: true,
        })
    })

    it('throws error when Web MIDI is not supported', async () => {
        Object.defineProperty(global, 'navigator', {
            value: {},
            configurable: true,
        })

        await expect(requestMidiAccess()).rejects.toThrow(
            'Web MIDI API is not supported in this browser'
        )
    })
})
