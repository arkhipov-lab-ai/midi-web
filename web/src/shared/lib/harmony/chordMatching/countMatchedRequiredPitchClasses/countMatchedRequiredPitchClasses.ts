export function countMatchedRequiredPitchClasses(inputPitchClasses: number[], requiredPitchClasses: number[]): number {
    const inputSet = new Set(inputPitchClasses)

    return requiredPitchClasses.reduce((count, pitchClass) => {
        return inputSet.has(pitchClass) ? count + 1 : count
    }, 0)
}
