import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {HarmonyChordPanel} from '../HarmonyChordPanel'

describe('HarmonyChordPanel', () => {
    it('renders detected chord and handles copy click', async () => {
        const onCopyDebug = jest.fn()
        const user = userEvent.setup()

        render(
            <HarmonyChordPanel
                chord={{
                    root: 'C',
                    type: 'major',
                    symbol: 'C',
                    confidence: 0.91,
                    bass: null,
                    isSlashChord: false,
                }}
                debugText='debug'
                onCopyDebug={onCopyDebug}
            />,
        )

        expect(screen.getByText('C')).toBeInTheDocument()
        expect(screen.getByText(/Type: major/i)).toBeInTheDocument()

        await user.click(screen.getByRole('button', {name: /copy chord debug/i}))

        expect(onCopyDebug).toHaveBeenCalledTimes(1)
    })

    it('renders not detected state', () => {
        render(
            <HarmonyChordPanel
                chord={null}
                debugText='debug'
                onCopyDebug={jest.fn()}
            />,
        )

        expect(screen.getByText('Not detected')).toBeInTheDocument()
    })
})
