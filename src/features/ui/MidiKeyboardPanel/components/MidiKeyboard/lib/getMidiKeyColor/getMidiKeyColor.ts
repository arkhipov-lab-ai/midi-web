function clampVelocity(velocity: number): number {
    if (velocity < 0) return 0
    if (velocity > 127) return 127
    return velocity
}

function toGrayRgb(value: number): string {
    return `rgb(${value}, ${value}, ${value})`
}

export function getMidiKeyFillColor(kind: 'white' | 'black', velocity?: number): string {
    if (!velocity || velocity <= 0) {
        return kind === 'white' ? toGrayRgb(255) : toGrayRgb(0)
    }

    const normalized = clampVelocity(velocity) / 127

    if (kind === 'white') {
        const channelValue = Math.round(255 - normalized * 127)
        return toGrayRgb(channelValue)
    }

    const channelValue = Math.round(normalized * 128)
    return toGrayRgb(channelValue)
}

export function getMidiKeyMarkerColor(kind: 'white' | 'black'): string {
    return kind === 'white' ? '#000000' : '#ffffff'
}
