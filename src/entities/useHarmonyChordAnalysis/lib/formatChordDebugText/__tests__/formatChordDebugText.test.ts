import {formatChordDebugText} from '../formatChordDebugText'

describe('formatChordDebugText', () => {
    it('formats debug text', () => {
        const text = formatChordDebugText({
            inputMidiNotes: [60, 64, 67],
            inputPitchClasses: [0, 4, 7],
            bassMidiNote: 60,
            bassPitchClass: 0,
            selected: {
                root: 'C',
                type: 'major',
                symbol: 'C',
                confidence: 0.9,
                bass: null,
                isSlashChord: false,
            },
            candidates: [],
        })

        expect(text).toContain('CHORD DEBUG')
        expect(text).toContain('symbol: C')
        expect(text).toContain('input midi notes: [60, 64, 67]')
    })

    it('includes confidence calibration metrics in debug text', () => {
        const text = formatChordDebugText({
            inputMidiNotes: [60, 67],
            inputPitchClasses: [0, 7],
            bassMidiNote: 60,
            bassPitchClass: 0,
            selected: null,
            candidates: [
                {
                    symbol: 'C5',
                    type: 'power',
                    root: 'C',
                    bass: null,
                    isSlashChord: false,
                    isOmissionLabel: false,
                    omissionType: null,
                    score: 100,
                    priority: 11,
                    breakdown: {
                        matched: 2,
                        missing: 0,
                        extra: 0,
                        matchedRequired: 2,
                        missingRequired: 0,
                        matchedOptional: 0,
                        missingOmittable: 0,
                        matchedSignature: 0,
                        missingSignature: 0,
                        heuristicScore: 20,
                        slashPenalty: 0,
                        rootOwnershipBonus: 18,
                        secondaryRootPenalty: 0,
                        simplicityBonus: 0,
                        inputCoverageBonus: 18,
                        underExplainingPenalty: 0,
                        missingThirdPenalty: 0,
                        incompleteVoicingBonus: 18,
                        omissionBonus: 0,
                        omissionPenalty: 0,
                        powerChordPenalty: 0,
                        exactOmissionShellBonus: 0,
                        incompleteConfidenceFactor: 0.62,
                        finalScore: 100,
                    },
                },
            ],
        })

        expect(text).toContain('powerChordPenalty=0')
        expect(text).toContain('exactOmissionShellBonus=0')
        expect(text).toContain('incompleteConfidenceFactor=0.62')
    })
})
