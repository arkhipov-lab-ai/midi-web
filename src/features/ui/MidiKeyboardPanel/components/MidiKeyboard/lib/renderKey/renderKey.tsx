import {MidiKeyboardKey} from '@entities/useMidiPerformanceState'
import {getMidiKeyFillColor, getMidiKeyMarkerColor} from '../getMidiKeyColor'

export function renderKey(key: MidiKeyboardKey, velocity: number | undefined) {
    const isPressed = typeof velocity === 'number' && velocity > 0
    const fill = getMidiKeyFillColor(key.kind, velocity)
    const markerFill = getMidiKeyMarkerColor(key.kind)

    const circleCx = key.x + key.width / 2
    const circleCy = key.kind === 'white' ? key.height - 18 : key.height - 12
    const circleRadius = key.kind === 'white' ? 5 : 4

    return (
        <g key={key.midi}>
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
                    fill={markerFill}
                />
            )}
        </g>
    )
}
