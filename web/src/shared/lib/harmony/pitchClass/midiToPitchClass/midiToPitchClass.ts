export function midiToPitchClass(midi: number): number {
    return ((midi % 12) + 12) % 12
}
