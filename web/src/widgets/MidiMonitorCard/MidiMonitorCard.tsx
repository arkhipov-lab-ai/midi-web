import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Alert, Button, Card, Tag, Typography} from 'antd'
import {getMidiNoteName, MidiLogItem, ParsedMidiMessage} from '@shared/lib'
import {useMidiInputListener, useMidiAccess} from '@uikit/react'
import {MidiMessagesTable, MidiInputSelect, MidiKeyboardPanel} from '@features/ui'
import {FullWidthSpace} from './MidiMonitorCard.styles'
import {useMidiEngine} from './lib'
import {useHarmonyChordAnalysis} from '@entities/useHarmonyChordAnalysis'
import {HarmonyChordPanel, HarmonyChordDebugPanel} from '@features/ui'

const {Title, Text} = Typography

export const MidiMonitorCard: React.FC = () => {

    const {
        pressedNotes,
        soundingNotes,
        sustainPressed,
        handleMidiMessage,
        handlePerformanceEvent,
        isRecording,
        isPlaying,
        hasRecording,
        resumeAudio,
        startRecording,
        stopRecording,
        clearRecording,
        playRecording,
        stopPlayback,
    } = useMidiEngine()

    const {
        isSupported,
        midiAccess,
        inputs,
        connect,
    } = useMidiAccess({onMidiConnect: resumeAudio, onRefreshMidiInputs: resumeAudio})

    const {
        chord,
        debug,
        debugText,
    } = useHarmonyChordAnalysis(soundingNotes)

    const handleCopyChordDebug = useCallback(async () => {
        await navigator.clipboard.writeText(debugText)
    }, [debugText])

    const [selectedInputId, setSelectedInputId] = useState<string>()
    const [logs, setLogs] = useState<MidiLogItem[]>([])
    const nextIdRef = useRef(1)

    useEffect(() => {
        setSelectedInputId((prev) => {
            if (prev && inputs.some((input) => input.id === prev)) {
                return prev
            }
            return inputs[0]?.id
        })
    }, [inputs])

    const handleMessage = useCallback((message: ParsedMidiMessage, input: MIDIInput) => {
        const item: MidiLogItem = {
            id: nextIdRef.current++,
            device: input.name || 'Unknown MIDI input',
            noteName: getMidiNoteName(message.note),
            ...message,
        }
        setLogs((prev) => [item, ...prev].slice(0, 100))
    }, [])

    const handleVirtualNotePress = useCallback((midi: number) => {
        void resumeAudio()
        handlePerformanceEvent({
            source: 'virtual-keyboard',
            message: {
                type: 'noteon',
                channel: 1,
                data1: midi,
                data2: 100,
                note: midi,
                velocity: 100,
                controller: null,
                value: null,
                raw: [],
            },
        })
    }, [handlePerformanceEvent, resumeAudio])

    const handleVirtualNoteRelease = useCallback((midi: number) => {
        handlePerformanceEvent({
            source: 'virtual-keyboard',
            message: {
                type: 'noteoff',
                channel: 1,
                data1: midi,
                data2: 0,
                note: midi,
                velocity: 0,
                controller: null,
                value: null,
                raw: [],
            },
        })
    }, [handlePerformanceEvent])

    useMidiInputListener({
        midiAccess,
        selectedInputId,
        onMessage: handleMessage,
        handleMidiMessage,
    })

    return (
        <FullWidthSpace
            orientation='vertical'
            size='large'
        >
            <Title
                level={2}
                style={{
                    margin: 0,
                }}
            >
                MIDI input playground
            </Title>
            <Card>
                <FullWidthSpace
                    orientation='vertical'
                    size='middle'
                >
                    <div>
                        <Text
                            strong
                        >Web MIDI support: </Text>
                        {isSupported
                            ? <Tag
                                color='success'
                            >supported</Tag>
                            : <Tag
                                color='error'
                            >not supported</Tag>}
                    </div>

                    {!isSupported &&
                        <Alert
                            type='error'
                            showIcon
                            message='This browser does not support Web MIDI API'
                        />
                    }

                    {!midiAccess
                        ? <Button
                            type='primary'
                            onClick={connect}
                            disabled={!isSupported}
                        >
                            Connect MIDI
                        </Button>
                        : <MidiInputSelect
                            inputs={inputs}
                            value={selectedInputId}
                            onChange={setSelectedInputId}
                        />
                    }
                </FullWidthSpace>
            </Card>

            <Card
                title='Keyboard'
            >
                <MidiKeyboardPanel
                    pressedNotes={pressedNotes}
                    soundingNotes={soundingNotes}
                    sustainPressed={sustainPressed}
                    onNotePress={handleVirtualNotePress}
                    onNoteRelease={handleVirtualNoteRelease}
                />

                <div style={{marginTop: 12}}>
                    <div style={{marginBottom: 8}}>
                        <Text
                            strong
                        >
                            status: {isPlaying ? 'playing' : isRecording ? 'recording' : 'idle'}
                        </Text>
                    </div>

                    <div style={{display: 'flex', gap: 8}}>
                    <Button
                        type='primary'
                        onClick={() => {
                            startRecording()
                        }}
                        disabled={isRecording || isPlaying}
                    >
                        Record
                    </Button>
                    <Button
                        type='primary'
                        onClick={() => {
                            void resumeAudio()
                            playRecording()
                        }}
                        disabled={isRecording || isPlaying || !hasRecording}
                    >
                        Play
                    </Button>
                    <Button
                        onClick={() => {
                            if (isRecording) stopRecording()
                            if (isPlaying) stopPlayback()
                        }}
                        disabled={!isRecording && !isPlaying}
                    >
                        Stop
                    </Button>
                    <Button
                        onClick={() => {
                            clearRecording()
                        }}
                        disabled={isRecording || isPlaying || !hasRecording}
                    >
                        Reset
                    </Button>
                    </div>
                </div>
            </Card>

            <Card title='Chord analysis'>
                <FullWidthSpace
                    orientation='vertical'
                    size='middle'
                >
                    <HarmonyChordPanel
                        chord={chord}
                        debugText={debugText}
                        onCopyDebug={handleCopyChordDebug}
                    />

                    <HarmonyChordDebugPanel
                        debug={debug}
                        debugText={debugText}
                    />
                </FullWidthSpace>
            </Card>

            <Card
                title='Incoming MIDI messages'
            >
                <MidiMessagesTable logs={logs}/>
            </Card>
        </FullWidthSpace>
    )
}
