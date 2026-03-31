import React from 'react'

export type ReactHOC<WrapperProps extends React.PropsWithChildren<{}> = React.PropsWithChildren<{}>> = <ComponentProps>(
    Component: React.FC<React.PropsWithChildren<ComponentProps>>,
) => React.FC<ComponentProps & WrapperProps>
