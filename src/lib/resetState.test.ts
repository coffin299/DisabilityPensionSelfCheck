import { describe, expect, it } from 'vitest'
import { createInitialFormState } from './resetState'

describe('createInitialFormState', () => {
  it('clears answers and free text on reset', () => {
    const dirty = {
      disabilityType: 'mental' as const,
      answers: { meal: 3 as const, hygiene: 2 as const },
      degree: 4 as const,
      freeText: '残したい内容ではない',
      pensionKind: 'disabilityBasic' as const,
      itemIndex: 5,
    }

    const reset = createInitialFormState()
    expect(reset).not.toEqual(dirty)
    expect(reset.answers).toEqual({})
    expect(reset.freeText).toBe('')
    expect(reset.degree).toBeNull()
    expect(reset.disabilityType).toBeNull()
  })
})
