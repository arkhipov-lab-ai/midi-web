import {getSoundingNotes} from '../getSoundingNotes'

describe('getSoundingNotes', () => {
    it('returns empty object when both maps are empty', () => {
        const state = {
            pressedNotes: {},
            sustainedNotes: {},
            sustainPressed: false,
        }

        const result = getSoundingNotes(state)

        expect(result).toEqual({})
    })

    it('returns only pressedNotes when sustainedNotes is empty', () => {
        const state = {
            pressedNotes: {60: 100, 64: 90},
            sustainedNotes: {},
            sustainPressed: false,
        }

        const result = getSoundingNotes(state)

        expect(result).toEqual({60: 100, 64: 90})
    })

    it('returns only sustainedNotes when pressedNotes is empty', () => {
        const state = {
            pressedNotes: {},
            sustainedNotes: {60: 80, 67: 70},
            sustainPressed: true,
        }

        const result = getSoundingNotes(state)

        expect(result).toEqual({60: 80, 67: 70})
    })

    it('merges sustainedNotes and pressedNotes', () => {
        const state = {
            pressedNotes: {64: 90, 67: 100},
            sustainedNotes: {60: 80, 62: 70},
            sustainPressed: true,
        }

        const result = getSoundingNotes(state)

        expect(result).toEqual({
            60: 80,
            62: 70,
            64: 90,
            67: 100,
        })
    })

    it('pressedNotes override sustainedNotes for same midi key', () => {
        const state = {
            pressedNotes: {60: 120},
            sustainedNotes: {60: 80, 64: 90},
            sustainPressed: true,
        }

        const result = getSoundingNotes(state)

        expect(result).toEqual({
            60: 120,
            64: 90,
        })
    })

    it('returns new object reference', () => {
        const state = {
            pressedNotes: {60: 100},
            sustainedNotes: {64: 90},
            sustainPressed: false,
        }

        const result = getSoundingNotes(state)

        expect(result).not.toBe(state.pressedNotes)
        expect(result).not.toBe(state.sustainedNotes)
    })

    it('does not mutate original state', () => {
        const state = {
            pressedNotes: {60: 100},
            sustainedNotes: {64: 90},
            sustainPressed: false,
        }

        getSoundingNotes(state)

        expect(state).toEqual({
            pressedNotes: {60: 100},
            sustainedNotes: {64: 90},
            sustainPressed: false,
        })
    })
})
