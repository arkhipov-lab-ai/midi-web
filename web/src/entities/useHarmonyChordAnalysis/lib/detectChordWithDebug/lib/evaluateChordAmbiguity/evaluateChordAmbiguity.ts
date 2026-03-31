import {
    ChordAmbiguityInfo,
    ChordAlternativeInfo,
    DetectedChordInfo,
} from '@shared/lib'

interface EvaluateChordAmbiguityOptions {
    selected: DetectedChordInfo
    selectedScore: number
    alternatives: ChordAlternativeInfo[]
}

export function evaluateChordAmbiguity(options: EvaluateChordAmbiguityOptions): ChordAmbiguityInfo | null {
    const {
        selected,
        selectedScore,
        alternatives,
    } = options

    if (alternatives.length === 0) {
        return {
            isAmbiguous: false,
            level: 'low',
            reason: null,
            primaryAlternatives: [],
        }
    }

    const primary = alternatives.slice(0, 3)
    const closest = primary[0]
    const gap = selectedScore - closest.score
    const relativeStrength = selectedScore > 0
        ? closest.score / selectedScore
        : 0

    const hasEquivalentPrimary = primary.some((item) =>
        item.relationToSelected === 'equivalent-quality'
        || item.relationToSelected === 'enharmonic-reinterpretation'
    )

    const hasSlashReinterpretationPrimary = primary.some((item) =>
        item.relationToSelected === 'inversion-or-slash'
    )

    const isIncompleteCase =
        selected.type === 'power'
        || selected.isOmissionLabel === true

    if (hasEquivalentPrimary && gap <= 24) {
        return {
            isAmbiguous: true,
            level: gap <= 10 ? 'high' : 'medium',
            reason: 'equivalent_spelling',
            primaryAlternatives: primary.map((item) => item.symbol),
        }
    }

    if (hasSlashReinterpretationPrimary && relativeStrength >= 0.74) {
        return {
            isAmbiguous: true,
            level: relativeStrength >= 0.85 ? 'high' : 'medium',
            reason: 'context_dependent_naming',
            primaryAlternatives: primary.map((item) => item.symbol),
        }
    }

    if (gap <= 12) {
        return {
            isAmbiguous: true,
            level: 'high',
            reason: 'close_scores',
            primaryAlternatives: primary.map((item) => item.symbol),
        }
    }

    if (gap <= 24) {
        return {
            isAmbiguous: true,
            level: isIncompleteCase ? 'medium' : 'low',
            reason: isIncompleteCase ? 'incomplete_voicing' : 'multiple_valid_structures',
            primaryAlternatives: primary.map((item) => item.symbol),
        }
    }

    if (isIncompleteCase) {
        return {
            isAmbiguous: true,
            level: 'low',
            reason: 'incomplete_voicing',
            primaryAlternatives: primary.map((item) => item.symbol),
        }
    }

    return {
        isAmbiguous: false,
        level: 'low',
        reason: null,
        primaryAlternatives: [],
    }
}
