export function countMatchedPitchClasses(inputPitchClasses: number[], templatePitchClasses: number[]): number {
    const templateSet = new Set(templatePitchClasses)

    return inputPitchClasses.reduce((count, pitchClass) => {
        return templateSet.has(pitchClass) ? count + 1 : count
    }, 0)
}
