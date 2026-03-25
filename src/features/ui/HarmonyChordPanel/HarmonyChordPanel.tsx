import React from 'react'
import {Typography} from 'antd'
import {DetectedChordInfo} from '@shared/lib'
import {
    CopyDebugButton,
    HarmonyChordMeta,
    HarmonyChordPanel as StyledHarmonyChordPanel,
    HarmonyChordResultRow,
    HarmonyChordValue,
} from './HarmonyChordPanel.styles'

const {Text} = Typography

interface HarmonyChordPanelProps {
    chord: DetectedChordInfo | null
    debugText: string
    onCopyDebug: () => void
}

export const HarmonyChordPanel: React.FC<HarmonyChordPanelProps> = (props) => {

    const {
        chord,
        debugText,
        onCopyDebug,
    } = props

    return (
        <StyledHarmonyChordPanel
            orientation='vertical'
            size='middle'
        >
            <HarmonyChordResultRow>
                <Text strong>Detected chord:</Text>

                <HarmonyChordValue level={4}>
                    {chord?.symbol ?? 'Not detected'}
                </HarmonyChordValue>
            </HarmonyChordResultRow>

            <HarmonyChordMeta type='secondary'>
                Type: {chord?.type ?? '-'}
            </HarmonyChordMeta>

            <HarmonyChordMeta type='secondary'>
                Confidence: {chord?.confidence?.toFixed(3) ?? '-'}
            </HarmonyChordMeta>

            <CopyDebugButton
                onClick={onCopyDebug}
            >
                Copy chord debug
            </CopyDebugButton>

            <Text type='secondary'>
                Debug text length: {debugText.length}
            </Text>
        </StyledHarmonyChordPanel>
    )
}
