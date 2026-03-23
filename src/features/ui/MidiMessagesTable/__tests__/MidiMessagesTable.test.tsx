import React from 'react'
import {render, screen} from '@testing-library/react'
import {MidiMessagesTable} from '../MidiMessagesTable'
import {midiMessagesTableColumns} from '../lib'

const mockTable = jest.fn()

jest.mock('antd', () => ({
    Table: (props: any) => {
        mockTable(props)

        return (
            <div data-testid='table'>
                <div data-testid='row-key'>{props.rowKey}</div>
                <div data-testid='data-length'>{props.dataSource.length}</div>
                <div data-testid='page-size'>{props.pagination?.pageSize}</div>
                <div data-testid='empty-text'>{props.locale?.emptyText}</div>
            </div>
        )
    },
    Tag: ({children}: any) => <span>{children}</span>,
}))

describe('MidiMessagesTable', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders table and passes logs as dataSource', () => {
        const logs = [
            {
                id: 1,
                device: 'Keyboard',
                type: 'noteon',
                channel: 1,
                data1: 60,
                data2: 100,
                note: 60,
                velocity: 100,
                controller: null,
                value: null,
                raw: [144, 60, 100],
                noteName: 'C4',
            },
            {
                id: 2,
                device: 'Pad',
                type: 'controlchange',
                channel: 2,
                data1: 7,
                data2: 127,
                note: null,
                velocity: null,
                controller: 7,
                value: 127,
                raw: [177, 7, 127],
                noteName: null,
            },
        ] as any

        render(<MidiMessagesTable logs={logs}/>)

        expect(screen.getByTestId('table')).toBeInTheDocument()
        expect(screen.getByTestId('data-length')).toHaveTextContent('2')

        expect(mockTable).toHaveBeenCalledWith(
            expect.objectContaining({
                dataSource: logs,
            })
        )
    })

    it('passes expected static props to Table', () => {
        render(<MidiMessagesTable logs={[]}/>)

        expect(screen.getByTestId('row-key')).toHaveTextContent('id')
        expect(screen.getByTestId('page-size')).toHaveTextContent('10')
        expect(screen.getByTestId('empty-text')).toHaveTextContent('No MIDI messages yet')

        expect(mockTable).toHaveBeenCalledWith(
            expect.objectContaining({
                rowKey: 'id',
                columns: midiMessagesTableColumns,
                pagination: {
                    pageSize: 10,
                },
                locale: {
                    emptyText: 'No MIDI messages yet',
                },
            })
        )
    })

    it('passes empty logs array correctly', () => {
        render(<MidiMessagesTable logs={[]}/>)

        expect(mockTable).toHaveBeenCalledWith(
            expect.objectContaining({
                dataSource: [],
            })
        )
    })
})
