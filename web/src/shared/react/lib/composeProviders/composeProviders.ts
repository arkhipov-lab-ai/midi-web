import React from 'react'
import {compose} from '@core/lib'
import {withWrapper} from '../../hocs'

export function composeProviders(...providers: React.FC<React.PropsWithChildren<{}>>[]) {
    return compose(...(providers.map(provider => withWrapper(provider))))
}
