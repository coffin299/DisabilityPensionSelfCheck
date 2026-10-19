import { describe, expect, it } from 'vitest'
import { JUDGMENT_ITEMS } from '../data/criteria'
import type { Answers } from './average'
import { buildMarkdown } from './exportMarkdown'
import { lookupGradeGuide } from './gradeLookup'

function fillAll(value: 1 | 2 | 3 | 4): Answers {
  const answers: Answers = {}
  for (const item of JUDGMENT_ITEMS) {
    answers[item.id] = value
  }
  return answers
}

describe('buildMarkdown', () => {
  it('exports content that matches the input answers and free text', () => {
    const answers = fillAll(2)
    answers.meal = 4
    const gradeResult = lookupGradeGuide(16 / 7, 3, 'disabilityEmployees')
    const markdown = buildMarkdown({
      disabilityType: 'mental',
      answers,
      degree: 3,
      freeText: '朝の支度が特に難しいです。',
      pensionKind: 'disabilityEmployees',
      gradeResult,
    })

    expect(markdown).toContain('適切な食事')
    expect(markdown).toContain('評価値: 4')
    expect(markdown).toContain('朝の支度が特に難しいです。')
    expect(markdown).toContain('精神障害')
    expect(markdown).toContain('自己評価')
    expect(markdown).not.toContain('あなたは')
    expect(markdown).not.toContain('推定等級')
  })

  it('notes incomplete average when answers are missing', () => {
    const answers = fillAll(1)
    delete answers.safety
    const markdown = buildMarkdown({
      disabilityType: 'intellectual',
      answers,
      degree: null,
      freeText: '',
      pensionKind: 'disabilityBasic',
      gradeResult: null,
    })

    expect(markdown).toContain('未確定')
    expect(markdown).toContain('身辺の安全保持及び危機対応')
    expect(markdown).toContain('（未選択）')
    expect(markdown).toContain('（未記入）')
  })
})
