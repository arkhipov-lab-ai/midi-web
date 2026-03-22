import React, {useEffect, useRef, useState} from 'react'
import {Alert, Button, Card, Select, Space, Table, Tag, Typography} from 'antd'

// FIXME: temporary code
// TODO: refactor me
const {Title, Text} = Typography

type MidiLogItem = {
    id: number
    device: string
    type: string
    channel: number | null
    data1: number | null
    data2: number | null
    raw: number[]
}

function getMessageInfo(data: Uint8Array) {
    const status = data[0]
    const data1 = data.length > 1 ? data[1] : null
    const data2 = data.length > 2 ? data[2] : null

    const messageTypeNibble = status >> 4
    const channel = (status & 0x0f) + 1

    if (messageTypeNibble === 0x9 && data1 !== null && data2 !== null) {
        if (data2 === 0) {
            return {
                type: 'noteoff',
                channel,
                data1,
                data2,
            }
        }

        return {
            type: 'noteon',
            channel,
            data1,
            data2,
        }
    }

    if (messageTypeNibble === 0x8) {
        return {
            type: 'noteoff',
            channel,
            data1,
            data2,
        }
    }

    if (messageTypeNibble === 0xb) {
        return {
            type: 'controlchange',
            channel,
            data1,
            data2,
        }
    }

    return {
        type: 'other',
        channel,
        data1,
        data2,
    }
}

export const App: React.FC = () => {
    const [isSupported, setIsSupported] = useState(false)
    const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null)
    const [inputs, setInputs] = useState<MIDIInput[]>([])
    const [selectedInputId, setSelectedInputId] = useState<string>()
    const [logs, setLogs] = useState<MidiLogItem[]>([])

    const currentInputRef = useRef<MIDIInput | null>(null)
    const nextIdRef = useRef(1)

    useEffect(() => {
        setIsSupported(typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator)
    }, [])

    const refreshInputs = (access: MIDIAccess) => {
        const inputList = Array.from(access.inputs.values())
        setInputs(inputList)

        setSelectedInputId((prev) => {
            if (prev && inputList.some((input) => input.id === prev)) {
                return prev
            }

            return inputList[0]?.id
        })
    }

    const connectMidi = async () => {
        try {
            const access = await navigator.requestMIDIAccess()
            setMidiAccess(access)
            refreshInputs(access)

            access.onstatechange = () => {
                refreshInputs(access)
            }
        } catch (error) {
            console.error('Failed to get MIDI access:', error)
        }
    }

    useEffect(() => {
        if (!midiAccess || !selectedInputId) return

        if (currentInputRef.current) {
            currentInputRef.current.onmidimessage = null
        }

        const input = midiAccess.inputs.get(selectedInputId)
        if (!input) return

        currentInputRef.current = input

        input.onmidimessage = (event) => {
            const raw = Array.from(event.data as any)
            const info = getMessageInfo(event.data as any)

            // @ts-ignore
            const item: MidiLogItem = {
                id: nextIdRef.current++,
                device: input.name || 'Unknown MIDI device',
                type: info.type,
                channel: info.channel,
                data1: info.data1,
                data2: info.data2,
                // @ts-ignore
                raw,
            }

            setLogs((prev) => [item, ...prev].slice(0, 100))
        }

        return () => {
            input.onmidimessage = null
        }
    }, [midiAccess, selectedInputId])

    const inputOptions = inputs.map((input) => ({
        value: input.id,
        label: input.name || input.id,
    }))

    return (
        <div style={{padding: 24, maxWidth: 1100, margin: '0 auto'}}>
            <Space direction='vertical' size='large' style={{width: '100%'}}>
                <Title level={2} style={{margin: 0}}>
                    MIDI input playground
                </Title>

                <Card>
                    <Space direction='vertical' size='middle' style={{width: '100%'}}>
                        <div>
                            <Text strong>Web MIDI support: </Text>
                            {isSupported ? <Tag color='success'>supported</Tag> :
                                <Tag color='error'>not supported</Tag>}
                        </div>

                        {!isSupported && (
                            <Alert
                                type='error'
                                message='This browser does not support Web MIDI API'
                                showIcon
                            />
                        )}

                        {!midiAccess ? (
                            <Button type='primary' onClick={connectMidi} disabled={!isSupported}>
                                Connect MIDI
                            </Button>
                        ) : (
                            <Space direction='vertical' size='middle' style={{width: '100%'}}>
                                <div>
                                    <Text strong>MIDI input</Text>
                                </div>

                                <Select
                                    style={{width: 320}}
                                    placeholder='Select MIDI input'
                                    value={selectedInputId}
                                    onChange={(value) => setSelectedInputId(value)}
                                    options={inputOptions}
                                />

                                <Text type='secondary'>
                                    Press keys on your MIDI keyboard and watch incoming messages below.
                                </Text>
                            </Space>
                        )}
                    </Space>
                </Card>

                <Card title='Incoming MIDI messages'>
                    <Table<MidiLogItem>
                        rowKey='id'
                        dataSource={logs}
                        pagination={{pageSize: 10}}
                        locale={{emptyText: 'No MIDI messages yet'}}
                        columns={[
                            {
                                title: 'Type',
                                dataIndex: 'type',
                                key: 'type',
                                render: (value: string) => {
                                    const color =
                                        value === 'noteon'
                                            ? 'green'
                                            : value === 'noteoff'
                                                ? 'red'
                                                : value === 'controlchange'
                                                    ? 'blue'
                                                    : 'default'

                                    return <Tag color={color}>{value}</Tag>
                                },
                            },
                            {
                                title: 'Device',
                                dataIndex: 'device',
                                key: 'device',
                            },
                            {
                                title: 'Channel',
                                dataIndex: 'channel',
                                key: 'channel',
                                width: 100,
                            },
                            {
                                title: 'Data1',
                                dataIndex: 'data1',
                                key: 'data1',
                                width: 100,
                            },
                            {
                                title: 'Data2',
                                dataIndex: 'data2',
                                key: 'data2',
                                width: 100,
                            },
                            {
                                title: 'Raw',
                                dataIndex: 'raw',
                                key: 'raw',
                                render: (raw: number[]) => `[${raw.join(', ')}]`,
                            },
                        ]}
                    />
                </Card>
            </Space>
        </div>
    )
}
