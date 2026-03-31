import {detectChordWithDebug} from '../detectChordWithDebug'

describe('detectChordWithDebug', () => {
    it('detects Dsus2', () => {
        const result = detectChordWithDebug({
            62: 100,
            64: 100,
            69: 100,
        })

        expect(result.selected?.symbol).toBe('Dsus2')
    })

    it('detects Dsus4', () => {
        const result = detectChordWithDebug({
            62: 100,
            67: 100,
            69: 100,
        })

        expect(result.selected?.symbol).toBe('Dsus4')
    })

    it('detects C9 without false slash output', () => {
        const result = detectChordWithDebug({
            60: 100,
            64: 100,
            70: 100,
            62: 100,
        })

        expect(result.selected?.symbol).toBe('C9')
    })

    it('detects C6/9', () => {
        const result = detectChordWithDebug({
            60: 100,
            62: 100,
            64: 100,
            67: 100,
            69: 100,
        })

        expect(result.selected?.symbol).toBe('C6/9')
    })

    it('prefers plain major over decorated variants when no signature tones are present', () => {
        const result = detectChordWithDebug({
            38: 100,
            42: 100,
            45: 100,
        })

        expect(result.selected?.symbol).toBe('D')
        expect(result.candidates[0].symbol).toBe('D')
    })

    it('prefers sus2 over add9 when third is absent', () => {
        const result = detectChordWithDebug({
            50: 100,
            52: 100,
            57: 100,
        })

        expect(result.selected?.symbol).toBe('Dsus2')
        expect(result.candidates[0].symbol).toBe('Dsus2')
    })

    it('keeps C9 above C11 and C13 when 11 and 13 are absent', () => {
        const result = detectChordWithDebug({
            48: 100,
            52: 100,
            55: 100,
            58: 100,
            62: 100,
        })

        expect(result.selected?.symbol).toBe('C9')
        expect(result.candidates[0].symbol).toBe('C9')
        expect(result.candidates[1].symbol).not.toBe('C9')
    })

    it('keeps direct D above slash reinterpretations', () => {
        const result = detectChordWithDebug({
            38: 100,
            42: 100,
            45: 100,
        })

        expect(result.selected?.symbol).toBe('D')
        expect(result.candidates[0].symbol).toBe('D')
        expect(result.candidates[1].symbol).not.toBe('Bm7/D')
    })

    it('keeps C9 above alternative slash or re-rooted readings', () => {
        const result = detectChordWithDebug({
            36: 100,
            40: 100,
            43: 100,
            46: 100,
            50: 100,
        })

        expect(result.selected?.symbol).toBe('C9')

        const topFiveSymbols = result.candidates.slice(0, 5).map((candidate) => candidate.symbol)

        expect(topFiveSymbols[0]).toBe('C9')
        expect(topFiveSymbols).not.toContain('A#6/9/C')
    })

    it('keeps C13 above slash alternatives', () => {
        const result = detectChordWithDebug({
            36: 100,
            40: 100,
            43: 100,
            46: 100,
            50: 100,
            57: 100,
        })

        expect(result.selected?.symbol).toBe('C13')
        expect(result.candidates[0].symbol).toBe('C13')
    })

    it('keeps C9 above Em7b5 style reinterpretations', () => {
        const result = detectChordWithDebug({
            36: 100,
            40: 100,
            43: 100,
            46: 100,
            50: 100,
        })

        expect(result.selected?.symbol).toBe('C9')

        const em7b5Candidate = result.candidates.find((candidate) => candidate.symbol === 'Em7b5')

        expect(em7b5Candidate).toBeDefined()
        expect(result.candidates[0].symbol).toBe('C9')
        expect((em7b5Candidate?.score ?? 0)).toBeLessThan(result.candidates[0].score)
    })

    it('keeps C11 above alternative-root candidates', () => {
        const result = detectChordWithDebug({
            36: 100,
            40: 100,
            43: 100,
            46: 100,
            50: 100,
            53: 100,
        })

        expect(result.selected?.symbol).toBe('C11')
        expect(result.candidates[0].symbol).toBe('C11')
    })

    it('keeps C13 above alternative-root candidates', () => {
        const result = detectChordWithDebug({
            36: 100,
            40: 100,
            43: 100,
            46: 100,
            50: 100,
            57: 100,
        })

        expect(result.selected?.symbol).toBe('C13')
        expect(result.candidates[0].symbol).toBe('C13')
    })

    it('keeps C11 above same-root simpler explanations', () => {
        const result = detectChordWithDebug({
            36: 100,
            40: 100,
            43: 100,
            46: 100,
            50: 100,
            53: 100,
        })

        expect(result.selected?.symbol).toBe('C11')

        const c11Score = result.candidates.find((candidate) => candidate.symbol === 'C11')?.score ?? 0
        const c9Score = result.candidates.find((candidate) => candidate.symbol === 'C9')?.score ?? 0
        const c7Score = result.candidates.find((candidate) => candidate.symbol === 'C7')?.score ?? 0

        expect(c11Score).toBeGreaterThan(c9Score)
        expect(c11Score).toBeGreaterThan(c7Score)
    })

    it('keeps C13 above same-root simpler explanations', () => {
        const result = detectChordWithDebug({
            36: 100,
            40: 100,
            43: 100,
            46: 100,
            50: 100,
            57: 100,
        })

        expect(result.selected?.symbol).toBe('C13')

        const c13Score = result.candidates.find((candidate) => candidate.symbol === 'C13')?.score ?? 0
        const c9Score = result.candidates.find((candidate) => candidate.symbol === 'C9')?.score ?? 0
        const c6_9Score = result.candidates.find((candidate) => candidate.symbol === 'C6/9')?.score ?? 0

        expect(c13Score).toBeGreaterThan(c9Score)
        expect(c13Score).toBeGreaterThan(c6_9Score)
    })

    it('keeps C9 above same-root subset explanations', () => {
        const result = detectChordWithDebug({
            36: 100,
            40: 100,
            43: 100,
            46: 100,
            50: 100,
        })

        expect(result.selected?.symbol).toBe('C9')

        const c9Score = result.candidates.find((candidate) => candidate.symbol === 'C9')?.score ?? 0
        const c7Score = result.candidates.find((candidate) => candidate.symbol === 'C7')?.score ?? 0
        const cAdd9Score = result.candidates.find((candidate) => candidate.symbol === 'Cadd9')?.score ?? 0

        expect(c9Score).toBeGreaterThan(c7Score)
        expect(c9Score).toBeGreaterThan(cAdd9Score)
    })

    it('detects power chord instead of major when third is missing', () => {
        const result = detectChordWithDebug({
            36: 100,
            43: 100,
            48: 100,
        })

        expect(result.selected?.symbol).toBe('C5')
    })

    it('detects D5 for root and fifth only', () => {
        const result = detectChordWithDebug({
            38: 100,
            45: 100,
        })

        expect(result.selected?.symbol).toBe('D5')
    })

    it('keeps major chord when third is present', () => {
        const result = detectChordWithDebug({
            36: 100,
            40: 100,
            43: 100,
        })

        expect(result.selected?.symbol).toBe('C')
    })

    it('keeps minor chord when minor third is present', () => {
        const result = detectChordWithDebug({
            36: 100,
            39: 100,
            43: 100,
        })

        expect(result.selected?.symbol).toBe('Cm')
    })

    it('detects C7(no3) from root fifth and minor seventh', () => {
        const result = detectChordWithDebug({
            36: 100,
            43: 100,
            46: 100,
        })

        expect(result.selected?.symbol).toBe('C7(no3)')
    })

    it('detects Cmaj7(no3) from root fifth and major seventh', () => {
        const result = detectChordWithDebug({
            36: 100,
            43: 100,
            47: 100,
        })

        expect(result.selected?.symbol).toBe('Cmaj7(no3)')
    })

    it('detects C7(no5) from root third and minor seventh', () => {
        const result = detectChordWithDebug({
            36: 100,
            40: 100,
            46: 100,
        })

        expect(result.selected?.symbol).toBe('C7(no5)')
    })

    it('detects Cm7(no5) from root minor third and minor seventh', () => {
        const result = detectChordWithDebug({
            36: 100,
            39: 100,
            46: 100,
        })

        expect(result.selected?.symbol).toBe('Cm7(no5)')
    })

    it('detects Cmaj7(no5) from root third and major seventh', () => {
        const result = detectChordWithDebug({
            36: 100,
            40: 100,
            47: 100,
        })

        expect(result.selected?.symbol).toBe('Cmaj7(no5)')
    })

    it('keeps C below full triad when third is present and power chord is only partial', () => {
        const result = detectChordWithDebug({
            36: 100,
            40: 100,
            43: 100,
        })

        expect(result.selected?.symbol).toBe('C')

        const cScore = result.candidates.find((candidate) => candidate.symbol === 'C')?.score ?? 0
        const c5Score = result.candidates.find((candidate) => candidate.symbol === 'C5')?.score ?? 0

        expect(cScore).toBeGreaterThan(c5Score)
    })

    it('keeps Dsus2 above D5 when sus voicing is present', () => {
        const result = detectChordWithDebug({
            38: 100,
            40: 100,
            45: 100,
        })

        expect(result.selected?.symbol).toBe('Dsus2')

        const susScore = result.candidates.find((candidate) => candidate.symbol === 'Dsus2')?.score ?? 0
        const powerScore = result.candidates.find((candidate) => candidate.symbol === 'D5')?.score ?? 0

        expect(susScore).toBeGreaterThan(powerScore)
    })

    it('reduces confidence for power chord labels', () => {
        const result = detectChordWithDebug({
            36: 100,
            43: 100,
        })

        expect(result.selected?.symbol).toBe('C5')
        expect(result.selected?.confidence ?? 1).toBeLessThan(1)
    })

    it('reduces confidence for omission labels', () => {
        const result = detectChordWithDebug({
            36: 100,
            43: 100,
            46: 100,
        })

        expect(result.selected?.symbol).toBe('C7(no3)')
        expect(result.selected?.confidence ?? 1).toBeLessThan(1)
    })

    it('exposes slash reinterpretation as alternative for Dsus4', () => {
        const result = detectChordWithDebug({
            38: 100,
            43: 100,
            45: 100,
        })

        expect(result.selected?.symbol).toBe('Dsus4')
        expect(result.alternatives.length).toBeGreaterThan(0)

        const alt = result.alternatives.find((item) => item.symbol === 'Gsus2/D')

        expect(alt).toBeDefined()
        expect(alt?.relationToSelected).toBe('inversion-or-slash')
    })

    it('marks Dsus4 as ambiguous because of slash reinterpretation', () => {
        const result = detectChordWithDebug({
            38: 100,
            43: 100,
            45: 100,
        })

        expect(result.selected?.symbol).toBe('Dsus4')
        expect(result.ambiguity?.isAmbiguous).toBe(true)
    })

    it('marks Dsus2 as ambiguous because of slash reinterpretation', () => {
        const result = detectChordWithDebug({
            38: 100,
            40: 100,
            45: 100,
        })

        expect(result.selected?.symbol).toBe('Dsus2')
        expect(result.ambiguity?.isAmbiguous).toBe(true)
        expect(result.ambiguity?.reason).toBe('context_dependent_naming')
    })

    it('marks omission labels as ambiguous', () => {
        const result = detectChordWithDebug({
            36: 100,
            43: 100,
            46: 100,
        })

        expect(result.selected?.symbol).toBe('C7(no3)')
        expect(result.ambiguity?.isAmbiguous).toBe(true)
        expect(result.ambiguity?.reason).toBe('incomplete_voicing')
    })

    it('does not mark plain major triad as ambiguous when competitors are distant', () => {
        const result = detectChordWithDebug({
            36: 100,
            40: 100,
            43: 100,
        })

        expect(result.selected?.symbol).toBe('C')
        expect(result.ambiguity?.isAmbiguous).toBe(false)
    })

    it('keeps confidence below 1 for ambiguous slash-equivalent sus chord', () => {
        const result = detectChordWithDebug({
            38: 100,
            43: 100,
            45: 100,
        })

        expect(result.selected?.symbol).toBe('Dsus4')
        expect(result.selected?.confidence ?? 1).toBeLessThan(1)
    })
})
