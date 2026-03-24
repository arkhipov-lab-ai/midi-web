import {isBlackKey} from '../isBlackKey'

describe('isBlackKey', () => {
    it('returns true for black keys (pitch classes)', () => {
        expect(isBlackKey(1)).toBe(true)   // C#
        expect(isBlackKey(3)).toBe(true)   // D#
        expect(isBlackKey(6)).toBe(true)   // F#
        expect(isBlackKey(8)).toBe(true)   // G#
        expect(isBlackKey(10)).toBe(true)  // A#
    })

    it('returns false for white keys', () => {
        expect(isBlackKey(0)).toBe(false)  // C
        expect(isBlackKey(2)).toBe(false)  // D
        expect(isBlackKey(4)).toBe(false)  // E
        expect(isBlackKey(5)).toBe(false)  // F
        expect(isBlackKey(7)).toBe(false)  // G
        expect(isBlackKey(9)).toBe(false)  // A
        expect(isBlackKey(11)).toBe(false) // B
    })

    it('works correctly across octaves using modulo 12', () => {
        expect(isBlackKey(13)).toBe(true)  // 13 % 12 = 1 (C#)
        expect(isBlackKey(15)).toBe(true)  // 15 % 12 = 3 (D#)
        expect(isBlackKey(18)).toBe(true)  // 18 % 12 = 6 (F#)

        expect(isBlackKey(12)).toBe(false) // 12 % 12 = 0 (C)
        expect(isBlackKey(14)).toBe(false) // 14 % 12 = 2 (D)
    })

    it('handles large midi numbers', () => {
        expect(isBlackKey(127)).toBe(false) // 127 % 12 = 7 (G)
        expect(isBlackKey(126)).toBe(true)  // 126 % 12 = 6 (F#)
    })

    it('handles negative midi numbers (JS modulo behavior)', () => {
        expect(isBlackKey(-1)).toBe(false) // -1 % 12 = -1 → not in set
        expect(isBlackKey(-11)).toBe(false)
    })
})
