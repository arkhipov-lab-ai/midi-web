export function countMatchedOptionalPitchClasses(inputPitchClasses: number[], optionalPitchClasses: number[]): number {
    const inputSet = new Set(inputPitchClasses)

    return optionalPitchClasses.reduce((count, pitchClass) => {
        return inputSet.has(pitchClass) ? count + 1 : count
    }, 0)
}
