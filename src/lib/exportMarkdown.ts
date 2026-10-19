import {
  DISABILITY_TYPE_LABELS,
  DISCLAIMER_TEXT,
  getOptionLabel,
  JUDGMENT_ITEMS,
  OFFICIAL_LINKS,
  type DegreeLevel,
  type DisabilityType,
  type Score,
} from '../data/criteria'
import { DEGREE_OPTIONS } from '../data/criteria'
import type { Answers } from './average'
import { calculateAverage } from './average'
import type { GradeLookupResult } from './gradeLookup'
import type { PensionKind } from '../data/gradeGuide'

export interface ExportInput {
  disabilityType: DisabilityType
  answers: Answers
  degree: DegreeLevel | null
  freeText: string
  pensionKind: PensionKind
  gradeResult: GradeLookupResult | null
}

function pensionKindLabel(kind: PensionKind): string {
  return kind === 'disabilityBasic' ? '障害基礎年金' : '障害厚生年金'
}

export function buildMarkdown(input: ExportInput): string {
  const average = calculateAverage(input.answers)
  const lines: string[] = []

  lines.push('# 障害年金・日常生活能力セルフチェック結果')
  lines.push('')
  lines.push('## 免責事項')
  lines.push('')
  lines.push(DISCLAIMER_TEXT)
  lines.push('')
  lines.push('## 自己評価の前提')
  lines.push('')
  lines.push(
    `- 障害の系統（程度の文言）: ${DISABILITY_TYPE_LABELS[input.disabilityType]}`,
  )
  lines.push(
    '- 本結果は本人による自己評価であり、医師の診断書上の評価ではありません。',
  )
  lines.push(
    '- 判断にあたっては、単身で生活するとしたら可能かどうかを想定して自己評価しています（診断書記載要領の考え方に沿った自己整理）。',
  )
  lines.push('')
  lines.push('## 日常生活能力の判定（7項目）')
  lines.push('')

  for (const item of JUDGMENT_ITEMS) {
    const score = input.answers[item.id]
    if (score === undefined) {
      lines.push(`### ${item.number}. ${item.title}`)
      lines.push('')
      lines.push('- 回答: （未回答）')
      lines.push('')
      continue
    }
    const label = getOptionLabel(item.id, score as Score)
    lines.push(`### ${item.number}. ${item.title}`)
    lines.push('')
    lines.push(`- 評価値: ${score}`)
    lines.push(`- 選択: ${label}`)
    lines.push('')
  }

  lines.push('## 判定平均')
  lines.push('')
  if (average.complete && average.displayAverage !== null) {
    lines.push(`- 7項目の平均値: ${average.displayAverage}`)
    lines.push(
      '- 計算方法: 各項目の評価値（1〜4）の合計 ÷ 7（表示は小数第2位）',
    )
  } else {
    const unanswered = average.unansweredIds
      .map((id) => {
        const item = JUDGMENT_ITEMS.find((entry) => entry.id === id)
        return item ? `${item.number}. ${item.title}` : id
      })
      .join('、')
    lines.push('- 7項目の平均は未確定です（未回答があるため）。')
    lines.push(`- 未回答: ${unanswered}`)
  }
  lines.push('')

  lines.push('## 日常生活能力の程度（5段階・自己選択）')
  lines.push('')
  if (input.degree === null) {
    lines.push('- （未選択）')
  } else {
    const options = DEGREE_OPTIONS[input.disabilityType]
    const option = options.find((entry) => entry.value === input.degree)
    lines.push(`- 選択: (${input.degree}) ${option?.label ?? ''}`)
    lines.push(
      '- この項目は判定平均とは独立した自己評価です。平均値から自動導出していません。',
    )
  }
  lines.push('')

  lines.push('## 等級の目安（参考・自己評価の当てはめ）')
  lines.push('')
  lines.push(`- 参照した年金の種類: ${pensionKindLabel(input.pensionKind)}`)
  if (!average.complete || input.degree === null || input.gradeResult === null) {
    lines.push(
      '- 判定平均と程度の両方がそろっていないため、目安は表示できません。',
    )
  } else if (!input.gradeResult.hasGuide || input.gradeResult.displayText === null) {
    lines.push(
      `- 判定平均帯: ${input.gradeResult.bandLabel} / 程度: (${input.degree})`,
    )
    lines.push('- 公式表に対応する目安なし（空欄セル。独自補完はしていません）。')
  } else {
    lines.push(
      `- 判定平均帯: ${input.gradeResult.bandLabel} / 程度: (${input.degree})`,
    )
    lines.push(`- ガイドライン〔表１〕の目安: ${input.gradeResult.displayText}`)
    lines.push(
      '- これは目安であり、受給の可否や障害等級の認定を示すものではありません。',
    )
  }
  lines.push('')

  lines.push('## 日常生活で困っていること（自由記述）')
  lines.push('')
  lines.push(input.freeText.trim() === '' ? '（未記入）' : input.freeText.trim())
  lines.push('')

  lines.push('## 医師への相談メモ')
  lines.push('')
  lines.push(
    '上記は診察前に日常生活の困難を整理するための自己メモです。診断書の評価や等級認定の代わりにはなりません。主治医への相談資料としてご利用ください。',
  )
  lines.push('')

  lines.push('## 公式資料')
  lines.push('')
  for (const link of OFFICIAL_LINKS) {
    lines.push(`- [${link.label}](${link.href})`)
  }
  lines.push('')

  return lines.join('\n')
}

export function downloadMarkdown(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
