import {createMidiKeyboardLayout} from '../createMidiKeyboardLayout'

describe('createMidiKeyboardLayout', () => {
    it('creates default layout with correct totalHeight', () => {
        const result = createMidiKeyboardLayout()

        expect(result.totalHeight).toBe(122)
        expect(result.whiteKeys.length).toBeGreaterThan(0)
        expect(result.blackKeys.length).toBeGreaterThan(0)
    })

    it('creates layout for a single white key', () => {
        const result = createMidiKeyboardLayout({
            startMidi: 60,
            endMidi: 60,
        })

        expect(result.whiteKeys).toEqual([
            {
                midi: 60,
                kind: 'white',
                x: 0,
                width: 21,
                height: 122,
            },
        ])
        expect(result.blackKeys).toEqual([])
        expect(result.totalWidth).toBe(21)
        expect(result.totalHeight).toBe(122)
    })

    it('creates layout for a single black key', () => {
        const result = createMidiKeyboardLayout({
            startMidi: 61,
            endMidi: 61,
        })

        expect(result.whiteKeys).toEqual([])
        expect(result.blackKeys).toEqual([
            {
                midi: 61,
                kind: 'black',
                x: 14,
                width: 14,
                height: 77,
            },
        ])
        expect(result.totalWidth).toBe(0)
        expect(result.totalHeight).toBe(122)
    })

    it('places white keys sequentially by whiteKeyWidth', () => {
        const result = createMidiKeyboardLayout({
            startMidi: 60,
            endMidi: 64,
        })

        expect(result.whiteKeys).toEqual([
            {
                midi: 60,
                kind: 'white',
                x: 0,
                width: 21,
                height: 122,
            },
            {
                midi: 62,
                kind: 'white',
                x: 21,
                width: 21,
                height: 122,
            },
            {
                midi: 64,
                kind: 'white',
                x: 42,
                width: 21,
                height: 122,
            },
        ])
        expect(result.totalWidth).toBe(63)
    })

    it('places black keys relative to previous white key', () => {
        const result = createMidiKeyboardLayout({
            startMidi: 60,
            endMidi: 64,
        })

        expect(result.blackKeys).toEqual([
            {
                midi: 61,
                kind: 'black',
                x: 14,
                width: 14,
                height: 77,
            },
            {
                midi: 63,
                kind: 'black',
                x: 35,
                width: 14,
                height: 77,
            },
        ])
    })

    it('uses custom dimensions', () => {
        const result = createMidiKeyboardLayout({
            startMidi: 60,
            endMidi: 64,
            whiteKeyWidth: 30,
            whiteKeyHeight: 150,
            blackKeyWidth: 20,
            blackKeyHeight: 90,
        })

        expect(result.whiteKeys).toEqual([
            {
                midi: 60,
                kind: 'white',
                x: 0,
                width: 30,
                height: 150,
            },
            {
                midi: 62,
                kind: 'white',
                x: 30,
                width: 30,
                height: 150,
            },
            {
                midi: 64,
                kind: 'white',
                x: 60,
                width: 30,
                height: 150,
            },
        ])

        expect(result.blackKeys).toEqual([
            {
                midi: 61,
                kind: 'black',
                x: 20,
                width: 20,
                height: 90,
            },
            {
                midi: 63,
                kind: 'black',
                x: 50,
                width: 20,
                height: 90,
            },
        ])

        expect(result.totalWidth).toBe(90)
        expect(result.totalHeight).toBe(150)
    })

    it('returns empty layout when startMidi is greater than endMidi', () => {
        const result = createMidiKeyboardLayout({
            startMidi: 70,
            endMidi: 60,
        })

        expect(result.whiteKeys).toEqual([])
        expect(result.blackKeys).toEqual([])
        expect(result.totalWidth).toBe(0)
        expect(result.totalHeight).toBe(122)
    })

    it('creates correct layout for mixed range starting from black key', () => {
        const result = createMidiKeyboardLayout({
            startMidi: 61,
            endMidi: 64,
        })

        expect(result.whiteKeys).toEqual([
            {
                midi: 62,
                kind: 'white',
                x: 0,
                width: 21,
                height: 122,
            },
            {
                midi: 64,
                kind: 'white',
                x: 21,
                width: 21,
                height: 122,
            },
        ])

        expect(result.blackKeys).toEqual([
            {
                midi: 61,
                kind: 'black',
                x: 14,
                width: 14,
                height: 77,
            },
            {
                midi: 63,
                kind: 'black',
                x: 14,
                width: 14,
                height: 77,
            },
        ])

        expect(result.totalWidth).toBe(42)
    })
})
