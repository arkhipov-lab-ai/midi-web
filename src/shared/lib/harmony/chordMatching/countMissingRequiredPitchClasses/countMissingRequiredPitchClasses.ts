export function countMissingRequiredPitchClasses(inputPitchClasses: number[], requiredPitchClasses: number[]): number {
    const inputSet = new Set(inputPitchClasses)

    return requiredPitchClasses.reduce((count, pitchClass) => {
        return inputSet.has(pitchClass) ? count : count + 1
    }, 0)
}
