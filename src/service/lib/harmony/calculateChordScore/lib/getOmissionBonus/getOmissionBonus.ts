interface GetOmissionBonusOptions {
    omissionLabelMode: 'none' | 'no3' | 'no5'
    matchedRequired: number
    requiredPitchClasses: number[]
    missingRequired: number
    inputPitchClasses: number[]
}

export function getOmissionBonus(options: GetOmissionBonusOptions): number {

    const {
        omissionLabelMode,
        matchedRequired,
        requiredPitchClasses,
        missingRequired,
        inputPitchClasses,
    } = options

    if (omissionLabelMode === 'none') {
        return 0
    }

    const fullRequired = matchedRequired === requiredPitchClasses.length

    if (!fullRequired || missingRequired > 0) {
        return 0
    }

    if (inputPitchClasses.length < 3) {
        return 0
    }

    if (omissionLabelMode === 'no3') {
        return 22
    }

    if (omissionLabelMode === 'no5') {
        return 20
    }

    return 0
}
