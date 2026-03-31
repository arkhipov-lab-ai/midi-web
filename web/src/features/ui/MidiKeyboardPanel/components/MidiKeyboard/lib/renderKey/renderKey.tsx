import React from 'react'
import {MidiKeyboardKey} from '@entities/useMidiPerformanceState'
import {getMidiKeyFillColor, getMidiKeyMarkerColor} from '../getMidiKeyColor'

export interface KeyPointerHandlers {
    onNotePress?: (midi: number) => void
    onNoteRelease?: (midi: number) => void
}

export function renderKey(
    key: MidiKeyboardKey,
    pressedVelocity: number | undefined,
    soundingVelocity: number | undefined,
    interaction?: KeyPointerHandlers,
) {
    const isPressed = typeof pressedVelocity === 'number' && pressedVelocity > 0
    // Fill reflects what is audibly sounding (incl. sustain); marker = physical key down only.
    const fill = getMidiKeyFillColor(key.kind, soundingVelocity)

    const circleCx = key.x + key.width / 2
    const circleCy = key.kind === 'white' ? key.height - 18 : key.height - 12
    const circleRadius = key.kind === 'white' ? 5 : 4

    const pointerHandlers = interaction && (interaction.onNotePress || interaction.onNoteRelease)
        ? {
            onPointerDown: interaction.onNotePress
                ? (e: React.PointerEvent) => {
                    e.preventDefault()
                    interaction.onNotePress!(key.midi)
                }
                : undefined,
            onPointerUp: interaction.onNoteRelease
                ? (e: React.PointerEvent) => {
                    e.preventDefault()
                    interaction.onNoteRelease!(key.midi)
                }
                : undefined,
            style: {cursor: 'pointer' as const},
        }
        : {}

    return (
        <g key={key.midi} {...pointerHandlers}>
            <rect
                x={key.x}
                y={0}
                width={key.width}
                height={key.height}
                rx={2}
                ry={2}
                fill={fill}
                stroke='#1f1f1f'
                strokeWidth={1}
            />

            {isPressed && (
                <circle
                    cx={circleCx}
                    cy={circleCy}
                    r={circleRadius}
                    fill={getMidiKeyMarkerColor(key.kind)}
                />
            )}
        </g>
    )
}
