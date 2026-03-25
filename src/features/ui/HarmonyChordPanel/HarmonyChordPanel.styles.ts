import styled from 'styled-components'
import {Space, Typography, Button} from 'antd'

export const HarmonyChordPanel = styled(Space)`
    width: 100%;
`

export const HarmonyChordResultRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

export const HarmonyChordValue = styled(Typography.Title)`
    && {
        margin: 0;
    }
`

export const HarmonyChordMeta = styled(Typography.Text)`
    && {
        display: block;
    }
`

export const CopyDebugButton = styled(Button)`
    && {
        width: fit-content;
    }
`
