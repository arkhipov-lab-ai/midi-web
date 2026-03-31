export function countMissingOmittablePitchClasses(inputPitchClasses: number[], omittablePitchClasses: number[]): number {
    const inputSet = new Set(inputPitchClasses)

    return omittablePitchClasses.reduce((count, pitchClass) => {
        return inputSet.has(pitchClass) ? count : count + 1
    }, 0)
}
