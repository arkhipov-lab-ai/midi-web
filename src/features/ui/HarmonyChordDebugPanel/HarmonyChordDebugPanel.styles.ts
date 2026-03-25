import styled from 'styled-components'
import {Collapse, Typography} from 'antd'

export const HarmonyChordDebugPanel = styled(Collapse)`
    width: 100%;
`

export const DebugPre = styled(Typography.Text)`
    && {
        display: block;
        white-space: pre-wrap;
        font-family: monospace;
    }
`
