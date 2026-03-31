import React from 'react'

type ErrorNodeRender = (error: string | null) => React.ReactNode

interface ErrorBoundaryProps extends React.PropsWithChildren<{}> {
    errorNode?: React.ReactNode | ErrorNodeRender
}

type ErrorBoundaryState = {
    error: string | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

    static displayName = 'ErrorBoundary'

    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = {error: null}
    }

    static getDerivedStateFromError(error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return { error: message }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error({error, errorInfo})
    }

    render() {
        if (this.state.error) {
            if (this.props.errorNode) {
                if (typeof this.props.errorNode === 'function') {
                    return (this.props.errorNode as ErrorNodeRender)(this.state.error)
                }
                return this.props.errorNode
            }
            return (
                <>Something went wrong</>
            )
        }
        return this.props.children
    }
}
