import {
    countExtraPitchClasses,
    countMatchedOptionalPitchClasses,
    countMatchedPitchClasses,
    countMatchedRequiredPitchClasses,
    countMatchedSignaturePitchClasses,
    countMissingOmittablePitchClasses,
    countMissingPitchClasses,
    countMissingRequiredPitchClasses,
    countMissingSignaturePitchClasses,
    evaluateChordHeuristics,
} from '@shared/lib'
import {
    getExactOmissionShellBonus,
    getIncompleteConfidenceFactor,
    getIncompleteVoicingBonus,
    getInputCoverageBonus,
    getMissingThirdPenalty,
    getOmissionBonus,
    getOmissionPenalty,
    getPowerChordPenalty,
    getSecondaryRootPenalty,
    getSimplicityBonus,
    getUnderExplainingPenalty,
} from './lib'

interface CalculateChordScoreOptions {
    inputPitchClasses: number[]
    templatePitchClasses: number[]
    requiredPitchClasses: number[]
    optionalPitchClasses: number[]
    omittablePitchClasses: number[]
    signaturePitchClasses: number[]
    bassPitchClass: number | null
    rootPitchClass: number
    templatePriority: number
    category: 'triad' | 'seventh' | 'extended'
    requiresSeventh: boolean
    isSlashChord: boolean
    templateIntervalCount: number
    qualityDependsOnThird: boolean
    isIncompleteVoicingTemplate: boolean
    omissionLabelMode: 'none' | 'no3' | 'no5'
    type: string
}

export function calculateChordScore(options: CalculateChordScoreOptions) {

    const {
        inputPitchClasses,
        templatePitchClasses,
        requiredPitchClasses,
        optionalPitchClasses,
        omittablePitchClasses,
        signaturePitchClasses,
        bassPitchClass,
        rootPitchClass,
        templatePriority,
        category,
        requiresSeventh,
        isSlashChord,
        templateIntervalCount,
        qualityDependsOnThird,
        isIncompleteVoicingTemplate,
        omissionLabelMode,
        type,
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
    const matchedSignature = countMatchedSignaturePitchClasses(
        inputPitchClasses,
        signaturePitchClasses,
    )
    const missingSignature = countMissingSignaturePitchClasses(
        inputPitchClasses,
        signaturePitchClasses,
    )

    const heuristicScore = evaluateChordHeuristics({
        inputPitchClasses,
        rootPitchClass,
        requiredPitchClasses,
        templatePitchClasses,
        bassPitchClass,
        category,
    })

    const missingThirdPenalty = getMissingThirdPenalty({
        inputPitchClasses,
        rootPitchClass,
        qualityDependsOnThird,
    })

    const incompleteVoicingBonus = getIncompleteVoicingBonus({
        inputPitchClasses,
        matchedRequired,
        requiredPitchClasses,
        isIncompleteVoicingTemplate,
    })

    const omissionBonus = getOmissionBonus({
        omissionLabelMode,
        matchedRequired,
        requiredPitchClasses,
        missingRequired,
        inputPitchClasses,
    })

    const omissionPenalty = getOmissionPenalty({
        omissionLabelMode,
        inputPitchClasses,
        extra,
    })

    const powerChordPenalty = getPowerChordPenalty({
        type,
        inputPitchClasses,
        rootPitchClass,
    })

    const exactOmissionShellBonus = getExactOmissionShellBonus({
        omissionLabelMode,
        inputPitchClasses,
        templatePitchClasses,
        matchedRequired,
        requiredPitchClasses,
        extra,
        missingRequired,
    })

    const incompleteConfidenceFactor = getIncompleteConfidenceFactor({
        type,
        isOmissionLabel: omissionLabelMode !== 'none',
        incompleteVoicingBonus,
        exactOmissionShellBonus,
        missingThirdPenalty,
    })

    let finalScore = 0

    finalScore += matched * 12
    finalScore -= extra * 5

    finalScore += matchedRequired * 11
    finalScore -= missingRequired * 16

    finalScore += matchedOptional * 7

    finalScore += matchedSignature * 16
    finalScore -= missingSignature * 22

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

    if (missingSignature === 0 && signaturePitchClasses.length > 0) {
        finalScore += 10
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

    let rootOwnershipBonus = 0

    if (bassPitchClass === rootPitchClass) {
        rootOwnershipBonus += 18
    } else if (inputPitchClasses.includes(rootPitchClass)) {
        rootOwnershipBonus += 6
    } else {
        rootOwnershipBonus -= 12
    }

    if (matchedRequired === requiredPitchClasses.length) {
        rootOwnershipBonus += 8
    }

    if (matchedSignature > 0 && missingSignature === 0) {
        rootOwnershipBonus += 4
    }

    let slashPenalty = 0

    if (isSlashChord) {
        slashPenalty += 18

        if (bassPitchClass !== null && bassPitchClass !== rootPitchClass) {
            slashPenalty += 6
        }

        if (category === 'extended') {
            slashPenalty += 6
        }

        if (matchedRequired === requiredPitchClasses.length && matchedSignature > 0) {
            slashPenalty -= 4
        }
    }

    const simplicityBonus = getSimplicityBonus({
        category,
        templateIntervalCount,
        matchedRequired,
        requiredPitchClasses,
        matchedSignature,
        missingSignature,
        extra,
    })

    const secondaryRootPenalty = getSecondaryRootPenalty({
        bassPitchClass,
        rootPitchClass,
        inputPitchClasses,
        category,
        isSlashChord,
        matchedRequired,
        requiredPitchClasses,
        matchedSignature,
        missingSignature,
    })

    const inputCoverageBonus = getInputCoverageBonus({
        matched,
        inputPitchClasses,
        matchedSignature,
        missingSignature,
        category,
    })

    const underExplainingPenalty = getUnderExplainingPenalty({
        inputPitchClasses,
        matched,
        extra,
        category,
        matchedSignature,
        missingSignature,
        matchedOptional,
    })

    finalScore += rootOwnershipBonus
    finalScore -= slashPenalty
    finalScore += simplicityBonus
    finalScore -= secondaryRootPenalty
    finalScore += inputCoverageBonus
    finalScore -= underExplainingPenalty

    if (inputPitchClasses.length > templatePitchClasses.length + 2) {
        finalScore -= 4
    }

    finalScore -= missingThirdPenalty
    finalScore += incompleteVoicingBonus

    finalScore += omissionBonus
    finalScore -= omissionPenalty

    finalScore -= powerChordPenalty
    finalScore += exactOmissionShellBonus

    return {
        matched,
        missing,
        extra,
        matchedRequired,
        missingRequired,
        matchedOptional,
        missingOmittable,
        matchedSignature,
        missingSignature,
        heuristicScore,
        slashPenalty,
        rootOwnershipBonus,
        secondaryRootPenalty,
        simplicityBonus,
        inputCoverageBonus,
        underExplainingPenalty,
        finalScore,
        missingThirdPenalty,
        incompleteVoicingBonus,
        omissionBonus,
        omissionPenalty,
        powerChordPenalty,
        exactOmissionShellBonus,
        incompleteConfidenceFactor,
    }
}

