export function countMatchedSignaturePitchClasses(inputPitchClasses: number[], signaturePitchClasses: number[]): number {
    const inputSet = new Set(inputPitchClasses)

    return signaturePitchClasses.reduce((count, pitchClass) => {
        return inputSet.has(pitchClass) ? count + 1 : count
    }, 0)
}
