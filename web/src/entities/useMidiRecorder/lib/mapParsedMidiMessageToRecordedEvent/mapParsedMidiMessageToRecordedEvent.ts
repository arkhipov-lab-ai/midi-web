import type {
    PerformanceInputSource,
    RecordedMidiEvent,
} from '@shared/lib'
import type {ParsedMidiMessage} from '@shared/lib'

export function mapParsedMidiMessageToRecordedEvent(params: {
    source: PerformanceInputSource
    atMs: number
    message: ParsedMidiMessage
}): RecordedMidiEvent {
    const {
        source,
        atMs,
        message,
    } = params

    return {
        source,
        atMs,
        message,
    }
}

