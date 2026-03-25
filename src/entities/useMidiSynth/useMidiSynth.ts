import {useEffect, useRef} from 'react'
import {MidiSynthController} from '@service/lib'
import {ParsedMidiMessage} from '@shared/lib'

export function useMidiSynth(enabled: boolean = true) {
    const controllerRef = useRef<MidiSynthController | null>(null)

    if (!controllerRef.current) {
        controllerRef.current = new MidiSynthController()
    }

    useEffect(() => {
        const controller = controllerRef.current

        if (!controller) return

        if (enabled) {
            controller.enable()
        }

        return () => {
            controller.destroy()
        }
    }, [enabled])

    const handleMidiMessageForAudio = (message: ParsedMidiMessage): void => {
        controllerRef.current?.handleMidiMessage(message)
    }

    const resumeAudio = async (): Promise<void> => {
        await controllerRef.current?.resume()
    }

    return {
        handleMidiMessageForAudio,
        resumeAudio,
    }
}
