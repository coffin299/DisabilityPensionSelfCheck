import type { ItemId, Score } from '../data/criteria'
import { JUDGMENT_ITEMS } from '../data/criteria'

export type Answers = Partial<Record<ItemId, Score>>

export interface AverageResult {
  /** 全7項目回答済みのときのみ確定平均 */
  complete: boolean
  /** 丸め前の生の平均値。未完了時は null */
  rawAverage: number | null
  /** 小数第2位までの表示用文字列。未完了時は null */
  displayAverage: string | null
  answeredCount: number
  unansweredIds: ItemId[]
  sum: number | null
}

export function listUnanswered(answers: Answers): ItemId[] {
  return JUDGMENT_ITEMS.filter((item) => answers[item.id] === undefined).map(
    (item) => item.id,
  )
}

export function countAnswered(answers: Answers): number {
  return JUDGMENT_ITEMS.length - listUnanswered(answers).length
}

/**
 * 7項目すべてに回答がある場合のみ平均を確定する。
 * 計算は丸め前の値（sum / 7）を保持し、表示用にのみ小数第2位へ整形する。
 */
export function calculateAverage(answers: Answers): AverageResult {
  const unansweredIds = listUnanswered(answers)
  const answeredCount = JUDGMENT_ITEMS.length - unansweredIds.length

  if (unansweredIds.length > 0) {
    return {
      complete: false,
      rawAverage: null,
      displayAverage: null,
      answeredCount,
      unansweredIds,
      sum: null,
    }
  }

  const sum = JUDGMENT_ITEMS.reduce((total, item) => {
    const value = answers[item.id]
    if (value === undefined) {
      throw new Error(`Missing answer for ${item.id}`)
    }
    return total + value
  }, 0)

  const rawAverage = sum / JUDGMENT_ITEMS.length

  return {
    complete: true,
    rawAverage,
    displayAverage: formatAverage(rawAverage),
    answeredCount,
    unansweredIds: [],
    sum,
  }
}

/** 表示用。等級照合には使わない */
export function formatAverage(rawAverage: number): string {
  return rawAverage.toFixed(2)
}
