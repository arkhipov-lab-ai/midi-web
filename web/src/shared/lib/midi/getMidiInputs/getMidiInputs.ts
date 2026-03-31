import type {MidiInputDevice} from '../api'

export function getMidiInputs(access: MIDIAccess): MidiInputDevice[] {
    return Array.from(access.inputs.values()).map((input) => ({
        id: input.id,
        name: input.name || 'Unknown MIDI input',
        manufacturer: input.manufacturer || null,
    }))
}
