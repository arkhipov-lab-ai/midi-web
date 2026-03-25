interface GetChordConfidenceOptions {
    bestScore: number
    secondScore: number
    isSlashChord: boolean
    incompleteConfidenceFactor: number
}

export function clampConfidence(value: number): number {
    return Math.max(0, Math.min(1, value))
}

export function getChordConfidence(options: GetChordConfidenceOptions): number {

    const {
        bestScore,
        secondScore,
        isSlashChord,
        incompleteConfidenceFactor,
    } = options

    const scoreComponent = Math.min(0.82, bestScore / 240)
    const gap = Math.max(0, bestScore - secondScore)
    const gapComponent = Math.min(0.18, gap / 120)

    let confidence = scoreComponent + gapComponent

    if (isSlashChord) {
        confidence *= 0.94
    }

    confidence *= incompleteConfidenceFactor

    return clampConfidence(confidence)
}
