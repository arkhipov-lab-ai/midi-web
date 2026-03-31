import React from 'react'
import {render, screen} from '@testing-library/react'
import {AppLayout} from '../AppLayout'

describe('AppLayout', () => {
    it('renders children', () => {
        render(
            <AppLayout>
                <div>Test content</div>
            </AppLayout>
        )

        expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('applies expected inline styles to root container', () => {
        const {container} = render(
            <AppLayout>
                <div>Test content</div>
            </AppLayout>
        )

        expect(container.firstChild).toHaveStyle({
            padding: 'var(--pd-xl)',
            maxWidth: '75rem',
            margin: '0 auto',
        })
    })

    it('renders multiple children', () => {
        render(
            <AppLayout>
                <div>First</div>
                <div>Second</div>
            </AppLayout>
        )

        expect(screen.getByText('First')).toBeInTheDocument()
        expect(screen.getByText('Second')).toBeInTheDocument()
    })
})
