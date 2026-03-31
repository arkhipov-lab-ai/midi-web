interface GetSecondaryRootPenaltyOptions {
    bassPitchClass: number | null
    rootPitchClass: number
    inputPitchClasses: number[]
    category: 'triad' | 'seventh' | 'extended'
    isSlashChord: boolean
    matchedRequired: number
    requiredPitchClasses: number[]
    matchedSignature: number
    missingSignature: number
}

export function getSecondaryRootPenalty(options: GetSecondaryRootPenaltyOptions): number {

    const {
        bassPitchClass,
        rootPitchClass,
        inputPitchClasses,
        category,
        isSlashChord,
        matchedRequired,
        requiredPitchClasses,
        matchedSignature,
        missingSignature,
    } = options

    if (isSlashChord) {
        return 0
    }

    const rootInBass = bassPitchClass === rootPitchClass
    const rootPresent = inputPitchClasses.includes(rootPitchClass)
    const fullRequired = matchedRequired === requiredPitchClasses.length
    const strongNamedMatch = matchedSignature > 0 && missingSignature === 0

    if (rootInBass) {
        return 0
    }

    let penalty = 0

    if (!rootPresent) {
        penalty += 18
    } else {
        penalty += 8
    }

    if (category === 'seventh') {
        penalty += 6
    }

    if (category === 'extended') {
        penalty += 10
    }

    if (!fullRequired) {
        penalty += 8
    }

    if (!strongNamedMatch) {
        penalty += 4
    }

    return penalty
}
