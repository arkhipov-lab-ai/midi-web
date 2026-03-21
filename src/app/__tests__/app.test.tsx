import {render, screen} from '@testing-library/react'
import {App} from '../app'

describe('App', () => {
    it('renders app text', () => {
        render(<App/>)

        expect(screen.getByText(/app/i)).toBeInTheDocument()
    })
})
