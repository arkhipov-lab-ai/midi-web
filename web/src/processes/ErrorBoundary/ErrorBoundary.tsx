import React from 'react'
import {ErrorBoundary as ErrorBoundaryBase} from '@shared/ui'
import {ErrorNode} from './components'

export const ErrorBoundary: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    return (
        <ErrorBoundaryBase
            errorNode={<ErrorNode/>}
        >
            {children}
        </ErrorBoundaryBase>
    )
}
