import React from 'react'
import {Typography, SelectProps} from 'antd'
import type {MidiInputDevice} from '@shared/lib'
import {MidiInputSelect as StyledMidiInputSelect, MidiInputSelectComponent as StyledSelect} from './MidiInputSelect.styles'

const {Text} = Typography

interface MidiInputSelectProps {
    inputs: MidiInputDevice[]
    value?: string
    onChange: SelectProps['onChange']
}

export const MidiInputSelect: React.FC<MidiInputSelectProps> = (props) => {

    const {
        inputs,
        value,
        onChange,
    } = props

    const options = inputs.map((input) => ({
        value: input.id,
        label: input.manufacturer ? `${input.name} (${input.manufacturer})` : input.name,
    }))

    return (
        <StyledMidiInputSelect
            orientation='vertical'
            size='small'
        >
            <Text
                strong
            >MIDI input</Text>

            <StyledSelect
                placeholder='Select MIDI input'
                value={value}
                onChange={onChange}
                options={options}
            />
        </StyledMidiInputSelect>
    )
}
