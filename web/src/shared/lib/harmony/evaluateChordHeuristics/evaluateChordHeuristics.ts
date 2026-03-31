interface EvaluateChordHeuristicsOptions {
    inputPitchClasses: number[]
    rootPitchClass: number
    requiredPitchClasses: number[]
    templatePitchClasses: number[]
    bassPitchClass: number | null
    category: 'triad' | 'seventh' | 'extended'
}

function hasPitchClass(inputPitchClasses: number[], pitchClass: number): boolean {
    return inputPitchClasses.includes(pitchClass)
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

    const hasSecond = normalizedRequired.includes(2)
    const hasMinorThird = normalizedRequired.includes(3)
    const hasMajorThird = normalizedRequired.includes(4)
    const hasFourth = normalizedRequired.includes(5)
    const hasDiminishedFifth = normalizedRequired.includes(6)
    const hasPerfectFifth = normalizedRequired.includes(7)
    const hasAugmentedFifth = normalizedRequired.includes(8)
    const hasDiminishedSeventh = normalizedRequired.includes(9)
    const hasMinorSeventh = normalizedRequired.includes(10)
    const hasMajorSeventh = normalizedRequired.includes(11)

    const secondPitchClass = (rootPitchClass + 2) % 12
    const minorThirdPitchClass = (rootPitchClass + 3) % 12
    const majorThirdPitchClass = (rootPitchClass + 4) % 12
    const fourthPitchClass = (rootPitchClass + 5) % 12
    const perfectFifthPitchClass = (rootPitchClass + 7) % 12

    const thirdPresent = hasPitchClass(inputPitchClasses, minorThirdPitchClass) || hasPitchClass(inputPitchClasses, majorThirdPitchClass)
    const secondPresent = hasPitchClass(inputPitchClasses, secondPitchClass)
    const fourthPresent = hasPitchClass(inputPitchClasses, fourthPitchClass)
    const perfectFifthPresent = hasPitchClass(inputPitchClasses, perfectFifthPitchClass)

    if (hasMinorThird || hasMajorThird) {
        const thirdPitchClass = hasMinorThird
            ? minorThirdPitchClass
            : majorThirdPitchClass

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
                ? perfectFifthPitchClass
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

    // sus/add disambiguation
    if (hasSecond) {
        if (secondPresent && !thirdPresent && perfectFifthPresent) {
            score += 14
        }

        if (secondPresent && thirdPresent) {
            score -= 6
        }
    }

    if (hasFourth) {
        if (fourthPresent && !thirdPresent && perfectFifthPresent) {
            score += 14
        }

        if (fourthPresent && thirdPresent) {
            score -= 6
        }
    }

    if (!hasSecond && secondPresent && !thirdPresent) {
        score -= 8
    }

    if (!hasFourth && fourthPresent && !thirdPresent) {
        score -= 8
    }

    return score
}
