export function buildChordPitchClasses(rootPitchClass: number, intervals: number[]): number[] {
    return intervals
        .map((interval) => (rootPitchClass + interval) % 12)
        .sort((a, b) => a - b)
}
