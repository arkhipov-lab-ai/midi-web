import styled, {css} from 'styled-components'
import {Space} from 'antd'

export const SustainPedalIndicator = styled(Space)<{$pressed: boolean}>`
  min-width: 7rem;
  border: 1px solid #d9d9d9;
  border-radius: var(--rd-md);
  padding: var(--pd-md);
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.75rem;

  ${({$pressed}) => css`
    background: ${$pressed ? '#c7c7c7' : '#ffffff'};
  `}
`

export const SustainPedalIndicatorTitle = styled(Space)`
  font-size: var(--font-size-md);
  font-weight: var(--fw-600);
  color: #262626;
`

export const SustainPedalIndicatorContainer = styled(Space)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const SustainPedalIndicatorSpace = styled(Space)`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 1px solid #8c8c8c;
`

export const SustainPedalIndicatorLabel = styled.span`
  font-weight: var(--fw-500);
`
