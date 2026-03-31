import {getMidiInputs} from '../getMidiInputs'

describe('getMidiInputs', () => {
    it('maps MIDI inputs to client devices', () => {
        const input1 = {
            id: 'input-1',
            name: 'Keyboard 1',
            manufacturer: 'Yamaha',
        }

        const input2 = {
            id: 'input-2',
            name: 'Pad Controller',
            manufacturer: 'Akai',
        }

        const access = {
            inputs: new Map([
                ['1', input1],
                ['2', input2],
            ]),
        } as unknown as MIDIAccess

        const result = getMidiInputs(access)

        expect(result).toEqual([
            {
                id: 'input-1',
                name: 'Keyboard 1',
                manufacturer: 'Yamaha',
            },
            {
                id: 'input-2',
                name: 'Pad Controller',
                manufacturer: 'Akai',
            },
        ])
    })

    it('uses fallback values for missing name and manufacturer', () => {
        const input = {
            id: 'input-1',
            name: '',
            manufacturer: '',
        }

        const access = {
            inputs: new Map([['1', input]]),
        } as unknown as MIDIAccess

        const result = getMidiInputs(access)

        expect(result).toEqual([
            {
                id: 'input-1',
                name: 'Unknown MIDI input',
                manufacturer: null,
            },
        ])
    })

    it('returns empty array when there are no MIDI inputs', () => {
        const access = {
            inputs: new Map(),
        } as unknown as MIDIAccess

        const result = getMidiInputs(access)

        expect(result).toEqual([])
    })

    it('keeps input order from access.inputs.values()', () => {
        const access = {
            inputs: new Map([
                ['a', {id: 'a', name: 'First', manufacturer: 'M1'}],
                ['b', {id: 'b', name: 'Second', manufacturer: 'M2'}],
                ['c', {id: 'c', name: 'Third', manufacturer: 'M3'}],
            ]),
        } as unknown as MIDIAccess

        const result = getMidiInputs(access)

        expect(result.map(item => item.id)).toEqual(['a', 'b', 'c'])
    })
})
