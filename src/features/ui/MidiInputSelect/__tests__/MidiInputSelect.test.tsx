import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {MidiInputSelect} from '../MidiInputSelect'

const mockSelect = jest.fn()

jest.mock('antd', () => ({
    Space: ({children, ...props}: any) => <div data-testid='space' {...props}>{children}</div>,
    Typography: {
        Text: ({children, ...props}: any) => <span data-testid='text' {...props}>{children}</span>,
    },
    Select: (props: any) => {
        mockSelect(props)

        return (
            <div data-testid='select'>
                <div>{props.placeholder}</div>
                <div data-testid='select-value'>{props.value ?? ''}</div>
                <button onClick={() => props.onChange('input-2')} data-testid='select-change'>
                    change
                </button>
            </div>
        )
    },
}))

describe('MidiInputSelect', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders label and select placeholder', () => {
        render(
            <MidiInputSelect
                inputs={[]}
                onChange={jest.fn()}
            />
        )

        expect(screen.getByText('MIDI input')).toBeInTheDocument()
        expect(screen.getByText('Select MIDI input')).toBeInTheDocument()
    })

    it('maps inputs to select options', () => {
        render(
            <MidiInputSelect
                inputs={[
                    {
                        id: 'input-1',
                        name: 'Keyboard',
                        manufacturer: 'Yamaha',
                    },
                    {
                        id: 'input-2',
                        name: 'Pad Controller',
                        manufacturer: null,
                    },
                ]}
                onChange={jest.fn()}
            />
        )

        expect(mockSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                options: [
                    {
                        value: 'input-1',
                        label: 'Keyboard (Yamaha)',
                    },
                    {
                        value: 'input-2',
                        label: 'Pad Controller',
                    },
                ],
            })
        )
    })

    it('passes value to Select', () => {
        render(
            <MidiInputSelect
                inputs={[
                    {
                        id: 'input-1',
                        name: 'Keyboard',
                        manufacturer: 'Yamaha',
                    },
                ]}
                value='input-1'
                onChange={jest.fn()}
            />
        )

        expect(screen.getByTestId('select-value')).toHaveTextContent('input-1')
        expect(mockSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                value: 'input-1',
            })
        )
    })

    it('calls onChange when Select changes', () => {
        const onChange = jest.fn()

        render(
            <MidiInputSelect
                inputs={[
                    {
                        id: 'input-1',
                        name: 'Keyboard',
                        manufacturer: 'Yamaha',
                    },
                    {
                        id: 'input-2',
                        name: 'Pad Controller',
                        manufacturer: null,
                    },
                ]}
                onChange={onChange}
            />
        )

        fireEvent.click(screen.getByTestId('select-change'))

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith('input-2')
    })
})
