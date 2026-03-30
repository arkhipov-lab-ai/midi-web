import type {ParsedMidiMessage} from '../../midi'

export type PerformanceInputSource = 'midi' | 'virtual-keyboard' | 'playback'

export interface PerformanceInputEvent {
    source: PerformanceInputSource
    message: ParsedMidiMessage
}

export interface RecordedMidiEvent {
    source: PerformanceInputSource
    timeMs: number
    message: ParsedMidiMessage
}

