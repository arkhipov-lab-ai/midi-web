import type {
    PerformanceInputSource,
    RecordedMidiEvent,
} from '@shared/lib'
import type {ParsedMidiMessage} from '@shared/lib'

export function mapParsedMidiMessageToRecordedEvent(params: {
    source: PerformanceInputSource
    timeMs: number
    message: ParsedMidiMessage
}): RecordedMidiEvent {
    const {
        source,
        timeMs,
        message,
    } = params

    return {
        source,
        timeMs,
        message,
    }
}

