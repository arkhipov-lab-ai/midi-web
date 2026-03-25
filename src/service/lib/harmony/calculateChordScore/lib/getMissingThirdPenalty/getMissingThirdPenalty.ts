interface GetMissingThirdPenaltyOptions {
    inputPitchClasses: number[]
    rootPitchClass: number
    qualityDependsOnThird: boolean
}

export function getMissingThirdPenalty(options: GetMissingThirdPenaltyOptions): number {

    const {
        inputPitchClasses,
        rootPitchClass,
        qualityDependsOnThird,
    } = options

    if (!qualityDependsOnThird) {
        return 0
    }

    const minorThirdPitchClass = (rootPitchClass + 3) % 12
    const majorThirdPitchClass = (rootPitchClass + 4) % 12

    const hasMinorThird = inputPitchClasses.includes(minorThirdPitchClass)
    const hasMajorThird = inputPitchClasses.includes(majorThirdPitchClass)

    if (hasMinorThird || hasMajorThird) {
        return 0
    }

    return 28
}
