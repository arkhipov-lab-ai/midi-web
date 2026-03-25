import {
    ParsedMidiMessage,
    SUSTAIN_CONTROLLER,
    SUSTAIN_ON_THRESHOLD,
} from '@shared/lib'
import {
    NoteVoice,
} from '../interfaces'

export class MidiSynth {

    private audioContext: AudioContext
    private masterGain: GainNode
    private voices = new Map<number, NoteVoice>()
    private sustainPressed = false
    private reverbInput: GainNode
    private dryGain: GainNode
    private wetGain: GainNode
    private convolver: ConvolverNode

    constructor() {
        this.audioContext = new AudioContext()

        this.masterGain = this.audioContext.createGain()
        this.masterGain.gain.value = 0.22

        this.dryGain = this.audioContext.createGain()
        this.dryGain.gain.value = 1

        this.wetGain = this.audioContext.createGain()
        this.wetGain.gain.value = 0.16

        this.reverbInput = this.audioContext.createGain()
        this.reverbInput.gain.value = 1

        this.convolver = this.audioContext.createConvolver()
        this.convolver.buffer = this.createImpulseResponse({
            duration: 1.8,
            decay: 2.2,
            reverse: false,
        })

        this.dryGain.connect(this.masterGain)

        this.reverbInput.connect(this.convolver)
        this.convolver.connect(this.wetGain)
        this.wetGain.connect(this.masterGain)

        this.masterGain.connect(this.audioContext.destination)
    }

    private createImpulseResponse(params: {
        duration: number
        decay: number
        reverse: boolean
    }): AudioBuffer {
        const {
            duration,
            decay,
            reverse,
        } = params

        const sampleRate = this.audioContext.sampleRate
        const length = Math.floor(sampleRate * duration)
        const impulse = this.audioContext.createBuffer(2, length, sampleRate)

        for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
            const channelData = impulse.getChannelData(channel)

            for (let i = 0; i < length; i++) {
                const timeIndex = reverse ? length - i : i
                const envelope = Math.pow(1 - timeIndex / length, decay)

                channelData[i] = (Math.random() * 2 - 1) * envelope
            }
        }

        return impulse
    }

    async resume(): Promise<void> {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume()
        }
    }

    destroy(): void {
        for (const [note] of this.voices) {
            this.forceStopVoice(note)
        }

        void this.audioContext.close()
    }

    handleMidiMessage(message: ParsedMidiMessage): void {
        if (message.type === 'noteon' && message.note !== null && message.velocity !== null) {
            if (message.velocity === 0) {
                this.noteOff(message.note)
                return
            }

            this.noteOn(message.note, message.velocity)
            return
        }

        if (message.type === 'noteoff' && message.note !== null) {
            this.noteOff(message.note)
            return
        }

        if (
            message.type === 'controlchange'
            && message.controller === SUSTAIN_CONTROLLER
            && message.value !== null
        ) {
            this.setSustain(message.value >= SUSTAIN_ON_THRESHOLD)
        }
    }

    private getSecondPartialGain(note: number): number {
        if (note <= 28) return 0.42
        if (note <= 40) return 0.36
        if (note <= 60) return 0.24
        if (note <= 84) return 0.14
        return 0.09
    }

    private getThirdPartialGain(note: number): number {
        if (note <= 28) return 0.16
        if (note <= 40) return 0.12
        if (note <= 60) return 0.07
        if (note <= 84) return 0.035
        return 0.02
    }

    private getBaseOscillatorType(note: number): OscillatorType {
        if (note >= 88) return 'sine'
        return 'triangle'
    }

    private getAttackTime(note: number): number {
        if (note >= 84) return 0.008
        if (note >= 60) return 0.006
        return 0.005
    }

    private getEarlyDecayLevel(note: number): number {
        if (note >= 84) return 0.28
        if (note >= 60) return 0.34
        return 0.42
    }

    private getReverbSendGain(note: number): number {
        if (note <= 28) return 0.04
        if (note <= 40) return 0.06
        if (note <= 60) return 0.1
        if (note <= 84) return 0.14
        return 0.1
    }

    private getFourthPartialGain(note: number): number {
        if (note <= 28) return 0.08
        if (note <= 40) return 0.05
        return 0
    }

    private addAttackTransientToVoice(voice: NoteVoice, note: number, frequency: number): void {
        if (note > 40) return

        const now = this.audioContext.currentTime
        const transientOscillator = this.audioContext.createOscillator()
        const transientGain = this.audioContext.createGain()

        transientOscillator.type = 'triangle'
        transientOscillator.frequency.setValueAtTime(frequency * 6, now)

        const amount = note <= 28 ? 0.045 : 0.025

        transientGain.gain.setValueAtTime(amount, now)
        transientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018)

        transientOscillator.connect(transientGain)
        transientGain.connect(voice.filterNode)

        transientOscillator.start(now)
        transientOscillator.stop(now + 0.02)

        voice.oscillators.push(transientOscillator)
        voice.partialGains.push(transientGain)
    }

    private noteOn(note: number, velocity: number): void {
        const existingVoice = this.voices.get(note)

        if (existingVoice) {
            this.forceStopVoice(note)
        }

        const now = this.audioContext.currentTime
        const frequency = this.midiNoteToFrequency(note)
        const velocityGain = this.velocityToGain(velocity)
        const lowNoteBoost = this.getLowNoteBoost(note)
        const peakGain = velocityGain * lowNoteBoost
        const naturalDecayTime = this.getNaturalDecayTime(note)
        const filterFrequency = this.getFilterFrequency(note, velocity)

        const gainNode = this.audioContext.createGain()
        const filterNode = this.audioContext.createBiquadFilter()
        const reverbSendNode = this.audioContext.createGain()

        filterNode.type = 'lowpass'
        filterNode.frequency.setValueAtTime(filterFrequency, now)
        filterNode.Q.setValueAtTime(0.7, now)

        reverbSendNode.gain.setValueAtTime(this.getReverbSendGain(note), now)

        gainNode.gain.cancelScheduledValues(now)
        gainNode.gain.setValueAtTime(0.0001, now)

        const attackTime = this.getAttackTime(note)
        const earlyDecayLevel = this.getEarlyDecayLevel(note)

        gainNode.gain.linearRampToValueAtTime(peakGain, now + attackTime)
        gainNode.gain.exponentialRampToValueAtTime(
            Math.max(peakGain * earlyDecayLevel, 0.0001),
            now + 0.14,
        )
        gainNode.gain.exponentialRampToValueAtTime(
            Math.max(peakGain * 0.1, 0.0001),
            now + naturalDecayTime,
        )

        filterNode.connect(gainNode)
        gainNode.connect(this.dryGain)
        gainNode.connect(reverbSendNode)
        reverbSendNode.connect(this.reverbInput)

        const partialGains: GainNode[] = []
        const oscillators: OscillatorNode[] = []

        const voice = {
            oscillators,
            partialGains,
            filterNode,
            gainNode,
            reverbSendNode,
            note,
            isKeyPressed: true,
            stopTime: null,
        } as NoteVoice

        this.addAttackTransientToVoice(voice, note, frequency)

        this.addOscillatorToVoice({
            voice,
            type: this.getBaseOscillatorType(note),
            frequency,
            gain: 1,
            detune: -1,
        })

        this.addOscillatorToVoice({
            voice,
            type: 'sine',
            frequency: frequency * 2,
            gain: this.getSecondPartialGain(note),
            detune: 2,
        })

        this.addOscillatorToVoice({
            voice,
            type: 'sine',
            frequency: frequency * 3,
            gain: this.getThirdPartialGain(note),
            detune: -2,
        })

        this.addOscillatorToVoice({
            voice,
            type: 'triangle',
            frequency: frequency * 0.5,
            gain: this.getSubOscillatorGain(note),
            detune: 1,
        })

        this.addOscillatorToVoice({
            voice,
            type: 'sine',
            frequency: frequency * 4,
            gain: this.getFourthPartialGain(note),
            detune: 1,
        })

        this.voices.set(note, voice)

        window.setTimeout(() => {
            const currentVoice = this.voices.get(note)

            if (!currentVoice) return
            if (currentVoice !== voice) return
            if (currentVoice.isKeyPressed) return
            if (this.sustainPressed) return

            this.stopVoice(note)
        }, Math.ceil((naturalDecayTime + 0.1) * 1000))
    }

    private addOscillatorToVoice(params: {
        voice: NoteVoice
        type: OscillatorType
        frequency: number
        gain: number
        detune: number
    }): void {
        const {
            voice,
            type,
            frequency,
            gain,
            detune,
        } = params

        const now = this.audioContext.currentTime

        const oscillator = this.audioContext.createOscillator()
        const partialGain = this.audioContext.createGain()

        oscillator.type = type
        oscillator.frequency.setValueAtTime(frequency, now)
        oscillator.detune.setValueAtTime(detune, now)

        partialGain.gain.setValueAtTime(gain, now)

        oscillator.connect(partialGain)
        partialGain.connect(voice.filterNode)

        oscillator.start(now)

        voice.oscillators.push(oscillator)
        voice.partialGains.push(partialGain)
    }

    private noteOff(note: number): void {
        const voice = this.voices.get(note)

        if (!voice) return

        voice.isKeyPressed = false

        if (!this.sustainPressed) {
            this.stopVoice(note)
        }
    }

    private setSustain(isPressed: boolean): void {
        const wasPressed = this.sustainPressed
        this.sustainPressed = isPressed

        if (wasPressed && !isPressed) {
            for (const [note, voice] of this.voices) {
                if (!voice.isKeyPressed) {
                    this.stopVoice(note)
                }
            }
        }
    }

    private stopVoice(note: number): void {
        const voice = this.voices.get(note)

        if (!voice) return
        if (voice.stopTime !== null) return

        const now = this.audioContext.currentTime
        const releaseTime = this.getReleaseTime(voice.note)
        const safeCurrentGain = Math.max(voice.gainNode.gain.value, 0.0001)
        const safeCurrentReverbSendGain = Math.max(voice.reverbSendNode.gain.value, 0.0001)

        voice.stopTime = now

        voice.gainNode.gain.cancelScheduledValues(now)
        voice.gainNode.gain.setValueAtTime(safeCurrentGain, now)
        voice.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime)

        voice.reverbSendNode.gain.cancelScheduledValues(now)
        voice.reverbSendNode.gain.setValueAtTime(safeCurrentReverbSendGain, now)
        voice.reverbSendNode.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime)

        for (const partialGain of voice.partialGains) {
            const currentPartialGain = Math.max(partialGain.gain.value, 0.0001)
            partialGain.gain.cancelScheduledValues(now)
            partialGain.gain.setValueAtTime(currentPartialGain, now)
            partialGain.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime * 0.9)
        }

        for (const oscillator of voice.oscillators) {
            oscillator.stop(now + releaseTime + 0.03)
        }

        window.setTimeout(() => {
            const currentVoice = this.voices.get(note)

            if (currentVoice !== voice) return

            this.voices.delete(note)
        }, Math.ceil((releaseTime + 0.08) * 1000))
    }

    private forceStopVoice(note: number): void {
        const voice = this.voices.get(note)

        if (!voice) return

        const now = this.audioContext.currentTime

        for (const oscillator of voice.oscillators) {
            try {
                oscillator.stop(now)
            } catch {}
        }

        this.voices.delete(note)
    }

    private midiNoteToFrequency(note: number): number {
        return 440 * Math.pow(2, (note - 69) / 12)
    }

    private velocityToGain(velocity: number): number {
        const normalized = velocity / 127
        return Math.max(0.015, Math.pow(normalized, 1.7) * 0.75)
    }

    private getLowNoteBoost(note: number): number {
        if (note >= 60) return 1
        if (note <= 24) return 1.22

        const ratio = (60 - note) / (60 - 24)
        return 1 + ratio * 0.22
    }

    private getSubOscillatorGain(note: number): number {
        if (note >= 36) return 0
        if (note <= 24) return 0.025

        const ratio = (36 - note) / (36 - 24)
        return ratio * 0.025
    }

    private getNaturalDecayTime(note: number): number {
        if (note <= 28) return 4.2
        if (note <= 40) return 3.4
        if (note <= 52) return 2.7
        if (note <= 64) return 2.1
        if (note <= 76) return 1.7
        return 1.35
    }

    private getReleaseTime(note: number): number {
        if (note <= 40) return 0.38
        if (note <= 64) return 0.3
        return 0.22
    }

    private getFilterFrequency(note: number, velocity: number): number {
        const velocityFactor = velocity / 127

        if (note <= 28) {
            return 2600 + velocityFactor * 1200
        }

        if (note <= 40) {
            return 2400 + velocityFactor * 1100
        }

        if (note <= 60) {
            return 2200 + velocityFactor * 1000
        }

        if (note <= 84) {
            return 2400 + velocityFactor * 900
        }

        return 2200 + velocityFactor * 650
    }
}
