import {useCallback, useEffect, useState} from 'react'
import {
    getMidiInputs,
    isWebMidiSupported,
    requestMidiAccess,
    MidiInputDevice,
} from '@shared/lib'

interface UseMidiAccessOptions {
    onMidiConnect?: (access: MIDIAccess) => Promise<void>
    onRefreshMidiInputs?: (access: MIDIAccess) => Promise<void>
}

interface UseMidiAccessResult {
    isSupported: boolean
    midiAccess: MIDIAccess | null
    inputs: MidiInputDevice[]
    connect: () => Promise<void>
}

export function useMidiAccess(options?: UseMidiAccessOptions): UseMidiAccessResult {

    const [isSupported] = useState<boolean>(isWebMidiSupported)
    const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null)
    const [inputs, setInputs] = useState<MidiInputDevice[]>([])

    const refreshInputs = useCallback(async (access: MIDIAccess) => {
        setInputs(getMidiInputs(access))
        await options?.onRefreshMidiInputs?.(access)
    }, [options])

    const connect = useCallback(async () => {
        const access = await requestMidiAccess()
        await options?.onMidiConnect?.(access)
        setMidiAccess(access)
        await refreshInputs(access)
    }, [refreshInputs, options])

    useEffect(() => {
        if (!midiAccess) return

        const handleStateChange = async () => {
            await refreshInputs(midiAccess)
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
