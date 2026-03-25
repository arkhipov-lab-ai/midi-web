interface GetInputCoverageBonusOptions {
    matched: number
    inputPitchClasses: number[]
    matchedSignature: number
    missingSignature: number
    category: 'triad' | 'seventh' | 'extended'
}

export function getInputCoverageBonus(options: GetInputCoverageBonusOptions): number {

    const {
        matched,
        inputPitchClasses,
        matchedSignature,
        missingSignature,
        category,
    } = options

    if (inputPitchClasses.length === 0) {
        return 0
    }

    const coverageRatio = matched / inputPitchClasses.length
    let bonus = Math.round(coverageRatio * 18)

    if (matchedSignature > 0 && missingSignature === 0) {
        bonus += 6
    }

    if (category === 'extended' && coverageRatio >= 0.8) {
        bonus += 6
    }

    if (category === 'seventh' && coverageRatio >= 0.8) {
        bonus += 3
    }

    return bonus
}
