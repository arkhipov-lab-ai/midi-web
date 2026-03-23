import {useEffect} from 'react'
import {parseMidiMessage, ParsedMidiMessage} from '@shared/lib'

interface UseMidiInputListenerParams {
    midiAccess: MIDIAccess | null
    selectedInputId?: string
    onMessage: (message: ParsedMidiMessage, input: MIDIInput) => void
}

export function useMidiInputListener(options: UseMidiInputListenerParams): void {

    const {
        midiAccess,
        selectedInputId,
        onMessage,
    } = options

    useEffect(() => {
        if (!midiAccess || !selectedInputId) return

        const input = midiAccess.inputs.get(selectedInputId)

        if (!input) return

        input.onmidimessage = (event) => {
            const parsed = parseMidiMessage(event.data as Uint8Array)
            onMessage(parsed, input)
        }

        return () => {
            input.onmidimessage = null
        }
    }, [midiAccess, selectedInputId, onMessage])
}
