import React from 'react'
import {ChordAnalysisDebugData} from '@shared/lib'
import {
    DebugPre,
    HarmonyChordDebugPanel as StyledHarmonyChordDebugPanel,
} from './HarmonyChordDebugPanel.styles'

interface HarmonyChordDebugPanelProps {
    debug: ChordAnalysisDebugData
    debugText: string
}

export const HarmonyChordDebugPanel: React.FC<HarmonyChordDebugPanelProps> = (props) => {

    const {
        debug,
        debugText,
    } = props

    return (
        <StyledHarmonyChordDebugPanel
            items={[
                {
                    key: 'summary',
                    label: `Chord debug summary (${debug.candidates.length} candidates)`,
                    children: (
                        <DebugPre>
                            {debugText}
                        </DebugPre>
                    ),
                },
            ]}
        />
    )
}
