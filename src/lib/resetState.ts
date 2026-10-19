import type { Answers } from './average'
import type { DisabilityType, DegreeLevel } from '../data/criteria'
import type { PensionKind } from '../data/gradeGuide'

export interface AppFormState {
  disabilityType: DisabilityType | null
  answers: Answers
  degree: DegreeLevel | null
  freeText: string
  pensionKind: PensionKind
  itemIndex: number
}

export function createInitialFormState(): AppFormState {
  return {
    disabilityType: null,
    answers: {},
    degree: null,
    freeText: '',
    pensionKind: 'disabilityEmployees',
    itemIndex: 0,
  }
}
