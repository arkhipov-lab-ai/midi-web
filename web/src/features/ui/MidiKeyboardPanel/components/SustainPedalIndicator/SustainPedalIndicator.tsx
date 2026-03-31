import React from 'react'
import {
    SustainPedalIndicator as StyledSustainPedalIndicator,
    SustainPedalIndicatorTitle,
    SustainPedalIndicatorContainer,
    SustainPedalIndicatorSpace,
    SustainPedalIndicatorLabel,
} from './SustainPedalIndicator.styles'

interface SustainPedalIndicatorProps {
    pressed: boolean
}

export const SustainPedalIndicator: React.FC<SustainPedalIndicatorProps> = (props) => {

    const {
        pressed,
    } = props

    const indicatorColor = pressed ? '#52c41a' : '#bfbfbf'
    const textColor = pressed ? '#135200' : '#595959'
    const label = pressed ? 'Pressed' : 'Released'

    return (
        <StyledSustainPedalIndicator
            $pressed={pressed}
        >
            <SustainPedalIndicatorTitle>
                Sustain pedal
            </SustainPedalIndicatorTitle>

            <SustainPedalIndicatorContainer>
                <SustainPedalIndicatorSpace
                    style={{
                        background: indicatorColor,
                    }}
                />

                <SustainPedalIndicatorLabel
                    style={{
                        color: textColor,
                    }}
                >
                    {label}
                </SustainPedalIndicatorLabel>
            </SustainPedalIndicatorContainer>
        </StyledSustainPedalIndicator>
    )
}
