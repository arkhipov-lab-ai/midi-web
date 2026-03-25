export function normalizePitchClasses(values: number[]): number[] {
    return Array.from(
        new Set(values.map((value) => ((value % 12) + 12) % 12)),
    ).sort((a, b) => a - b)
}
