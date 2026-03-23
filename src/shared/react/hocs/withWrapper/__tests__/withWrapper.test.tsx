import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {withWrapper} from '../withWrapper'

describe('withWrapper', () => {
    it('renders wrapper and component with props', () => {
        const Wrapper = ({children, ...props}) => <div data-testid='wrapper' {...props}>{children}</div>
        const Component = ({text}) => <span data-testid='component'>{text}</span>
        const Wrapped = withWrapper(Wrapper)(Component)
        const {getByTestId} = render(<Wrapped text='hello'/>)
        expect(getByTestId('wrapper')).toBeInTheDocument()
        expect(getByTestId('component')).toBeInTheDocument()
        expect(getByTestId('component').textContent).toBe('hello')
    })

    it('passes props to wrapper and component', () => {
        const Wrapper = ({children, title}) => <section data-testid='wrapper' title={title}>{children}</section>
        const Component = ({title}) => <p data-testid='component'>{title}</p>
        const Wrapped = withWrapper(Wrapper)(Component)
        const {getByTestId} = render(<Wrapped title='test title'/>)
        expect(getByTestId('wrapper').getAttribute('title')).toBe('test title')
        expect(getByTestId('component').textContent).toBe('test title')
    })
})
