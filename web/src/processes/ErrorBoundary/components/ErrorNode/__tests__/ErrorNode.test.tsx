import React from 'react'
import {render, screen} from '@testing-library/react'
import {ErrorNode} from '../ErrorNode'

const mockSpace = jest.fn()
const mockCard = jest.fn()

jest.mock('antd', () => ({
    Space: (props: any) => {
        mockSpace(props)
        return <div data-testid='space'>{props.children}</div>
    },
    Card: (props: any) => {
        mockCard(props)
        return <div data-testid='card'>{props.children}</div>
    },
    Typography: {
        Title: ({children}: any) => <h2>{children}</h2>,
        Text: ({children}: any) => <span>{children}</span>,
    },
}))

describe('ErrorNode', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders error title and message', () => {
        render(<ErrorNode/>)

        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
        expect(screen.getByText('Please refresh the page')).toBeInTheDocument()
    })

    it('passes correct props to outer Space', () => {
        render(<ErrorNode/>)

        expect(mockSpace).toHaveBeenCalledWith(
            expect.objectContaining({
                orientation: 'vertical',
                size: 'large',
                align: 'center',
                style: {
                    width: '100vw',
                    height: '100vh',
                },
            })
        )
    })

    it('passes correct props to inner Space', () => {
        render(<ErrorNode/>)

        expect(mockSpace).toHaveBeenCalledWith(
            expect.objectContaining({
                orientation: 'vertical',
                size: 'middle',
                style: {
                    width: '100%',
                },
            })
        )
    })

    it('passes correct props to Title', () => {
        render(<ErrorNode/>)

        const title = screen.getByText('Something went wrong')
        expect(title.tagName).toBe('H2')
    })
})
