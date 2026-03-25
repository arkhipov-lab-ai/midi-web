interface GetPowerChordPenaltyOptions {
    type: string
    inputPitchClasses: number[]
    rootPitchClass: number
}

export function getPowerChordPenalty(options: GetPowerChordPenaltyOptions): number {
    const {
        type,
        inputPitchClasses,
        rootPitchClass,
    } = options

    if (type !== 'power') {
        return 0
    }

    const majorThirdPitchClass = (rootPitchClass + 4) % 12
    const minorThirdPitchClass = (rootPitchClass + 3) % 12
    const sus2PitchClass = (rootPitchClass + 2) % 12
    const sus4PitchClass = (rootPitchClass + 5) % 12
    const minorSeventhPitchClass = (rootPitchClass + 10) % 12
    const majorSeventhPitchClass = (rootPitchClass + 11) % 12

    let penalty = 0

    if (inputPitchClasses.includes(majorThirdPitchClass) || inputPitchClasses.includes(minorThirdPitchClass)) {
        penalty += 26
    }

    if (inputPitchClasses.includes(sus2PitchClass) || inputPitchClasses.includes(sus4PitchClass)) {
        penalty += 20
    }

    if (inputPitchClasses.includes(minorSeventhPitchClass) || inputPitchClasses.includes(majorSeventhPitchClass)) {
        penalty += 18
    }

    return penalty
}
