import React from 'react'
import {render} from '@testing-library/react'
import {renderKey} from '../renderKey'
import {getMidiKeyFillColor, getMidiKeyMarkerColor} from '../../getMidiKeyColor'

jest.mock('../../getMidiKeyColor', () => ({
    getMidiKeyFillColor: jest.fn(),
    getMidiKeyMarkerColor: jest.fn(),
}))

const mockGetMidiKeyFillColor = getMidiKeyFillColor as jest.MockedFunction<typeof getMidiKeyFillColor>
const mockGetMidiKeyMarkerColor = getMidiKeyMarkerColor as jest.MockedFunction<typeof getMidiKeyMarkerColor>

describe('renderKey', () => {
    const baseKey = {
        midi: 60,
        kind: 'white' as const,
        x: 10,
        width: 20,
        height: 100,
    }

    beforeEach(() => {
        jest.clearAllMocks()
        mockGetMidiKeyFillColor.mockReturnValue('rgb(123, 123, 123)')
        mockGetMidiKeyMarkerColor.mockReturnValue('#abcdef')
    })

    it('renders rect with correct attributes', () => {
        const {container} = render(
            <svg>{renderKey(baseKey, undefined)}</svg>
        )

        const rect = container.querySelector('rect')
        expect(rect).toBeInTheDocument()
        expect(rect).toHaveAttribute('x', '10')
        expect(rect).toHaveAttribute('width', '20')
        expect(rect).toHaveAttribute('height', '100')
        expect(rect).toHaveAttribute('fill', 'rgb(123, 123, 123)')
    })

    it('does not render circle when velocity is undefined or 0', () => {
        const {container: c1} = render(<svg>{renderKey(baseKey, undefined)}</svg>)
        const {container: c2} = render(<svg>{renderKey(baseKey, 0)}</svg>)

        expect(c1.querySelector('circle')).toBeNull()
        expect(c2.querySelector('circle')).toBeNull()
    })

    it('renders circle when velocity > 0 for white key', () => {
        const {container} = render(<svg>{renderKey(baseKey, 50)}</svg>)

        const circle = container.querySelector('circle')
        expect(circle).toBeInTheDocument()
        expect(circle).toHaveAttribute('cx', '20')
        expect(circle).toHaveAttribute('cy', '82')
        expect(circle).toHaveAttribute('r', '5')
        expect(circle).toHaveAttribute('fill', '#abcdef')
    })

    it('renders circle with correct position for black key', () => {
        const blackKey = {
            ...baseKey,
            kind: 'black' as const,
            height: 80,
        }

        const {container} = render(<svg>{renderKey(blackKey, 50)}</svg>)

        const circle = container.querySelector('circle')
        expect(circle).toBeInTheDocument()
        expect(circle).toHaveAttribute('cy', '68')
        expect(circle).toHaveAttribute('r', '4')
    })

    it('calls color helpers with correct arguments', () => {
        render(<svg>{renderKey(baseKey, 70)}</svg>)

        expect(mockGetMidiKeyFillColor).toHaveBeenCalledWith('white', 70)
        expect(mockGetMidiKeyMarkerColor).toHaveBeenCalledWith('white')
    })
})
