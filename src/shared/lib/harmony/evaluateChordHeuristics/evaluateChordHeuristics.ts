interface EvaluateChordHeuristicsOptions {
    inputPitchClasses: number[]
    rootPitchClass: number
    requiredPitchClasses: number[]
    templatePitchClasses: number[]
    bassPitchClass: number | null
    category: 'triad' | 'seventh' | 'extended'
}

export function evaluateChordHeuristics(options: EvaluateChordHeuristicsOptions): number {

    const {
        inputPitchClasses,
        rootPitchClass,
        requiredPitchClasses,
        templatePitchClasses,
        bassPitchClass,
        category,
    } = options

    const inputSet = new Set(inputPitchClasses)
    const templateSet = new Set(templatePitchClasses)

    let score = 0

    const rootPresent = inputSet.has(rootPitchClass)

    if (rootPresent) {
        score += 10
    } else {
        score -= 18
    }

    if (bassPitchClass !== null) {
        if (bassPitchClass === rootPitchClass) {
            score += 12
        } else if (templateSet.has(bassPitchClass)) {
            score -= 6
        } else {
            score -= 16
        }
    }

    const normalizedRequired = requiredPitchClasses
        .map((pitchClass) => (pitchClass - rootPitchClass + 12) % 12)

    const hasMinorThird = normalizedRequired.includes(3)
    const hasMajorThird = normalizedRequired.includes(4)
    const hasDiminishedFifth = normalizedRequired.includes(6)
    const hasPerfectFifth = normalizedRequired.includes(7)
    const hasAugmentedFifth = normalizedRequired.includes(8)
    const hasDiminishedSeventh = normalizedRequired.includes(9)
    const hasMinorSeventh = normalizedRequired.includes(10)
    const hasMajorSeventh = normalizedRequired.includes(11)

    if (hasMinorThird || hasMajorThird) {
        const thirdPitchClass = hasMinorThird
            ? (rootPitchClass + 3) % 12
            : (rootPitchClass + 4) % 12

        if (inputSet.has(thirdPitchClass)) {
            score += 9
        } else {
            score -= 14
        }
    }

    if (hasDiminishedFifth || hasPerfectFifth || hasAugmentedFifth) {
        const fifthPitchClass = hasDiminishedFifth
            ? (rootPitchClass + 6) % 12
            : hasPerfectFifth
                ? (rootPitchClass + 7) % 12
                : (rootPitchClass + 8) % 12

        if (inputSet.has(fifthPitchClass)) {
            score += 6
        } else {
            score -= 7
        }
    }

    if (hasDiminishedSeventh || hasMinorSeventh || hasMajorSeventh) {
        const seventhPitchClass = hasDiminishedSeventh
            ? (rootPitchClass + 9) % 12
            : hasMinorSeventh
                ? (rootPitchClass + 10) % 12
                : (rootPitchClass + 11) % 12

        if (inputSet.has(seventhPitchClass)) {
            score += 8
        } else {
            score -= 12
        }
    }

    const requiredMatchedCount = requiredPitchClasses.filter((pitchClass) => inputSet.has(pitchClass)).length
    const requiredCoverage = requiredPitchClasses.length > 0
        ? requiredMatchedCount / requiredPitchClasses.length
        : 0

    score += Math.round(requiredCoverage * 12)

    if ((category === 'seventh' || category === 'extended') && requiredCoverage < 1) {
        score -= 10
    }

    if (category === 'extended') {
        if (bassPitchClass !== null && bassPitchClass !== rootPitchClass) {
            score -= 6
        }

        if (requiredCoverage === 1) {
            score += 4
        }
    }

    return score
}
