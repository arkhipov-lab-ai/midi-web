export type ActiveNotesMap = Partial<Record<number, number>>

export interface MidiPerformanceState {
    pressedNotes: ActiveNotesMap
    sustainedNotes: ActiveNotesMap
    sustainPressed: boolean
}

export interface MidiKeyboardKey {
    midi: number
    kind: 'white' | 'black'
    x: number
    width: number
    height: number
}
