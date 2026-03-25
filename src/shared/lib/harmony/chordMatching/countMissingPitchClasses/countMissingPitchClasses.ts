export function countMissingPitchClasses(inputPitchClasses: number[], templatePitchClasses: number[]): number {
    const inputSet = new Set(inputPitchClasses)

    return templatePitchClasses.reduce((count, pitchClass) => {
        return inputSet.has(pitchClass) ? count : count + 1
    }, 0)
}
