import {
    CHORD_TEMPLATES,
    buildChordPitchClasses,
    getPitchClassName,
    ChordAnalysisDebugData,
    ChordCandidateDebugItem,
    ChordScoreBreakdown,
    DetectedChordInfo,
    ChordAlternativeInfo,
} from '@shared/lib'
import {
    calculateChordScore,
    createChordSymbol,
    normalizeActiveNotes,
} from '@service/lib'
import {
    classifyAlternativeRelation,
    evaluateChordAmbiguity,
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
            alternatives: [],
            ambiguity: null,
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
            alternatives: [],
            ambiguity: null,
        }
    }

    candidates.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score
        }

        return b.priority - a.priority
    })

    const best = candidates[0]

    const confidenceBase = best.score / (best.score + 60)
    const rawConfidence = confidenceBase * best.breakdown.incompleteConfidenceFactor

    const selected: DetectedChordInfo = {
        root: getPitchClassName(best.rootPitchClass),
        type: best.type,
        symbol: best.symbol,
        confidence: null,
        bass: best.isSlashChord && best.bassPitchClass !== null
            ? getPitchClassName(best.bassPitchClass)
            : null,
        isSlashChord: best.isSlashChord,
        isOmissionLabel: best.symbol.includes('(no3)') || best.symbol.includes('(no5)'),
        omissionType: best.symbol.includes('(no3)')
            ? 'no3'
            : best.symbol.includes('(no5)')
                ? 'no5'
                : null,
    }

    const alternatives: ChordAlternativeInfo[] = candidates
        .slice(1, 8)
        .map((candidate) => {
            const candidateConfidenceBase = candidate.score / (candidate.score + 60)
            const candidateConfidence = Math.max(
                0,
                Math.min(1, candidateConfidenceBase * candidate.breakdown.incompleteConfidenceFactor),
            )

            const alternativeBass = candidate.isSlashChord && candidate.bassPitchClass !== null
                ? getPitchClassName(candidate.bassPitchClass)
                : null

            return {
                symbol: candidate.symbol,
                type: candidate.type,
                root: getPitchClassName(candidate.rootPitchClass),
                bass: alternativeBass,
                isSlashChord: candidate.isSlashChord,
                score: candidate.score,
                confidence: candidateConfidence,
                relationToSelected: classifyAlternativeRelation({
                    selectedSymbol: selected.symbol,
                    selectedType: selected.type,
                    selectedRoot: selected.root,
                    selectedBass: selected.bass,
                    selectedIsSlashChord: selected.isSlashChord,
                    alternativeSymbol: candidate.symbol,
                    alternativeType: candidate.type,
                    alternativeRoot: getPitchClassName(candidate.rootPitchClass),
                    alternativeBass,
                    alternativeIsSlashChord: candidate.isSlashChord,
                }),
            }
        })

    const ambiguity = evaluateChordAmbiguity({
        selected,
        selectedScore: best.score,
        alternatives,
    })

    let confidence = rawConfidence

    if (ambiguity?.isAmbiguous) {
        if (ambiguity.level === 'high') {
            confidence *= 0.78
        } else if (ambiguity.level === 'medium') {
            confidence *= 0.88
        } else {
            confidence *= 0.94
        }
    }

    selected.confidence = Math.max(0, Math.min(1, confidence))

    return {
        inputMidiNotes: normalized.midiNotes,
        inputPitchClasses: normalized.pitchClasses,
        bassMidiNote: normalized.bassMidiNote,
        bassPitchClass: normalized.bassPitchClass,
        candidates: debugCandidates.slice(0, 20),
        selected,
        alternatives,
        ambiguity,
    }
}
