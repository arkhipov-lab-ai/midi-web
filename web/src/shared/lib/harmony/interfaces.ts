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
    qualityDependsOnThird?: boolean
    isIncompleteVoicingTemplate?: boolean
    omissionLabelMode?: 'none' | 'no3' | 'no5'
}

export interface DetectedChordInfo {
    root: string
    type: string
    symbol: string
    confidence: number | null
    bass: string | null
    isSlashChord: boolean
    isOmissionLabel?: boolean
    omissionType?: 'no3' | 'no5' | null
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
    missingThirdPenalty: number
    incompleteVoicingBonus: number
    omissionBonus: number
    omissionPenalty: number
    finalScore: number
    powerChordPenalty: number
    exactOmissionShellBonus: number
    incompleteConfidenceFactor: number
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
    alternatives: ChordAlternativeInfo[]
    ambiguity: ChordAmbiguityInfo | null
}

export interface NormalizedActiveNotes {
    midiNotes: number[]
    pitchClasses: number[]
    weightedPitchClasses: WeightedPitchClass[]
    bassMidiNote: number | null
    bassPitchClass: number | null
}

export type ChordAlternativeRelation =
    | 'equivalent-quality'
    | 'inversion-or-slash'
    | 'same-root-subset'
    | 'same-root-extension'
    | 'enharmonic-reinterpretation'
    | 'competing-analysis'

export interface ChordAlternativeInfo {
    symbol: string
    type: string
    root: string
    bass: string | null
    isSlashChord: boolean
    score: number
    confidence: number | null
    relationToSelected: ChordAlternativeRelation
}

export interface ChordAmbiguityInfo {
    isAmbiguous: boolean
    level: 'low' | 'medium' | 'high'
    reason:
        | 'close_scores'
        | 'equivalent_spelling'
        | 'context_dependent_naming'
        | 'incomplete_voicing'
        | 'multiple_valid_structures'
        | null
    primaryAlternatives: string[]
}
