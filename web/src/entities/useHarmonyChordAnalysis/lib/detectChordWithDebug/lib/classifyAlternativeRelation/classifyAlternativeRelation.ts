import {ChordAlternativeRelation} from '@shared/lib'

interface ClassifyAlternativeRelationOptions {
    selectedSymbol: string
    selectedType: string
    selectedRoot: string
    selectedBass: string | null
    selectedIsSlashChord: boolean
    alternativeSymbol: string
    alternativeType: string
    alternativeRoot: string
    alternativeBass: string | null
    alternativeIsSlashChord: boolean
}

function stripOmission(symbol: string): string {
    return symbol.replace(/\(no3\)|\(no5\)/g, '')
}

export function classifyAlternativeRelation(options: ClassifyAlternativeRelationOptions): ChordAlternativeRelation {
    const {
        selectedSymbol,
        selectedType,
        selectedRoot,
        selectedBass,
        selectedIsSlashChord,
        alternativeSymbol,
        alternativeType,
        alternativeRoot,
        alternativeBass,
        alternativeIsSlashChord,
    } = options

    const normalizedSelected = stripOmission(selectedSymbol)
    const normalizedAlternative = stripOmission(alternativeSymbol)

    if (selectedRoot === alternativeRoot) {
        if (selectedType === alternativeType) {
            return 'equivalent-quality'
        }

        const selectedBase = normalizedSelected.split('/')[0]
        const alternativeBase = normalizedAlternative.split('/')[0]

        if (selectedBase === alternativeBase) {
            return 'equivalent-quality'
        }

        const selectedExtended = ['9', 'major9', 'minor9', '11', 'minor11', '13', 'major13', '6/9'].includes(selectedType)
        const alternativeExtended = ['9', 'major9', 'minor9', '11', 'minor11', '13', 'major13', '6/9'].includes(alternativeType)

        if (selectedExtended !== alternativeExtended) {
            return selectedExtended ? 'same-root-subset' : 'same-root-extension'
        }

        return 'same-root-subset'
    }

    if (
        selectedRoot !== alternativeRoot
        && (
            selectedIsSlashChord
            || alternativeIsSlashChord
            || selectedBass === alternativeRoot
            || alternativeBass === selectedRoot
        )
    ) {
        return 'inversion-or-slash'
    }

    const selectedWithoutBass = normalizedSelected.split('/')[0]
    const alternativeWithoutBass = normalizedAlternative.split('/')[0]

    if (selectedWithoutBass !== alternativeWithoutBass && normalizedSelected.includes('/') !== normalizedAlternative.includes('/')) {
        return 'enharmonic-reinterpretation'
    }

    return 'competing-analysis'
}
