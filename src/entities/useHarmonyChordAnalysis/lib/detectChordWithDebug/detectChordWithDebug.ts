import {
    CHORD_TEMPLATES,
    buildChordPitchClasses,
    getPitchClassName,
    ChordAnalysisDebugData,
    ChordCandidateDebugItem,
    ChordScoreBreakdown,
    DetectedChordInfo,
} from '@shared/lib'
import {
    calculateChordScore,
    createChordSymbol,
    normalizeActiveNotes,
} from '@service/lib'
import {
    getChordConfidence,
} from './lib'
import {ActiveNotesMap} from '@entities/useMidiPerformanceState'

interface ChordCandidateInternal {
    rootPitchClass: number
    type: string
    symbol: string
    bassPitchClass: number | null
    isSlashChord: boolean
    score: number
    priority: number
    breakdown: ChordScoreBreakdown
    isOmissionLabel: boolean
    omissionType: 'no3' | 'no5' | null
}

export function detectChordWithDebug(activeNotes: ActiveNotesMap): ChordAnalysisDebugData {

    const normalized = normalizeActiveNotes(activeNotes)

    if (normalized.pitchClasses.length === 0) {
        return {
            inputMidiNotes: [],
            inputPitchClasses: [],
            bassMidiNote: null,
            bassPitchClass: null,
            candidates: [],
            selected: null,
        }
    }

    const candidates: ChordCandidateInternal[] = []
    const debugCandidates: ChordCandidateDebugItem[] = []

    for (let rootPitchClass = 0; rootPitchClass < 12; rootPitchClass += 1) {
        for (const template of CHORD_TEMPLATES) {
            const templatePitchClasses = buildChordPitchClasses(rootPitchClass, template.intervals)
            const requiredIntervals = template.requiredIntervals ?? template.intervals
            const optionalIntervals = template.optionalIntervals ?? []
            const omittableIntervals = template.omittableIntervals ?? []
            const signatureIntervals = template.signatureIntervals ?? []

            const requiredPitchClasses = buildChordPitchClasses(rootPitchClass, requiredIntervals)
            const optionalPitchClasses = buildChordPitchClasses(rootPitchClass, optionalIntervals)
            const omittablePitchClasses = buildChordPitchClasses(rootPitchClass, omittableIntervals)
            const signaturePitchClasses = buildChordPitchClasses(rootPitchClass, signatureIntervals)

            const symbolInfo = createChordSymbol({
                rootPitchClass,
                symbolSuffix: template.symbolSuffix,
                bassPitchClass: normalized.bassPitchClass,
                templatePitchClasses,
                omissionLabelMode: template.omissionLabelMode ?? 'none',
            })

            const breakdown = calculateChordScore({
                inputPitchClasses: normalized.pitchClasses,
                templatePitchClasses,
                requiredPitchClasses,
                optionalPitchClasses,
                omittablePitchClasses,
                signaturePitchClasses,
                bassPitchClass: normalized.bassPitchClass,
                rootPitchClass,
                templatePriority: template.priority,
                category: template.category ?? 'triad',
                requiresSeventh: template.requiresSeventh ?? false,
                isSlashChord: symbolInfo.isSlashChord,
                templateIntervalCount: template.intervals.length,
                qualityDependsOnThird: template.qualityDependsOnThird ?? false,
                isIncompleteVoicingTemplate: template.isIncompleteVoicingTemplate ?? false,
                omissionLabelMode: template.omissionLabelMode ?? 'none',
                type: template.type,
            })

            const debugCandidate = {
                symbol: symbolInfo.symbol,
                type: template.type,
                root: getPitchClassName(rootPitchClass),
                bass: symbolInfo.bass,
                isSlashChord: symbolInfo.isSlashChord,
                score: breakdown.finalScore,
                priority: template.priority,
                breakdown,
            }

            debugCandidates.push(debugCandidate)

            if (breakdown.finalScore <= 0) {
                continue
            }

            candidates.push({
                rootPitchClass,
                type: template.type,
                symbol: symbolInfo.symbol,
                bassPitchClass: normalized.bassPitchClass,
                isSlashChord: symbolInfo.isSlashChord,
                score: breakdown.finalScore,
                priority: template.priority,
                breakdown,
                isOmissionLabel: symbolInfo.isOmissionLabel,
                omissionType: symbolInfo.omissionType,
            })
        }
    }

    debugCandidates.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score
        }

        return b.priority - a.priority
    })

    if (candidates.length === 0) {
        return {
            inputMidiNotes: normalized.midiNotes,
            inputPitchClasses: normalized.pitchClasses,
            bassMidiNote: normalized.bassMidiNote,
            bassPitchClass: normalized.bassPitchClass,
            candidates: debugCandidates.slice(0, 20),
            selected: null,
        }
    }

    candidates.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score
        }

        return b.priority - a.priority
    })

    const best = candidates[0]

    const secondBestScore = candidates[1]?.score ?? 0

    const confidence = getChordConfidence({
        bestScore: best.score,
        secondScore: secondBestScore,
        isSlashChord: best.isSlashChord,
        incompleteConfidenceFactor: best.breakdown.incompleteConfidenceFactor,
    })

    const selected: DetectedChordInfo = {
        root: getPitchClassName(best.rootPitchClass),
        type: best.type,
        symbol: best.symbol,
        confidence,
        bass: best.isSlashChord && best.bassPitchClass !== null
            ? getPitchClassName(best.bassPitchClass)
            : null,
        isSlashChord: best.isSlashChord,
        isOmissionLabel: best.isOmissionLabel,
        omissionType: best.omissionType,
    }

    return {
        inputMidiNotes: normalized.midiNotes,
        inputPitchClasses: normalized.pitchClasses,
        bassMidiNote: normalized.bassMidiNote,
        bassPitchClass: normalized.bassPitchClass,
        candidates: debugCandidates.slice(0, 20),
        selected,
    }
}
