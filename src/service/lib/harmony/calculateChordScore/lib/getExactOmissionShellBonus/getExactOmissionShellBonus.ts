interface GetExactOmissionShellBonusOptions {
    omissionLabelMode: 'none' | 'no3' | 'no5'
    inputPitchClasses: number[]
    templatePitchClasses: number[]
    matchedRequired: number
    requiredPitchClasses: number[]
    extra: number
    missingRequired: number
}

export function getExactOmissionShellBonus(options: GetExactOmissionShellBonusOptions): number {
    const {
        omissionLabelMode,
        inputPitchClasses,
        templatePitchClasses,
        matchedRequired,
        requiredPitchClasses,
        extra,
        missingRequired,
    } = options

    if (omissionLabelMode === 'none') {
        return 0
    }

    const fullRequired = matchedRequired === requiredPitchClasses.length

    if (!fullRequired || missingRequired > 0) {
        return 0
    }

    const exactMatch = inputPitchClasses.length === templatePitchClasses.length && extra === 0

    if (!exactMatch) {
        return 0
    }

    return 18
}
