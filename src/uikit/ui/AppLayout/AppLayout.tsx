import React from 'react'
import {AppLayout as StyledAppLayout} from './AppLayout.styles'

export const AppLayout: React.FC<React.PropsWithChildren> = ({children}) => {
    return (
        <StyledAppLayout>
            {children}
        </StyledAppLayout>
    )
}
