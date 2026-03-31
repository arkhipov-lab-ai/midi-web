interface GetSimplicityBonusOptions {
    category: 'triad' | 'seventh' | 'extended'
    templateIntervalCount: number
    matchedRequired: number
    requiredPitchClasses: number[]
    matchedSignature: number
    missingSignature: number
    extra: number
}

export function getSimplicityBonus(options: GetSimplicityBonusOptions): number {

    const {
        category,
        templateIntervalCount,
        matchedRequired,
        requiredPitchClasses,
        matchedSignature,
        missingSignature,
        extra,
    } = options

    const hasFullRequiredMatch = matchedRequired === requiredPitchClasses.length
    const hasStrongNamingSupport = missingSignature === 0 && matchedSignature > 0

    if (!hasFullRequiredMatch) {
        return 0
    }

    if (category === 'triad') {
        if (templateIntervalCount <= 3 && extra <= 1) {
            return 12
        }

        if (templateIntervalCount === 4 && hasStrongNamingSupport && extra <= 1) {
            return 6
        }

        return 0
    }

    if (category === 'seventh') {
        if (templateIntervalCount <= 4 && extra <= 1) {
            return 8
        }

        return 0
    }

    if (category === 'extended') {
        if (hasStrongNamingSupport && extra <= 1) {
            return 4
        }

        return 0
    }

    return 0
}
