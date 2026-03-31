export function countExtraPitchClasses(inputPitchClasses: number[], templatePitchClasses: number[]): number {
    const templateSet = new Set(templatePitchClasses)

    return inputPitchClasses.reduce((count, pitchClass) => {
        return templateSet.has(pitchClass) ? count : count + 1
    }, 0)
}
