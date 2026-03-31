import {ColumnsType} from 'antd/es/table'
import {MidiLogItem} from '@shared/lib'
import {Tag} from 'antd'

export const midiMessagesTableColumns: ColumnsType<MidiLogItem> = [
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 140,
        render: (value: MidiLogItem['type']) => {
            const color =
                value === 'noteon'
                    ? 'green'
                    : value === 'noteoff'
                        ? 'red'
                        : value === 'controlchange'
                            ? 'blue'
                            : 'default'

            return (
                <Tag
                    color={color}
                >{value}</Tag>
            )
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
        title: 'Note',
        dataIndex: 'note',
        key: 'note',
        width: 90,
        render: (value: number | null) => value ?? '-',
    },
    {
        title: 'Note name',
        dataIndex: 'noteName',
        key: 'noteName',
        width: 110,
        render: (value: string | null | undefined) => value ?? '-',
    },
    {
        title: 'Velocity',
        dataIndex: 'velocity',
        key: 'velocity',
        width: 100,
        render: (value: number | null) => value ?? '-',
    },
    {
        title: 'Data1',
        dataIndex: 'data1',
        key: 'data1',
        width: 100,
        render: (value: number | null) => value ?? '-',
    },
    {
        title: 'Data2',
        dataIndex: 'data2',
        key: 'data2',
        width: 100,
        render: (value: number | null) => value ?? '-',
    },
    {
        title: 'Raw',
        dataIndex: 'raw',
        key: 'raw',
        render: (raw: number[]) => `[${raw.join(', ')}]`,
    },
]
