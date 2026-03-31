import {getPitchClassName} from '@shared/lib'
import {ChordAnalysisDebugData} from '@shared/lib'

export function formatChordDebugText(data: ChordAnalysisDebugData): string {
    const pitchClassText = data.inputPitchClasses
        .map((pitchClass) => `${pitchClass}(${getPitchClassName(pitchClass)})`)
        .join(', ')

    const bassPitchClassText = data.bassPitchClass !== null
        ? `${data.bassPitchClass}(${getPitchClassName(data.bassPitchClass)})`
        : 'null'

    const candidatesText = data.candidates
        .map((candidate, index) => {
            const breakdown = candidate.breakdown

            return [
                `${index + 1}. ${candidate.symbol}`,
                `type=${candidate.type}`,
                `root=${candidate.root}`,
                `bass=${candidate.bass ?? '-'}`,
                `slash=${candidate.isSlashChord ? 'yes' : 'no'}`,
                `score=${candidate.score}`,
                `priority=${candidate.priority}`,
                `matched=${breakdown.matched}`,
                `missing=${breakdown.missing}`,
                `extra=${breakdown.extra}`,
                `matchedRequired=${breakdown.matchedRequired}`,
                `missingRequired=${breakdown.missingRequired}`,
                `matchedOptional=${breakdown.matchedOptional}`,
                `missingOmittable=${breakdown.missingOmittable}`,
                `matchedSignature=${breakdown.matchedSignature}`,
                `missingSignature=${breakdown.missingSignature}`,
                `heuristic=${breakdown.heuristicScore}`,
                `rootOwnershipBonus=${breakdown.rootOwnershipBonus}`,
                `slashPenalty=${breakdown.slashPenalty}`,
                `secondaryRootPenalty=${breakdown.secondaryRootPenalty}`,
                `simplicityBonus=${breakdown.simplicityBonus}`,
                `inputCoverageBonus=${breakdown.inputCoverageBonus}`,
                `underExplainingPenalty=${breakdown.underExplainingPenalty}`,
                `missingThirdPenalty=${breakdown.missingThirdPenalty}`,
                `incompleteVoicingBonus=${breakdown.incompleteVoicingBonus}`,
                `omissionBonus=${breakdown.omissionBonus}`,
                `omissionPenalty=${breakdown.omissionPenalty}`,
                `final=${breakdown.finalScore}`,
                `powerChordPenalty=${breakdown.powerChordPenalty}`,
                `exactOmissionShellBonus=${breakdown.exactOmissionShellBonus}`,
                `incompleteConfidenceFactor=${breakdown.incompleteConfidenceFactor}`,
            ].join(' | ')
        })
        .join('\n')

    const alternatives = data.alternatives ?? []
    const ambiguity = data.ambiguity ?? null

    const alternativesText = alternatives.length > 0
        ? alternatives
            .map((alternative, index) => [
                `${index + 1}. ${alternative.symbol}`,
                `type=${alternative.type}`,
                `root=${alternative.root}`,
                `bass=${alternative.bass ?? '-'}`,
                `slash=${alternative.isSlashChord ? 'yes' : 'no'}`,
                `score=${alternative.score}`,
                `confidence=${alternative.confidence ?? 'null'}`,
            ].join(' | '))
            .join('\n')
        : 'No alternatives'

    return [
        'CHORD DEBUG',
        `input midi notes: [${data.inputMidiNotes.join(', ')}]`,
        `input pitch classes: [${pitchClassText}]`,
        `bass midi: ${data.bassMidiNote ?? 'null'}`,
        `bass pitch class: ${bassPitchClassText}`,
        '',
        'selected:',
        `symbol: ${data.selected?.symbol ?? 'Not detected'}`,
        `type: ${data.selected?.type ?? 'Not detected'}`,
        `confidence: ${data.selected?.confidence ?? 'null'}`,
        '',
        'ambiguity:',
        `isAmbiguous: ${ambiguity?.isAmbiguous ?? false}`,
        `level: ${ambiguity?.level ?? 'low'}`,
        `reason: ${ambiguity?.reason ?? 'null'}`,
        `primaryAlternatives: [${ambiguity?.primaryAlternatives?.join(', ') ?? ''}]`,
        '',
        'alternatives:',
        alternativesText,
        '',
        'top candidates:',
        candidatesText || 'No candidates',
    ].join('\n')
}
