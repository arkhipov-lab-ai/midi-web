import {act, renderHook} from '@testing-library/react'
import {useMidiPerformanceState} from '../useMidiPerformanceState'

describe('useMidiPerformanceState', () => {
    it('returns initial state', () => {
        const {result} = renderHook(() => useMidiPerformanceState())

        expect(result.current.activeNotes).toEqual({})
        expect(result.current.sustainPressed).toBe(false)
        expect(typeof result.current.handleMidiMessage).toBe('function')
    })

    it('adds note to activeNotes on noteon', () => {
        const {result} = renderHook(() => useMidiPerformanceState())

        act(() => {
            result.current.handleMidiMessage({
                type: 'noteon',
                channel: 1,
                data1: 60,
                data2: 100,
                note: 60,
                velocity: 100,
                controller: null,
                value: null,
                raw: [144, 60, 100],
            })
        })

        expect(result.current.activeNotes).toEqual({60: 100})
        expect(result.current.sustainPressed).toBe(false)
    })

    it('removes note from activeNotes on noteoff when sustain is not pressed', () => {
        const {result} = renderHook(() => useMidiPerformanceState())

        act(() => {
            result.current.handleMidiMessage({
                type: 'noteon',
                channel: 1,
                data1: 60,
                data2: 100,
                note: 60,
                velocity: 100,
                controller: null,
                value: null,
                raw: [144, 60, 100],
            })
        })

        act(() => {
            result.current.handleMidiMessage({
                type: 'noteoff',
                channel: 1,
                data1: 60,
                data2: 64,
                note: 60,
                velocity: 64,
                controller: null,
                value: null,
                raw: [128, 60, 64],
            })
        })

        expect(result.current.activeNotes).toEqual({})
        expect(result.current.sustainPressed).toBe(false)
    })

    it('keeps note active after noteoff when sustain is pressed', () => {
        const {result} = renderHook(() => useMidiPerformanceState())

        act(() => {
            result.current.handleMidiMessage({
                type: 'noteon',
                channel: 1,
                data1: 60,
                data2: 100,
                note: 60,
                velocity: 100,
                controller: null,
                value: null,
                raw: [144, 60, 100],
            })
        })

        act(() => {
            result.current.handleMidiMessage({
                type: 'controlchange',
                channel: 1,
                data1: 64,
                data2: 127,
                note: null,
                velocity: null,
                controller: 64,
                value: 127,
                raw: [176, 64, 127],
            })
        })

        act(() => {
            result.current.handleMidiMessage({
                type: 'noteoff',
                channel: 1,
                data1: 60,
                data2: 64,
                note: 60,
                velocity: 64,
                controller: null,
                value: null,
                raw: [128, 60, 64],
            })
        })

        expect(result.current.activeNotes).toEqual({60: 100})
        expect(result.current.sustainPressed).toBe(true)
    })

    it('clears sustained notes when sustain pedal is released', () => {
        const {result} = renderHook(() => useMidiPerformanceState())

        act(() => {
            result.current.handleMidiMessage({
                type: 'noteon',
                channel: 1,
                data1: 60,
                data2: 100,
                note: 60,
                velocity: 100,
                controller: null,
                value: null,
                raw: [144, 60, 100],
            })
        })

        act(() => {
            result.current.handleMidiMessage({
                type: 'controlchange',
                channel: 1,
                data1: 64,
                data2: 127,
                note: null,
                velocity: null,
                controller: 64,
                value: 127,
                raw: [176, 64, 127],
            })
        })

        act(() => {
            result.current.handleMidiMessage({
                type: 'noteoff',
                channel: 1,
                data1: 60,
                data2: 64,
                note: 60,
                velocity: 64,
                controller: null,
                value: null,
                raw: [128, 60, 64],
            })
        })

        act(() => {
            result.current.handleMidiMessage({
                type: 'controlchange',
                channel: 1,
                data1: 64,
                data2: 0,
                note: null,
                velocity: null,
                controller: 64,
                value: 0,
                raw: [176, 64, 0],
            })
        })

        expect(result.current.activeNotes).toEqual({})
        expect(result.current.sustainPressed).toBe(false)
    })

    it('handles multiple notes and keeps pressed note priority over sustained note', () => {
        const {result} = renderHook(() => useMidiPerformanceState())

        act(() => {
            result.current.handleMidiMessage({
                type: 'noteon',
                channel: 1,
                data1: 60,
                data2: 90,
                note: 60,
                velocity: 90,
                controller: null,
                value: null,
                raw: [144, 60, 90],
            })
            result.current.handleMidiMessage({
                type: 'noteon',
                channel: 1,
                data1: 64,
                data2: 110,
                note: 64,
                velocity: 110,
                controller: null,
                value: null,
                raw: [144, 64, 110],
            })
            result.current.handleMidiMessage({
                type: 'controlchange',
                channel: 1,
                data1: 64,
                data2: 127,
                note: null,
                velocity: null,
                controller: 64,
                value: 127,
                raw: [176, 64, 127],
            })
            result.current.handleMidiMessage({
                type: 'noteoff',
                channel: 1,
                data1: 60,
                data2: 0,
                note: 60,
                velocity: 0,
                controller: null,
                value: null,
                raw: [128, 60, 0],
            })
        })

        expect(result.current.activeNotes).toEqual({
            60: 90,
            64: 110,
        })
        expect(result.current.sustainPressed).toBe(true)
    })

    it('ignores unrelated message type', () => {
        const {result} = renderHook(() => useMidiPerformanceState())

        act(() => {
            result.current.handleMidiMessage({
                type: 'other',
                channel: 1,
                data1: 1,
                data2: 2,
                note: null,
                velocity: null,
                controller: null,
                value: null,
                raw: [1, 2, 3],
            })
        })

        expect(result.current.activeNotes).toEqual({})
        expect(result.current.sustainPressed).toBe(false)
    })
})
