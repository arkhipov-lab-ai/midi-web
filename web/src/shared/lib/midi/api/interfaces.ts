export type MidiMessageType = 'noteon' | 'noteoff' | 'controlchange' | 'other'

export interface ParsedMidiMessage {
    type: MidiMessageType
    channel: number | null
    data1: number | null
    data2: number | null
    note: number | null
    velocity: number | null
    controller: number | null
    value: number | null
    raw: number[]
}

export interface MidiInputDevice {
    id: string
    name: string
    manufacturer: string | null
}

export interface MidiLogItem extends ParsedMidiMessage {
    id: number
    device: string
    noteName?: string | null
}
