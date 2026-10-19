import { describe, expect, it } from 'vitest'
import {
  applyBasicPensionWording,
  AVERAGE_BANDS,
  DEGREE_COLUMNS,
  GRADE_GUIDE_TABLE,
  resolveAverageBand,
} from '../data/gradeGuide'
import type { DegreeLevel } from '../data/criteria'
import { lookupGradeGuide } from './gradeLookup'

describe('resolveAverageBand', () => {
  it('maps boundary values to official bands', () => {
    expect(resolveAverageBand(3.5).id).toBe('ge35')
    expect(resolveAverageBand(3.0).id).toBe('ge30lt35')
    expect(resolveAverageBand(2.5).id).toBe('ge25lt30')
    expect(resolveAverageBand(2.0).id).toBe('ge20lt25')
    expect(resolveAverageBand(1.5).id).toBe('ge15lt20')
    expect(resolveAverageBand(1.499999).id).toBe('lt15')
  })
})

describe('lookupGradeGuide table coverage', () => {
  it('matches every non-empty cell and leaves blanks as null', () => {
    const expected: Record<string, Record<DegreeLevel, string | null>> = {
      ge35: { 5: '1級', 4: '1級又は2級', 3: null, 2: null, 1: null },
      ge30lt35: { 5: '1級又は2級', 4: '2級', 3: '2級', 2: null, 1: null },
      ge25lt30: { 5: null, 4: '2級', 3: '2級又は3級', 2: null, 1: null },
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
      lt15: { 5: null, 4: null, 3: null, 2: '3級非該当', 1: '3級非該当' },
    }

    for (const band of AVERAGE_BANDS) {
      for (const degree of DEGREE_COLUMNS) {
        expect(GRADE_GUIDE_TABLE[band.id][degree]).toBe(
          expected[band.id][degree],
        )
      }
    }
  })

  it('looks up representative combinations without inventing blanks', () => {
    const hit = lookupGradeGuide(3.2, 4, 'disabilityEmployees')
    expect(hit.hasGuide).toBe(true)
    expect(hit.displayText).toBe('2級')

    const blank = lookupGradeGuide(3.6, 3, 'disabilityEmployees')
    expect(blank.hasGuide).toBe(false)
    expect(blank.displayText).toBeNull()
    expect(blank.rawCell).toBeNull()

    const multi = lookupGradeGuide(2.7, 3, 'disabilityEmployees')
    expect(multi.displayText).toBe('2級又は3級')
  })

  it('replaces 3級 with 2級非該当 for disability basic pension', () => {
    const employees = lookupGradeGuide(2.7, 3, 'disabilityEmployees')
    expect(employees.displayText).toBe('2級又は3級')

    const basic = lookupGradeGuide(2.7, 3, 'disabilityBasic')
    expect(basic.displayText).toBe('2級又は2級非該当')

    const onlyThird = lookupGradeGuide(1.7, 3, 'disabilityBasic')
    expect(onlyThird.displayText).toBe('2級非該当')

    const mixed = lookupGradeGuide(2.2, 2, 'disabilityBasic')
    expect(mixed.displayText).toBe('2級非該当又は3級非該当')

    const nonApplicable = lookupGradeGuide(1.0, 1, 'disabilityBasic')
    expect(nonApplicable.displayText).toBe('3級非該当')
  })
})

describe('applyBasicPensionWording', () => {
  it('does not corrupt 3級非該当 while replacing 3級', () => {
    expect(applyBasicPensionWording('3級')).toBe('2級非該当')
    expect(applyBasicPensionWording('3級又は3級非該当')).toBe(
      '2級非該当又は3級非該当',
    )
    expect(applyBasicPensionWording('3級非該当')).toBe('3級非該当')
    expect(applyBasicPensionWording('2級又は3級')).toBe('2級又は2級非該当')
  })
})
