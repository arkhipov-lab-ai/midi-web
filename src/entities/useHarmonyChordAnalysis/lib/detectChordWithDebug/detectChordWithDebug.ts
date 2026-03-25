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

    const confidenceBase = best.score / Math.max(1, normalized.pitchClasses.length * 24 + 48)
    const missingThirdPenaltyFactor = best.breakdown.missingThirdPenalty > 0 ? 0.55 : 1
    const incompleteFactor = best.breakdown.incompleteVoicingBonus > 0 ? 0.9 : 1

    const confidence = Math.max(
        0,
        Math.min(1, confidenceBase * missingThirdPenaltyFactor * incompleteFactor),
    )

    const selected: DetectedChordInfo = {
        root: getPitchClassName(best.rootPitchClass),
        type: best.type,
        symbol: best.symbol,
        confidence,
        bass: best.isSlashChord && best.bassPitchClass !== null
            ? getPitchClassName(best.bassPitchClass)
            : null,
        isSlashChord: best.isSlashChord,
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
