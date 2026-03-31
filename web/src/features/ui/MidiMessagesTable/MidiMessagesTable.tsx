import React from 'react'
import {Table} from 'antd'
import type {MidiLogItem} from '@shared/lib'
import {midiMessagesTableColumns} from './lib'

interface MidiMessagesTableProps {
    logs: MidiLogItem[]
}

export const MidiMessagesTable: React.FC<MidiMessagesTableProps> = (props) => {

    const {
        logs,
    } = props

    return (
        <Table<MidiLogItem>
            rowKey='id'
            dataSource={logs}
            columns={midiMessagesTableColumns}
            pagination={{
                pageSize: 10,
            }}
            locale={{
                emptyText: 'No MIDI messages yet',
            }}
        />
    )
}
