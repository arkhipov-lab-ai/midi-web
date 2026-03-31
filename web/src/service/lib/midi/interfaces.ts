export interface NoteVoice {
    oscillators: OscillatorNode[]
    partialGains: GainNode[]
    filterNode: BiquadFilterNode
    gainNode: GainNode
    reverbSendNode: GainNode
    note: number
    isKeyPressed: boolean
    stopTime: number | null
}
