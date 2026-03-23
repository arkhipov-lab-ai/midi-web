import {getMidiNoteName} from '../getMidiNoteName'

describe('getMidiNoteName', () => {
    it('returns correct note name for middle C (60)', () => {
        expect(getMidiNoteName(60)).toBe('C4')
    })

    it('returns correct note name for lowest MIDI note (0)', () => {
        expect(getMidiNoteName(0)).toBe('C-1')
    })

    it('returns correct note name for highest MIDI note (127)', () => {
        expect(getMidiNoteName(127)).toBe('G9')
    })

    it('returns correct note names across different octaves', () => {
        expect(getMidiNoteName(61)).toBe('C#4')
        expect(getMidiNoteName(62)).toBe('D4')
        expect(getMidiNoteName(69)).toBe('A4')
    })

    it('returns null when note is null', () => {
        expect(getMidiNoteName(null)).toBeNull()
    })

    it('returns null when note is less than 0', () => {
        expect(getMidiNoteName(-1)).toBeNull()
    })

    it('returns null when note is greater than 127', () => {
        expect(getMidiNoteName(128)).toBeNull()
    })

    it('correctly wraps note names using modulo 12', () => {
        expect(getMidiNoteName(12)).toBe('C0')
        expect(getMidiNoteName(24)).toBe('C1')
        expect(getMidiNoteName(25)).toBe('C#1')
    })
})
