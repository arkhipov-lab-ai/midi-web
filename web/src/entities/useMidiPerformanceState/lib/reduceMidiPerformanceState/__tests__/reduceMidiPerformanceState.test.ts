import {reduceMidiPerformanceState} from '../reduceMidiPerformanceState'
import {INITIAL_MIDI_PERFORMANCE_STATE} from '../../constants'
import {
    SUSTAIN_CONTROLLER,
    SUSTAIN_ON_THRESHOLD,
} from '@shared/lib'

describe('reduceMidiPerformanceState', () => {
    it('adds note to pressedNotes on noteon', () => {
        const state = INITIAL_MIDI_PERFORMANCE_STATE

        const result = reduceMidiPerformanceState(state, {
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

        expect(result).toEqual({
            pressedNotes: {60: 100},
            sustainedNotes: {},
            sustainPressed: false,
        })
    })

    it('removes note from sustainedNotes when noteon happens for same midi', () => {
        const state = {
            pressedNotes: {},
            sustainedNotes: {60: 80, 64: 90},
            sustainPressed: true,
        }

        const result = reduceMidiPerformanceState(state, {
            type: 'noteon',
            channel: 1,
            data1: 60,
            data2: 110,
            note: 60,
            velocity: 110,
            controller: null,
            value: null,
            raw: [144, 60, 110],
        })

        expect(result).toEqual({
            pressedNotes: {60: 110},
            sustainedNotes: {64: 90},
            sustainPressed: true,
        })
    })

    it('treats noteon with velocity 0 as noteoff', () => {
        const state = {
            pressedNotes: {60: 100},
            sustainedNotes: {},
            sustainPressed: false,
        }

        const result = reduceMidiPerformanceState(state, {
            type: 'noteon',
            channel: 1,
            data1: 60,
            data2: 0,
            note: 60,
            velocity: 0,
            controller: null,
            value: null,
            raw: [144, 60, 0],
        })

        expect(result).toEqual({
            pressedNotes: {},
            sustainedNotes: {},
            sustainPressed: false,
        })
    })

    it('removes note from pressedNotes and sustainedNotes on noteoff when sustain is not pressed', () => {
        const state = {
            pressedNotes: {60: 100, 64: 90},
            sustainedNotes: {60: 70, 67: 80},
            sustainPressed: false,
        }

        const result = reduceMidiPerformanceState(state, {
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

        expect(result).toEqual({
            pressedNotes: {64: 90},
            sustainedNotes: {67: 80},
            sustainPressed: false,
        })
    })

    it('moves note to sustainedNotes on noteoff when sustain is pressed', () => {
        const state = {
            pressedNotes: {60: 100, 64: 90},
            sustainedNotes: {},
            sustainPressed: true,
        }

        const result = reduceMidiPerformanceState(state, {
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

        expect(result).toEqual({
            pressedNotes: {64: 90},
            sustainedNotes: {60: 100},
            sustainPressed: true,
        })
    })

    it('keeps sustainedNotes unchanged on noteoff with sustain pressed when current velocity is 0', () => {
        const state = {
            pressedNotes: {},
            sustainedNotes: {67: 80},
            sustainPressed: true,
        }

        const result = reduceMidiPerformanceState(state, {
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

        expect(result).toEqual({
            pressedNotes: {},
            sustainedNotes: {67: 80},
            sustainPressed: true,
        })
    })

    it('uses velocity from sustainedNotes when moving note on noteoff with sustain pressed', () => {
        const state = {
            pressedNotes: {},
            sustainedNotes: {60: 55},
            sustainPressed: true,
        }

        const result = reduceMidiPerformanceState(state, {
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

        expect(result).toEqual({
            pressedNotes: {},
            sustainedNotes: {60: 55},
            sustainPressed: true,
        })
    })

    it('sets sustainPressed to true on controlchange at threshold', () => {
        const state = INITIAL_MIDI_PERFORMANCE_STATE

        const result = reduceMidiPerformanceState(state, {
            type: 'controlchange',
            channel: 1,
            data1: SUSTAIN_CONTROLLER,
            data2: SUSTAIN_ON_THRESHOLD,
            note: null,
            velocity: null,
            controller: SUSTAIN_CONTROLLER,
            value: SUSTAIN_ON_THRESHOLD,
            raw: [176, SUSTAIN_CONTROLLER, SUSTAIN_ON_THRESHOLD],
        })

        expect(result).toEqual({
            pressedNotes: {},
            sustainedNotes: {},
            sustainPressed: true,
        })
    })

    it('sets sustainPressed to false and clears sustainedNotes on controlchange below threshold', () => {
        const state = {
            pressedNotes: {60: 100},
            sustainedNotes: {64: 80, 67: 90},
            sustainPressed: true,
        }

        const result = reduceMidiPerformanceState(state, {
            type: 'controlchange',
            channel: 1,
            data1: SUSTAIN_CONTROLLER,
            data2: SUSTAIN_ON_THRESHOLD - 1,
            note: null,
            velocity: null,
            controller: SUSTAIN_CONTROLLER,
            value: SUSTAIN_ON_THRESHOLD - 1,
            raw: [176, SUSTAIN_CONTROLLER, SUSTAIN_ON_THRESHOLD - 1],
        })

        expect(result).toEqual({
            pressedNotes: {60: 100},
            sustainedNotes: {},
            sustainPressed: false,
        })
    })

    it('returns same state for unrelated controlchange message', () => {
        const state = {
            pressedNotes: {60: 100},
            sustainedNotes: {64: 80},
            sustainPressed: true,
        }

        const result = reduceMidiPerformanceState(state, {
            type: 'controlchange',
            channel: 1,
            data1: 1,
            data2: 127,
            note: null,
            velocity: null,
            controller: 1,
            value: 127,
            raw: [176, 1, 127],
        })

        expect(result).toBe(state)
    })

    it('returns same state for other message type', () => {
        const state = {
            pressedNotes: {60: 100},
            sustainedNotes: {},
            sustainPressed: false,
        }

        const result = reduceMidiPerformanceState(state, {
            type: 'other',
            channel: 1,
            data1: 10,
            data2: 20,
            note: null,
            velocity: null,
            controller: null,
            value: null,
            raw: [1, 10, 20],
        })

        expect(result).toBe(state)
    })
})
