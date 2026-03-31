import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {composeProviders} from '../composeProviders'

describe('composeProviders', () => {
    it('wraps component with a single provider', () => {
        const Provider = ({children}) => <div data-testid='provider'>{children}</div>
        const Component = () => <span data-testid='component'>content</span>
        const Wrapped = composeProviders(Provider)(Component)
        const {getByTestId} = render(<Wrapped/>)
        expect(getByTestId('provider')).toBeInTheDocument()
        expect(getByTestId('component')).toBeInTheDocument()
    })

    it('wraps component with multiple providers in correct order', () => {
        const ProviderA = ({children}) => <div data-testid='provider-a'>{children}</div>
        const ProviderB = ({children}) => <section data-testid='provider-b'>{children}</section>
        const Component = () => <p data-testid='component'>text</p>
        const Wrapped = composeProviders(ProviderA, ProviderB)(Component)
        const {getByTestId} = render(<Wrapped/>)
        const outer = getByTestId('provider-a')
        const middle = getByTestId('provider-b')
        const inner = getByTestId('component')
        expect(outer).toContainElement(middle)
        expect(middle).toContainElement(inner)
    })

    it('passes props through all providers to component', () => {
        const Provider = ({title, children}) => <div data-testid='provider' title={title}>{children}</div>
        const Component = ({title}) => <span data-testid='component'>{title}</span>
        const Wrapped = composeProviders(Provider)(Component)
        const {getByTestId} = render(<Wrapped title='hello'/>)
        expect(getByTestId('provider').getAttribute('title')).toBe('hello')
        expect(getByTestId('component').textContent).toBe('hello')
    })
})
