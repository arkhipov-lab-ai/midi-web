import React from 'react'
import {ReactHOC} from '@shared/react'

export type WithWrapper = <WrapperProps extends React.PropsWithChildren<{}>>(
    Wrapper: React.FC<WrapperProps>,
) => ReactHOC<WrapperProps>
