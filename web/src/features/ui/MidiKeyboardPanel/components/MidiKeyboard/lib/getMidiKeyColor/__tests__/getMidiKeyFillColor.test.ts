import {getMidiKeyFillColor} from '../getMidiKeyColor'

describe('getMidiKeyFillColor', () => {
    it('returns default white key color when velocity is undefined', () => {
        expect(getMidiKeyFillColor('white')).toBe('rgb(255, 255, 255)')
    })

    it('returns default black key color when velocity is undefined', () => {
        expect(getMidiKeyFillColor('black')).toBe('rgb(0, 0, 0)')
    })

    it('returns default color when velocity is 0 or negative', () => {
        expect(getMidiKeyFillColor('white', 0)).toBe('rgb(255, 255, 255)')
        expect(getMidiKeyFillColor('white', -10)).toBe('rgb(255, 255, 255)')
        expect(getMidiKeyFillColor('black', 0)).toBe('rgb(0, 0, 0)')
        expect(getMidiKeyFillColor('black', -10)).toBe('rgb(0, 0, 0)')
    })

    it('calculates white key color for positive velocity', () => {
        expect(getMidiKeyFillColor('white', 127)).toBe('rgb(128, 128, 128)')
        expect(getMidiKeyFillColor('white', 64)).toBe('rgb(191, 191, 191)')
        expect(getMidiKeyFillColor('white', 1)).toBe('rgb(254, 254, 254)')
    })

    it('calculates black key color for positive velocity', () => {
        expect(getMidiKeyFillColor('black', 127)).toBe('rgb(128, 128, 128)')
        expect(getMidiKeyFillColor('black', 64)).toBe('rgb(65, 65, 65)')
        expect(getMidiKeyFillColor('black', 1)).toBe('rgb(1, 1, 1)')
    })

    it('clamps velocity above 127', () => {
        expect(getMidiKeyFillColor('white', 200)).toBe('rgb(128, 128, 128)')
        expect(getMidiKeyFillColor('black', 200)).toBe('rgb(128, 128, 128)')
    })
})
