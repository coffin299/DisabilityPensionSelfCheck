import { describe, expect, it } from 'vitest'
import type { ItemId, Score } from '../data/criteria'
import { JUDGMENT_ITEMS } from '../data/criteria'
import { calculateAverage, formatAverage } from './average'
import type { Answers } from './average'

function fillAll(value: Score): Answers {
  const answers: Answers = {}
  for (const item of JUDGMENT_ITEMS) {
    answers[item.id] = value
  }
  return answers
}

function fillMixed(values: Score[]): Answers {
  const answers: Answers = {}
  JUDGMENT_ITEMS.forEach((item, index) => {
    answers[item.id] = values[index]
  })
  return answers
}

describe('calculateAverage', () => {
  it('calculates average when all 7 items are answered', () => {
    const result = calculateAverage(fillMixed([1, 2, 3, 4, 1, 2, 3]))
    expect(result.complete).toBe(true)
    expect(result.sum).toBe(16)
    expect(result.rawAverage).toBeCloseTo(16 / 7, 10)
    expect(result.displayAverage).toBe(formatAverage(16 / 7))
  })

  it('calculates average when all items share the same value', () => {
    for (const value of [1, 2, 3, 4] as Score[]) {
      const result = calculateAverage(fillAll(value))
      expect(result.complete).toBe(true)
      expect(result.rawAverage).toBe(value)
      expect(result.displayAverage).toBe(value.toFixed(2))
    }
  })

  it('does not finalize average when any item is unanswered', () => {
    const answers = fillAll(2)
    delete answers.social
    const result = calculateAverage(answers)
    expect(result.complete).toBe(false)
    expect(result.rawAverage).toBeNull()
    expect(result.displayAverage).toBeNull()
    expect(result.unansweredIds).toEqual(['social'])
    expect(result.answeredCount).toBe(6)
  })

  it('updates average immediately when an answer changes', () => {
    const answers = fillAll(2)
    const before = calculateAverage(answers)
    expect(before.rawAverage).toBe(2)

    answers.meal = 4
    const after = calculateAverage(answers)
    expect(after.rawAverage).toBeCloseTo((4 + 2 * 6) / 7, 10)
    expect(after.displayAverage).toBe(formatAverage((4 + 2 * 6) / 7))
  })

  it('does not include degree evaluation in the average calculation', () => {
    const answers = fillAll(3)
    const result = calculateAverage(answers)
    // Degree is outside Answers; average remains 3 regardless of any degree choice.
    expect(result.rawAverage).toBe(3)
    expect(Object.keys(answers)).toHaveLength(7)
    expect(result.sum).toBe(21)
  })
})

describe('formatAverage', () => {
  it('formats to two decimal places without changing lookup input', () => {
    expect(formatAverage(16 / 7)).toBe('2.29')
    expect(formatAverage(3.5)).toBe('3.50')
  })
})

describe('answer keys', () => {
  it('covers exactly the seven official items', () => {
    const ids: ItemId[] = JUDGMENT_ITEMS.map((item) => item.id)
    expect(ids).toEqual([
      'meal',
      'hygiene',
      'money',
      'medication',
      'communication',
      'safety',
      'social',
    ])
  })
})
