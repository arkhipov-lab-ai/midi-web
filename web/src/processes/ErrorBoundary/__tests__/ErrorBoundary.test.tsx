import React from 'react'
import {render, screen} from '@testing-library/react'
import {ErrorBoundary} from '../ErrorBoundary'

const mockErrorBoundaryBase = jest.fn()

jest.mock('@shared/ui', () => ({
    ErrorBoundary: (props: any) => {
        mockErrorBoundaryBase(props)
        return <div data-testid='error-boundary-base'>{props.children}</div>
    },
}))

jest.mock('../components', () => ({
    ErrorNode: () => <div data-testid='error-node'>Error node</div>,
}))

describe('ErrorBoundary (wrapper)', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders children inside ErrorBoundaryBase', () => {
        render(
            <ErrorBoundary>
                <div>Child content</div>
            </ErrorBoundary>
        )

        expect(screen.getByText('Child content')).toBeInTheDocument()
        expect(screen.getByTestId('error-boundary-base')).toBeInTheDocument()
    })

    it('passes ErrorNode as errorNode prop to ErrorBoundaryBase', () => {
        render(
            <ErrorBoundary>
                <div>Child</div>
            </ErrorBoundary>
        )

        expect(mockErrorBoundaryBase).toHaveBeenCalledWith(
            expect.objectContaining({
                errorNode: expect.any(Object),
            })
        )
    })

    it('renders provided children correctly', () => {
        render(
            <ErrorBoundary>
                <span>Test</span>
            </ErrorBoundary>
        )

        expect(screen.getByText('Test')).toBeInTheDocument()
    })
})
