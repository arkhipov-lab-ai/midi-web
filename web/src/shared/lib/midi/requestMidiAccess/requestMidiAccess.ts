export function isWebMidiSupported(): boolean {
    return typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator
}

export async function requestMidiAccess(): Promise<MIDIAccess> {
    if (!isWebMidiSupported()) {
        throw new Error('Web MIDI API is not supported in this browser')
    }

    return navigator.requestMIDIAccess()
}
