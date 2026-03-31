import React from 'react'
import {render, screen,} from '@testing-library/react'
import {ErrorBoundary,} from '../ErrorBoundary'

describe('ErrorBoundary', () => {

    const Throwing = ({msg,}: {msg:string}) => {
        throw new Error(msg)
    }

    it('renders children when no error', () => {
        render(
            <ErrorBoundary>
                <div>ok</div>
            </ErrorBoundary>
        )
        expect(screen.getByText('ok')).toBeInTheDocument()
    })

    it('renders default message when error thrown and no errorNode', () => {
        const consoleSpy = jest.spyOn(console,'error').mockImplementation(() => {})
        render(
            <ErrorBoundary>
                <Throwing msg='fail'/>
            </ErrorBoundary>
        )
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
        consoleSpy.mockRestore()
    })

    it('renders custom ReactNode when errorNode is node', () => {
        const consoleSpy = jest.spyOn(console,'error').mockImplementation(() => {})
        render(
            <ErrorBoundary errorNode={<div>Custom error</div>}>
                <Throwing msg='oops'/>
            </ErrorBoundary>
        )
        expect(screen.getByText('Custom error')).toBeInTheDocument()
        consoleSpy.mockRestore()
    })

    it('renders via function when errorNode is function', () => {
        const consoleSpy = jest.spyOn(console,'error').mockImplementation(() => {})
        const nodeFn = jest.fn((err:string|null)=><div>{`Error: ${err}`}</div>)
        render(
            <ErrorBoundary errorNode={nodeFn}>
                <Throwing msg='boom'/>
            </ErrorBoundary>
        )
        expect(nodeFn).toHaveBeenCalledWith('boom')
        expect(screen.getByText('Error: boom')).toBeInTheDocument()
        consoleSpy.mockRestore()
    })
})
