import {removeNote} from '../removeNote'

describe('removeNote', () => {
    it('removes existing note from map', () => {
        const notes = {
            60: 100,
            64: 90,
            67: 80,
        }

        const result = removeNote(notes, 64)

        expect(result).toEqual({
            60: 100,
            67: 80,
        })
    })

    it('returns new object reference', () => {
        const notes = {
            60: 100,
            64: 90,
        }

        const result = removeNote(notes, 64)

        expect(result).not.toBe(notes)
    })

    it('does not mutate original map', () => {
        const notes = {
            60: 100,
            64: 90,
        }

        removeNote(notes, 64)

        expect(notes).toEqual({
            60: 100,
            64: 90,
        })
    })

    it('returns same content when note does not exist', () => {
        const notes = {
            60: 100,
            64: 90,
        }

        const result = removeNote(notes, 67)

        expect(result).toEqual({
            60: 100,
            64: 90,
        })
    })

    it('returns empty object when removing the only note', () => {
        const notes = {
            60: 100,
        }

        const result = removeNote(notes, 60)

        expect(result).toEqual({})
    })

    it('returns empty object when source map is empty', () => {
        const result = removeNote({}, 60)

        expect(result).toEqual({})
    })
})
