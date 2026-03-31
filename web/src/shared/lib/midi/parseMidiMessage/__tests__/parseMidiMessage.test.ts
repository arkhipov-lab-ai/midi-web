import {parseMidiMessage} from '../parseMidiMessage'

describe('parseMidiMessage', () => {
    it('parses note on message', () => {
        const data = new Uint8Array([0x90, 60, 100])

        const result = parseMidiMessage(data)

        expect(result).toEqual({
            type: 'noteon',
            channel: 1,
            data1: 60,
            data2: 100,
            note: 60,
            velocity: 100,
            controller: null,
            value: null,
            raw: [0x90, 60, 100],
        })
    })

    it('parses note on with zero velocity as note off', () => {
        const data = new Uint8Array([0x91, 64, 0])

        const result = parseMidiMessage(data)

        expect(result).toEqual({
            type: 'noteoff',
            channel: 2,
            data1: 64,
            data2: 0,
            note: 64,
            velocity: 0,
            controller: null,
            value: null,
            raw: [0x91, 64, 0],
        })
    })

    it('parses note off message', () => {
        const data = new Uint8Array([0x82, 67, 45])

        const result = parseMidiMessage(data)

        expect(result).toEqual({
            type: 'noteoff',
            channel: 3,
            data1: 67,
            data2: 45,
            note: 67,
            velocity: 45,
            controller: null,
            value: null,
            raw: [0x82, 67, 45],
        })
    })

    it('parses control change message', () => {
        const data = new Uint8Array([0xb3, 7, 127])

        const result = parseMidiMessage(data)

        expect(result).toEqual({
            type: 'controlchange',
            channel: 4,
            data1: 7,
            data2: 127,
            note: null,
            velocity: null,
            controller: 7,
            value: 127,
            raw: [0xb3, 7, 127],
        })
    })

    it('parses unknown message as other', () => {
        const data = new Uint8Array([0xe0, 1, 2])

        const result = parseMidiMessage(data)

        expect(result).toEqual({
            type: 'other',
            channel: 1,
            data1: 1,
            data2: 2,
            note: null,
            velocity: null,
            controller: null,
            value: null,
            raw: [0xe0, 1, 2],
        })
    })

    it('returns other with empty values when status is missing', () => {
        const data = new Uint8Array([])

        const result = parseMidiMessage(data)

        expect(result).toEqual({
            type: 'other',
            channel: null,
            data1: null,
            data2: null,
            note: null,
            velocity: null,
            controller: null,
            value: null,
            raw: [],
        })
    })

    it('handles note off with missing data2', () => {
        const data = new Uint8Array([0x80, 60])

        const result = parseMidiMessage(data)

        expect(result).toEqual({
            type: 'noteoff',
            channel: 1,
            data1: 60,
            data2: null,
            note: 60,
            velocity: null,
            controller: null,
            value: null,
            raw: [0x80, 60],
        })
    })

    it('handles control change with missing data2', () => {
        const data = new Uint8Array([0xb0, 10])

        const result = parseMidiMessage(data)

        expect(result).toEqual({
            type: 'controlchange',
            channel: 1,
            data1: 10,
            data2: null,
            note: null,
            velocity: null,
            controller: 10,
            value: null,
            raw: [0xb0, 10],
        })
    })
})
