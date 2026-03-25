import {calculateChordScore} from '../calculateChordScore'

describe('calculateChordScore', () => {
    it('penalizes non-slash secondary roots without bass ownership', () => {
        const primary = calculateChordScore({
            inputPitchClasses: [0, 2, 4, 7, 10],
            templatePitchClasses: [0, 2, 4, 7, 10],
            requiredPitchClasses: [0, 4, 10],
            optionalPitchClasses: [2, 7],
            omittablePitchClasses: [7],
            signaturePitchClasses: [2],
            bassPitchClass: 0,
            rootPitchClass: 0,
            templatePriority: 24,
            category: 'extended',
            requiresSeventh: true,
            isSlashChord: false,
            templateIntervalCount: 5,
        })

        const secondary = calculateChordScore({
            inputPitchClasses: [0, 2, 4, 7, 10],
            templatePitchClasses: [4, 7, 10, 2],
            requiredPitchClasses: [4, 7, 10, 2],
            optionalPitchClasses: [],
            omittablePitchClasses: [],
            signaturePitchClasses: [10, 2],
            bassPitchClass: 0,
            rootPitchClass: 4,
            templatePriority: 21,
            category: 'seventh',
            requiresSeventh: false,
            isSlashChord: false,
            templateIntervalCount: 4,
        })

        expect(primary.finalScore).toBeGreaterThan(secondary.finalScore)
        expect(secondary.secondaryRootPenalty).toBeGreaterThan(0)
    })

    it('gives simplicity bonus to strong plain explanations', () => {
        const plain = calculateChordScore({
            inputPitchClasses: [2, 6, 9],
            templatePitchClasses: [2, 6, 9],
            requiredPitchClasses: [2, 6, 9],
            optionalPitchClasses: [],
            omittablePitchClasses: [],
            signaturePitchClasses: [],
            bassPitchClass: 2,
            rootPitchClass: 2,
            templatePriority: 10,
            category: 'triad',
            requiresSeventh: false,
            isSlashChord: false,
            templateIntervalCount: 3,
        })

        const decorated = calculateChordScore({
            inputPitchClasses: [2, 6, 9],
            templatePitchClasses: [2, 6, 9, 11],
            requiredPitchClasses: [2, 6, 9],
            optionalPitchClasses: [11],
            omittablePitchClasses: [],
            signaturePitchClasses: [11],
            bassPitchClass: 2,
            rootPitchClass: 2,
            templatePriority: 16,
            category: 'triad',
            requiresSeventh: false,
            isSlashChord: false,
            templateIntervalCount: 4,
        })

        expect(plain.simplicityBonus).toBeGreaterThanOrEqual(decorated.simplicityBonus)
        expect(plain.finalScore).toBeGreaterThan(decorated.finalScore)
    })

    it('rewards fuller same-root coverage for richer explanations', () => {
        const richer = calculateChordScore({
            inputPitchClasses: [0, 2, 4, 7, 10, 9],
            templatePitchClasses: [0, 2, 4, 7, 9, 10],
            requiredPitchClasses: [0, 4, 10],
            optionalPitchClasses: [2, 7, 9],
            omittablePitchClasses: [7],
            signaturePitchClasses: [9],
            bassPitchClass: 0,
            rootPitchClass: 0,
            templatePriority: 30,
            category: 'extended',
            requiresSeventh: true,
            isSlashChord: false,
            templateIntervalCount: 6,
        })

        const simpler = calculateChordScore({
            inputPitchClasses: [0, 2, 4, 7, 10, 9],
            templatePitchClasses: [0, 2, 4, 7, 10],
            requiredPitchClasses: [0, 4, 10],
            optionalPitchClasses: [2, 7],
            omittablePitchClasses: [7],
            signaturePitchClasses: [2],
            bassPitchClass: 0,
            rootPitchClass: 0,
            templatePriority: 24,
            category: 'extended',
            requiresSeventh: true,
            isSlashChord: false,
            templateIntervalCount: 5,
        })

        expect(richer.finalScore).toBeGreaterThan(simpler.finalScore)
        expect(richer.inputCoverageBonus).toBeGreaterThanOrEqual(simpler.inputCoverageBonus)
        expect(simpler.underExplainingPenalty).toBeGreaterThan(0)
    })

    it('penalizes under-explaining candidates on dense inputs', () => {
        const denseSubset = calculateChordScore({
            inputPitchClasses: [0, 2, 4, 5, 7, 10],
            templatePitchClasses: [0, 4, 7],
            requiredPitchClasses: [0, 4, 7],
            optionalPitchClasses: [],
            omittablePitchClasses: [],
            signaturePitchClasses: [],
            bassPitchClass: 0,
            rootPitchClass: 0,
            templatePriority: 10,
            category: 'triad',
            requiresSeventh: false,
            isSlashChord: false,
            templateIntervalCount: 3,
        })

        expect(denseSubset.underExplainingPenalty).toBeGreaterThan(0)
    })

    it('penalizes quality-dependent chords when third is missing', () => {
        const majorWithoutThird = calculateChordScore({
            inputPitchClasses: [0, 7],
            templatePitchClasses: [0, 4, 7],
            requiredPitchClasses: [0, 4, 7],
            optionalPitchClasses: [],
            omittablePitchClasses: [],
            signaturePitchClasses: [],
            bassPitchClass: 0,
            rootPitchClass: 0,
            templatePriority: 10,
            category: 'triad',
            requiresSeventh: false,
            isSlashChord: false,
            templateIntervalCount: 3,
            qualityDependsOnThird: true,
            isIncompleteVoicingTemplate: false,
        })

        const powerChord = calculateChordScore({
            inputPitchClasses: [0, 7],
            templatePitchClasses: [0, 7],
            requiredPitchClasses: [0, 7],
            optionalPitchClasses: [],
            omittablePitchClasses: [],
            signaturePitchClasses: [],
            bassPitchClass: 0,
            rootPitchClass: 0,
            templatePriority: 11,
            category: 'triad',
            requiresSeventh: false,
            isSlashChord: false,
            templateIntervalCount: 2,
            qualityDependsOnThird: false,
            isIncompleteVoicingTemplate: true,
        })

        expect(majorWithoutThird.missingThirdPenalty).toBeGreaterThan(0)
        expect(powerChord.incompleteVoicingBonus).toBeGreaterThan(0)
        expect(powerChord.finalScore).toBeGreaterThan(majorWithoutThird.finalScore)
    })

    it('rewards omission-aware shell voicings over plain power interpretation when seventh identity is present', () => {
        const dominantNo3 = calculateChordScore({
            inputPitchClasses: [0, 7, 10],
            templatePitchClasses: [0, 7, 10],
            requiredPitchClasses: [0, 7, 10],
            optionalPitchClasses: [],
            omittablePitchClasses: [],
            signaturePitchClasses: [10],
            bassPitchClass: 0,
            rootPitchClass: 0,
            templatePriority: 20,
            category: 'seventh',
            requiresSeventh: true,
            isSlashChord: false,
            templateIntervalCount: 3,
            qualityDependsOnThird: false,
            isIncompleteVoicingTemplate: true,
            omissionLabelMode: 'no3',
        })

        const power = calculateChordScore({
            inputPitchClasses: [0, 7, 10],
            templatePitchClasses: [0, 7],
            requiredPitchClasses: [0, 7],
            optionalPitchClasses: [],
            omittablePitchClasses: [],
            signaturePitchClasses: [],
            bassPitchClass: 0,
            rootPitchClass: 0,
            templatePriority: 11,
            category: 'triad',
            requiresSeventh: false,
            isSlashChord: false,
            templateIntervalCount: 2,
            qualityDependsOnThird: false,
            isIncompleteVoicingTemplate: true,
            omissionLabelMode: 'none',
        })

        expect(dominantNo3.omissionBonus).toBeGreaterThan(0)
        expect(dominantNo3.finalScore).toBeGreaterThan(power.finalScore)
    })

    it('penalizes power chord when third is present', () => {
        const power = calculateChordScore({
            type: 'power',
            inputPitchClasses: [0, 4, 7],
            templatePitchClasses: [0, 7],
            requiredPitchClasses: [0, 7],
            optionalPitchClasses: [],
            omittablePitchClasses: [],
            signaturePitchClasses: [],
            bassPitchClass: 0,
            rootPitchClass: 0,
            templatePriority: 11,
            category: 'triad',
            requiresSeventh: false,
            isSlashChord: false,
            templateIntervalCount: 2,
            qualityDependsOnThird: false,
            isIncompleteVoicingTemplate: true,
            omissionLabelMode: 'none',
        })

        expect(power.powerChordPenalty).toBeGreaterThan(0)
    })

    it('rewards exact omission shell matches', () => {
        const shell = calculateChordScore({
            type: 'dominant7No3',
            inputPitchClasses: [0, 7, 10],
            templatePitchClasses: [0, 7, 10],
            requiredPitchClasses: [0, 7, 10],
            optionalPitchClasses: [],
            omittablePitchClasses: [],
            signaturePitchClasses: [10],
            bassPitchClass: 0,
            rootPitchClass: 0,
            templatePriority: 20,
            category: 'seventh',
            requiresSeventh: true,
            isSlashChord: false,
            templateIntervalCount: 3,
            qualityDependsOnThird: false,
            isIncompleteVoicingTemplate: true,
            omissionLabelMode: 'no3',
        })

        expect(shell.exactOmissionShellBonus).toBeGreaterThan(0)
        expect(shell.incompleteConfidenceFactor).toBeLessThan(1)
    })
})
