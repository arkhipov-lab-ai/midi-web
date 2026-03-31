export function countMissingSignaturePitchClasses(inputPitchClasses: number[], signaturePitchClasses: number[]): number {
    const inputSet = new Set(inputPitchClasses)

    return signaturePitchClasses.reduce((count, pitchClass) => {
        return inputSet.has(pitchClass) ? count : count + 1
    }, 0)
}
