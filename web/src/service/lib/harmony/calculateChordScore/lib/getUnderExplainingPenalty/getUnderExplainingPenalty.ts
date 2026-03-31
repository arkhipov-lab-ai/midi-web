interface GetUnderExplainingPenaltyOptions {
    inputPitchClasses: number[]
    matched: number
    extra: number
    category: 'triad' | 'seventh' | 'extended'
    matchedSignature: number
    missingSignature: number
    matchedOptional: number
}

export function getUnderExplainingPenalty(options: GetUnderExplainingPenaltyOptions): number {

    const {
        inputPitchClasses,
        matched,
        extra,
        category,
        matchedSignature,
        missingSignature,
        matchedOptional,
    } = options

    const uncoveredCount = Math.max(0, inputPitchClasses.length - matched)

    let penalty = 0

    penalty += uncoveredCount * 8

    if (category === 'triad' && inputPitchClasses.length >= 5) {
        penalty += 10
    }

    if (category === 'seventh' && inputPitchClasses.length >= 6) {
        penalty += 8
    }

    if (matchedSignature === 0 && missingSignature > 0) {
        penalty += 8
    }

    if (matchedOptional === 0 && inputPitchClasses.length >= 5) {
        penalty += 4
    }

    if (extra > 0) {
        penalty += extra * 2
    }

    return penalty
}
