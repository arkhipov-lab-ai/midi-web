import {useCallback, useEffect, useState} from 'react'
import {
    getMidiInputs,
    isWebMidiSupported,
    requestMidiAccess,
    MidiInputDevice,
} from '@shared/lib'

interface UseMidiAccessResult {
    isSupported: boolean
    midiAccess: MIDIAccess | null
    inputs: MidiInputDevice[]
    connect: () => Promise<void>
}

export function useMidiAccess(): UseMidiAccessResult {
    const [isSupported] = useState<boolean>(isWebMidiSupported)
    const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null)
    const [inputs, setInputs] = useState<MidiInputDevice[]>([])

    const refreshInputs = useCallback((access: MIDIAccess) => {
        setInputs(getMidiInputs(access))
    }, [])

    const connect = useCallback(async () => {
        const access = await requestMidiAccess()
        setMidiAccess(access)
        refreshInputs(access)
    }, [refreshInputs])

    useEffect(() => {
        if (!midiAccess) return

        const handleStateChange = () => {
            refreshInputs(midiAccess)
        }

        midiAccess.onstatechange = handleStateChange

        return () => {
            midiAccess.onstatechange = null
        }
    }, [midiAccess, refreshInputs])

    return {
        isSupported,
        midiAccess,
        inputs,
        connect,
    }
}
