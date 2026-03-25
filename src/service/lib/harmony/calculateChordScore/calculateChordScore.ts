import {
    ChordScoreBreakdown,
    countExtraPitchClasses,
    countMatchedOptionalPitchClasses,
    countMatchedPitchClasses,
    countMatchedRequiredPitchClasses,
    countMissingOmittablePitchClasses,
    countMissingPitchClasses,
    countMissingRequiredPitchClasses,
    evaluateChordHeuristics,
} from '@shared/lib'

interface CalculateChordScoreOptions {
    inputPitchClasses: number[]
    templatePitchClasses: number[]
    requiredPitchClasses: number[]
    optionalPitchClasses: number[]
    omittablePitchClasses: number[]
    bassPitchClass: number | null
    rootPitchClass: number
    templatePriority: number
    category: 'triad' | 'seventh' | 'extended'
    requiresSeventh: boolean
}

export function calculateChordScore(options: CalculateChordScoreOptions): ChordScoreBreakdown {

    const {
        inputPitchClasses,
        templatePitchClasses,
        requiredPitchClasses,
        optionalPitchClasses,
        omittablePitchClasses,
        bassPitchClass,
        rootPitchClass,
        templatePriority,
        category,
        requiresSeventh,
    } = options

    const matched = countMatchedPitchClasses(inputPitchClasses, templatePitchClasses)
    const missing = countMissingPitchClasses(inputPitchClasses, templatePitchClasses)
    const extra = countExtraPitchClasses(inputPitchClasses, templatePitchClasses)

    const matchedRequired = countMatchedRequiredPitchClasses(
        inputPitchClasses,
        requiredPitchClasses,
    )
    const missingRequired = countMissingRequiredPitchClasses(
        inputPitchClasses,
        requiredPitchClasses,
    )
    const matchedOptional = countMatchedOptionalPitchClasses(
        inputPitchClasses,
        optionalPitchClasses,
    )
    const missingOmittable = countMissingOmittablePitchClasses(
        inputPitchClasses,
        omittablePitchClasses,
    )

    const heuristicScore = evaluateChordHeuristics({
        inputPitchClasses,
        rootPitchClass,
        requiredPitchClasses,
        templatePitchClasses,
        bassPitchClass,
        category,
    })

    let finalScore = 0

    finalScore += matched * 12
    finalScore -= extra * 5

    finalScore += matchedRequired * 11
    finalScore -= missingRequired * 16
    finalScore += matchedOptional * 7

    const missingNonOmittable = Math.max(0, missing - missingOmittable)
    finalScore -= missingNonOmittable * 7
    finalScore -= missingOmittable * 2

    const isFullRequiredMatch = missingRequired === 0
    const optionalCoverage = optionalPitchClasses.length > 0
        ? matchedOptional / optionalPitchClasses.length
        : 0

    if (isFullRequiredMatch) {
        finalScore += 14
    }

    finalScore += templatePriority

    if (category === 'extended') {
        if (!isFullRequiredMatch) {
            finalScore -= 24
        }

        if (matchedOptional === 0) {
            finalScore -= 18
        }

        if (requiresSeventh && missingRequired > 0) {
            finalScore -= 10
        }

        finalScore += Math.round(optionalCoverage * 10)

        if (inputPitchClasses.length < requiredPitchClasses.length + 1) {
            finalScore -= 16
        }
    }

    if (category === 'seventh' && missingRequired > 0) {
        finalScore -= 8
    }

    finalScore += heuristicScore

    if (inputPitchClasses.length > templatePitchClasses.length + 2) {
        finalScore -= 4
    }

    return {
        matched,
        missing,
        extra,
        matchedRequired,
        missingRequired,
        matchedOptional,
        missingOmittable,
        heuristicScore,
        finalScore,
    }
}
