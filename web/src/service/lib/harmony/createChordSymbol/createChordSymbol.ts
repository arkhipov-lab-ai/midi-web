import {getPitchClassName} from '@shared/lib'

interface CreateChordSymbolOptions {
    rootPitchClass: number
    symbolSuffix: string
    bassPitchClass: number | null
    templatePitchClasses: number[]
    omissionLabelMode: 'none' | 'no3' | 'no5'
}

interface CreateChordSymbolResult {
    symbol: string
    bass: string | null
    isSlashChord: boolean
    isOmissionLabel: boolean
    omissionType: 'no3' | 'no5' | null
}

export function createChordSymbol(options: CreateChordSymbolOptions): CreateChordSymbolResult {

    const {
        rootPitchClass,
        symbolSuffix,
        bassPitchClass,
        templatePitchClasses,
        omissionLabelMode,
    } = options

    const rootName = getPitchClassName(rootPitchClass)
    const omissionSuffix = omissionLabelMode === 'none' ? '' : `(${omissionLabelMode})`

    if (
        bassPitchClass === null
        || bassPitchClass === rootPitchClass
        || !templatePitchClasses.includes(bassPitchClass)
    ) {
        return {
            symbol: `${rootName}${symbolSuffix}${omissionSuffix}`,
            bass: null,
            isSlashChord: false,
            isOmissionLabel: omissionLabelMode !== 'none',
            omissionType: omissionLabelMode === 'none' ? null : omissionLabelMode,
        }
    }

    const bassName = getPitchClassName(bassPitchClass)

    return {
        symbol: `${rootName}${symbolSuffix}${omissionSuffix}/${bassName}`,
        bass: bassName,
        isSlashChord: true,
        isOmissionLabel: omissionLabelMode !== 'none',
        omissionType: omissionLabelMode === 'none' ? null : omissionLabelMode,
    }
}
