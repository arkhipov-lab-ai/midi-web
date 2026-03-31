interface GetIncompleteConfidenceFactorOptions {
    type: string
    isOmissionLabel: boolean
    incompleteVoicingBonus: number
    exactOmissionShellBonus: number
    missingThirdPenalty: number
}

export function getIncompleteConfidenceFactor(options: GetIncompleteConfidenceFactorOptions): number {
    const {
        type,
        isOmissionLabel,
        incompleteVoicingBonus,
        exactOmissionShellBonus,
        missingThirdPenalty,
    } = options

    let factor = 1

    if (type === 'power') {
        factor *= 0.62
    }

    if (isOmissionLabel) {
        factor *= exactOmissionShellBonus > 0 ? 0.8 : 0.68
    }

    if (incompleteVoicingBonus > 0 && type !== 'power') {
        factor *= 0.88
    }

    if (missingThirdPenalty > 0) {
        factor *= 0.55
    }

    return factor
}
