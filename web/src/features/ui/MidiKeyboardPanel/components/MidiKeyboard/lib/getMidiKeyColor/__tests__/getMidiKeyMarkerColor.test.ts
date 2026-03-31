import {getMidiKeyMarkerColor} from '../getMidiKeyColor'

describe('getMidiKeyMarkerColor', () => {
    it('returns black color for white keys', () => {
        expect(getMidiKeyMarkerColor('white')).toBe('#000000')
    })

    it('returns white color for black keys', () => {
        expect(getMidiKeyMarkerColor('black')).toBe('#ffffff')
    })

    it('returns correct values consistently', () => {
        expect(getMidiKeyMarkerColor('white')).not.toBe('#ffffff')
        expect(getMidiKeyMarkerColor('black')).not.toBe('#000000')
    })
})
