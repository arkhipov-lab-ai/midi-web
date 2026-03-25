import {ParsedMidiMessage} from '@shared/lib'
import {MidiSynth} from '../MidiSynth'

export class MidiSynthController {
    private synth: MidiSynth | null = null

    enable(): void {
        if (this.synth) return
        this.synth = new MidiSynth()
    }

    async resume(): Promise<void> {
        await this.synth?.resume()
    }

    handleMidiMessage(message: ParsedMidiMessage): void {
        this.synth?.handleMidiMessage(message)
    }

    destroy(): void {
        this.synth?.destroy()
        this.synth = null
    }
}
