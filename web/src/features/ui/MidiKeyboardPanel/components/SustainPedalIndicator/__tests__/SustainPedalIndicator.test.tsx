import React from 'react'
import {render, screen} from '@testing-library/react'
import {SustainPedalIndicator} from '../SustainPedalIndicator'

const mockStyledSustainPedalIndicator = jest.fn()
const mockSustainPedalIndicatorSpace = jest.fn()
const mockSustainPedalIndicatorLabel = jest.fn()

jest.mock('../SustainPedalIndicator.styles', () => ({
    SustainPedalIndicator: (props: any) => {
        mockStyledSustainPedalIndicator(props)
        return <div data-testid='sustain-pedal-indicator'>{props.children}</div>
    },
    SustainPedalIndicatorTitle: (props: any) => <div data-testid='sustain-pedal-indicator-title'>{props.children}</div>,
    SustainPedalIndicatorContainer: (props: any) => <div data-testid='sustain-pedal-indicator-container'>{props.children}</div>,
    SustainPedalIndicatorSpace: (props: any) => {
        mockSustainPedalIndicatorSpace(props)
        return <div data-testid='sustain-pedal-indicator-space' />
    },
    SustainPedalIndicatorLabel: (props: any) => {
        mockSustainPedalIndicatorLabel(props)
        return <span data-testid='sustain-pedal-indicator-label'>{props.children}</span>
    },
}))

describe('SustainPedalIndicator', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders pressed state correctly', () => {
        render(<SustainPedalIndicator pressed={true} />)

        expect(screen.getByTestId('sustain-pedal-indicator-title')).toHaveTextContent('Sustain pedal')
        expect(screen.getByTestId('sustain-pedal-indicator-label')).toHaveTextContent('Pressed')

        expect(mockStyledSustainPedalIndicator).toHaveBeenCalledWith(
            expect.objectContaining({
                $pressed: true,
            })
        )

        expect(mockSustainPedalIndicatorSpace).toHaveBeenCalledWith(
            expect.objectContaining({
                style: {
                    background: '#52c41a',
                },
            })
        )

        expect(mockSustainPedalIndicatorLabel).toHaveBeenCalledWith(
            expect.objectContaining({
                style: {
                    color: '#135200',
                },
            })
        )
    })

    it('renders released state correctly', () => {
        render(<SustainPedalIndicator pressed={false} />)

        expect(screen.getByTestId('sustain-pedal-indicator-title')).toHaveTextContent('Sustain pedal')
        expect(screen.getByTestId('sustain-pedal-indicator-label')).toHaveTextContent('Released')

        expect(mockStyledSustainPedalIndicator).toHaveBeenCalledWith(
            expect.objectContaining({
                $pressed: false,
            })
        )

        expect(mockSustainPedalIndicatorSpace).toHaveBeenCalledWith(
            expect.objectContaining({
                style: {
                    background: '#bfbfbf',
                },
            })
        )

        expect(mockSustainPedalIndicatorLabel).toHaveBeenCalledWith(
            expect.objectContaining({
                style: {
                    color: '#595959',
                },
            })
        )
    })

    it('renders all structural elements', () => {
        render(<SustainPedalIndicator pressed={true} />)

        expect(screen.getByTestId('sustain-pedal-indicator')).toBeInTheDocument()
        expect(screen.getByTestId('sustain-pedal-indicator-title')).toBeInTheDocument()
        expect(screen.getByTestId('sustain-pedal-indicator-container')).toBeInTheDocument()
        expect(screen.getByTestId('sustain-pedal-indicator-space')).toBeInTheDocument()
        expect(screen.getByTestId('sustain-pedal-indicator-label')).toBeInTheDocument()
    })
})
