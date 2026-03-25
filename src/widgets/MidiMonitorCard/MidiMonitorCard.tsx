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
        activeNotes,
        sustainPressed,
        handleMidiMessage,
        resumeAudio,
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
    } = useHarmonyChordAnalysis(activeNotes)

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
                    activeNotes={activeNotes}
                    sustainPressed={sustainPressed}
                />
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
