import type { DegreeLevel } from '../data/criteria'
import {
  applyBasicPensionWording,
  GRADE_GUIDE_TABLE,
  resolveAverageBand,
  type PensionKind,
} from '../data/gradeGuide'

export interface GradeLookupResult {
  bandId: string
  bandLabel: string
  degree: DegreeLevel
  pensionKind: PensionKind
  /** 公式表のセル値。空欄は null */
  rawCell: string | null
  /** 年金種別を反映した表示文言。空欄時は null */
  displayText: string | null
  hasGuide: boolean
}

/**
 * 丸め前の判定平均と程度から、公式表1の目安を照合する。
 * 空欄は補完しない。
 */
export function lookupGradeGuide(
  rawAverage: number,
  degree: DegreeLevel,
  pensionKind: PensionKind,
): GradeLookupResult {
  const band = resolveAverageBand(rawAverage)
  const rawCell = GRADE_GUIDE_TABLE[band.id][degree]

  if (rawCell === null) {
    return {
      bandId: band.id,
      bandLabel: band.label,
      degree,
      pensionKind,
      rawCell: null,
      displayText: null,
      hasGuide: false,
    }
  }

  const displayText =
    pensionKind === 'disabilityBasic'
      ? applyBasicPensionWording(rawCell)
      : rawCell

  return {
    bandId: band.id,
    bandLabel: band.label,
    degree,
    pensionKind,
    rawCell,
    displayText,
    hasGuide: true,
  }
}
