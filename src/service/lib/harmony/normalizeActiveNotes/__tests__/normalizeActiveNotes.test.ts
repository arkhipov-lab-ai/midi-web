import {normalizeActiveNotes} from '../normalizeActiveNotes'

describe('normalizeActiveNotes', () => {
    it('returns normalized active note data', () => {
        const result = normalizeActiveNotes({
            64: 90,
            60: 100,
            67: 80,
        })

        expect(result.midiNotes).toEqual([60, 64, 67])
        expect(result.pitchClasses).toEqual([0, 4, 7])
        expect(result.bassMidiNote).toBe(60)
        expect(result.bassPitchClass).toBe(0)
    })

    it('returns empty structure for empty active notes', () => {
        const result = normalizeActiveNotes({})

        expect(result.midiNotes).toEqual([])
        expect(result.pitchClasses).toEqual([])
        expect(result.bassMidiNote).toBeNull()
        expect(result.bassPitchClass).toBeNull()
    })
})
