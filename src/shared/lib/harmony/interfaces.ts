export type ScaleType = 'major' | 'minor'

export interface WeightedPitchClass {
    pitchClass: number
    weight: number
}

export interface ChordTemplate {
    type: string
    intervals: number[]
    requiredIntervals?: number[]
    optionalIntervals?: number[]
    omittableIntervals?: number[]
    signatureIntervals?: number[]
    symbolSuffix: string
    priority: number
    category?: 'triad' | 'seventh' | 'extended'
    requiresSeventh?: boolean
}

export interface DetectedChordInfo {
    root: string
    type: string
    symbol: string
    confidence: number | null
    bass: string | null
    isSlashChord: boolean
}

export interface ChordScoreBreakdown {
    matched: number
    missing: number
    extra: number
    matchedRequired: number
    missingRequired: number
    matchedOptional: number
    missingOmittable: number
    matchedSignature: number
    missingSignature: number
    heuristicScore: number
    slashPenalty: number
    rootOwnershipBonus: number
    secondaryRootPenalty: number
    simplicityBonus: number
    inputCoverageBonus: number
    underExplainingPenalty: number
    finalScore: number
}

export interface ChordCandidateDebugItem {
    symbol: string
    type: string
    root: string
    bass: string | null
    isSlashChord: boolean
    score: number
    priority: number
    breakdown: ChordScoreBreakdown
}

export interface ChordAnalysisDebugData {
    inputMidiNotes: number[]
    inputPitchClasses: number[]
    bassMidiNote: number | null
    bassPitchClass: number | null
    candidates: ChordCandidateDebugItem[]
    selected: DetectedChordInfo | null
}

export interface NormalizedActiveNotes {
    midiNotes: number[]
    pitchClasses: number[]
    weightedPitchClasses: WeightedPitchClass[]
    bassMidiNote: number | null
    bassPitchClass: number | null
}
