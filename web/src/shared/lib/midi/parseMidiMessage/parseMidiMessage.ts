import type {ParsedMidiMessage} from '../api'

export function parseMidiMessage(data: Uint8Array): ParsedMidiMessage {
    const status = data[0]
    const data1 = data.length > 1 ? data[1] : null
    const data2 = data.length > 2 ? data[2] : null

    if (typeof status !== 'number') {
        return {
            type: 'other',
            channel: null,
            data1: null,
            data2: null,
            note: null,
            velocity: null,
            controller: null,
            value: null,
            raw: [],
        }
    }

    const messageTypeNibble = status >> 4
    const channel = (status & 0x0f) + 1
    const raw = Array.from(data)

    if (messageTypeNibble === 0x9 && data1 !== null && data2 !== null) {
        if (data2 === 0) {
            return {
                type: 'noteoff',
                channel,
                data1,
                data2,
                note: data1,
                velocity: data2,
                controller: null,
                value: null,
                raw,
            }
        }

        return {
            type: 'noteon',
            channel,
            data1,
            data2,
            note: data1,
            velocity: data2,
            controller: null,
            value: null,
            raw,
        }
    }

    if (messageTypeNibble === 0x8) {
        return {
            type: 'noteoff',
            channel,
            data1,
            data2,
            note: data1,
            velocity: data2,
            controller: null,
            value: null,
            raw,
        }
    }

    if (messageTypeNibble === 0xb) {
        return {
            type: 'controlchange',
            channel,
            data1,
            data2,
            note: null,
            velocity: null,
            controller: data1,
            value: data2,
            raw,
        }
    }

    return {
        type: 'other',
        channel,
        data1,
        data2,
        note: null,
        velocity: null,
        controller: null,
        value: null,
        raw,
    }
}
