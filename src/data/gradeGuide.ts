/**
 * 〔表１〕障害等級の目安
 * 出典: 厚生労働省「国民年金・厚生年金保険 精神の障害に係る等級判定ガイドライン」
 * https://www.mhlw.go.jp/file/04-Houdouhappyou-12512000-Nenkinkyoku-Jigyoukanrika/0000130045.pdf
 *
 * 空欄セルは null（独自補完しない）。
 * 表内の「3級」は障害基礎年金を認定する場合には「2級非該当」と置き換える。
 */

import type { DegreeLevel } from './criteria'

export type PensionKind = 'disabilityBasic' | 'disabilityEmployees'

export type AverageBandId =
  | 'ge35'
  | 'ge30lt35'
  | 'ge25lt30'
  | 'ge20lt25'
  | 'ge15lt20'
  | 'lt15'

/** 厚生年金側の公式表文言。空欄は null */
export type GradeGuideCell = string | null

export interface AverageBand {
  id: AverageBandId
  label: string
  /** 下限（含む）。null は下限なし */
  minInclusive: number | null
  /** 上限（含まない）。null は上限なし */
  maxExclusive: number | null
}

export const AVERAGE_BANDS: AverageBand[] = [
  { id: 'ge35', label: '3.5以上', minInclusive: 3.5, maxExclusive: null },
  { id: 'ge30lt35', label: '3.0以上3.5未満', minInclusive: 3.0, maxExclusive: 3.5 },
  { id: 'ge25lt30', label: '2.5以上3.0未満', minInclusive: 2.5, maxExclusive: 3.0 },
  { id: 'ge20lt25', label: '2.0以上2.5未満', minInclusive: 2.0, maxExclusive: 2.5 },
  { id: 'ge15lt20', label: '1.5以上2.0未満', minInclusive: 1.5, maxExclusive: 2.0 },
  { id: 'lt15', label: '1.5未満', minInclusive: null, maxExclusive: 1.5 },
]

/** 程度 (5)〜(1) の順で表の列に対応 */
export const DEGREE_COLUMNS: DegreeLevel[] = [5, 4, 3, 2, 1]

/**
 * 行: AVERAGE_BANDS の順
 * 列: 程度 (5)(4)(3)(2)(1)
 */
export const GRADE_GUIDE_TABLE: Record<AverageBandId, Record<DegreeLevel, GradeGuideCell>> = {
  ge35: {
    5: '1級',
    4: '1級又は2級',
    3: null,
    2: null,
    1: null,
  },
  ge30lt35: {
    5: '1級又は2級',
    4: '2級',
    3: '2級',
    2: null,
    1: null,
  },
  ge25lt30: {
    5: null,
    4: '2級',
    3: '2級又は3級',
    2: null,
    1: null,
  },
  ge20lt25: {
    5: null,
    4: '2級',
    3: '2級又は3級',
    2: '3級又は3級非該当',
    1: null,
  },
  ge15lt20: {
    5: null,
    4: null,
    3: '3級',
    2: '3級又は3級非該当',
    1: null,
  },
  lt15: {
    5: null,
    4: null,
    3: null,
    2: '3級非該当',
    1: '3級非該当',
  },
}

export const GRADE_GUIDE_DISCLAIMER =
  'ここに表示する内容は、厚生労働省の等級判定ガイドライン〔表１〕障害等級の目安を、自己評価の入力値に当てはめた参考情報です。「推定等級」や確定的な認定結果ではありません。障害基礎年金を認定する場合、表内の「3級」は「2級非該当」と置き換えます。目安と異なる認定結果となることもあり得ます。詳しくは公式資料をご確認ください。'

export function resolveAverageBand(average: number): AverageBand {
  for (const band of AVERAGE_BANDS) {
    const aboveMin = band.minInclusive === null || average >= band.minInclusive
    const belowMax = band.maxExclusive === null || average < band.maxExclusive
    if (aboveMin && belowMax) {
      return band
    }
  }
  throw new Error(`Unable to resolve average band for value: ${average}`)
}

/**
 * 障害基礎年金用の置換:
 * - 「3級非該当」はそのまま（「3級」を含むが先に保護）
 * - 「3級」→「2級非該当」
 */
export function applyBasicPensionWording(cell: string): string {
  return cell
    .replaceAll('3級非該当', '__GRADE3_NON__')
    .replaceAll('3級', '2級非該当')
    .replaceAll('__GRADE3_NON__', '3級非該当')
}
