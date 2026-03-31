interface GetOmissionPenaltyOptions {
    omissionLabelMode: 'none' | 'no3' | 'no5'
    inputPitchClasses: number[]
    extra: number
}

export function getOmissionPenalty(options: GetOmissionPenaltyOptions): number {

    const {
        omissionLabelMode,
        inputPitchClasses,
        extra,
    } = options

    if (omissionLabelMode === 'none') {
        return 0
    }

    let penalty = 0

    if (inputPitchClasses.length <= 2) {
        penalty += 12
    }

    if (extra > 1) {
        penalty += 8
    }

    return penalty
}
