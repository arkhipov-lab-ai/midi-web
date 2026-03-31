import {composeProviders} from '@shared/react'
import {ErrorBoundary} from '@processes/ErrorBoundary'
import {AppLayout} from '@uikit/ui'

export const withProviders = composeProviders(
    ErrorBoundary,
    AppLayout,
)
