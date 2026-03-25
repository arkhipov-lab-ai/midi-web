interface GetIncompleteVoicingBonusOptions {
    inputPitchClasses: number[]
    matchedRequired: number
    requiredPitchClasses: number[]
    isIncompleteVoicingTemplate: boolean
}

export function getIncompleteVoicingBonus(options: GetIncompleteVoicingBonusOptions): number {

    const {
        inputPitchClasses,
        matchedRequired,
        requiredPitchClasses,
        isIncompleteVoicingTemplate,
    } = options

    if (!isIncompleteVoicingTemplate) {
        return 0
    }

    const fullRequired = matchedRequired === requiredPitchClasses.length

    if (!fullRequired) {
        return 0
    }

    if (inputPitchClasses.length <= 3) {
        return 18
    }

    if (inputPitchClasses.length === 4) {
        return 8
    }

    return 0
}
