import {
  DEGREE_OPTIONS,
  DISABILITY_TYPE_LABELS,
  getOptionLabel,
  JUDGMENT_ITEMS,
  OFFICIAL_LINKS,
  type DegreeLevel,
  type DisabilityType,
  type Score,
} from '../data/criteria'
import {
  GRADE_GUIDE_DISCLAIMER,
  type PensionKind,
} from '../data/gradeGuide'
import type { Answers, AverageResult } from '../lib/average'
import {
  buildMarkdown,
  downloadMarkdown,
} from '../lib/exportMarkdown'
import type { GradeLookupResult } from '../lib/gradeLookup'
import { Disclaimer } from './Disclaimer'
import styles from './Results.module.css'

interface ResultsProps {
  disabilityType: DisabilityType
  answers: Answers
  average: AverageResult
  degree: DegreeLevel | null
  freeText: string
  onFreeTextChange: (value: string) => void
  pensionKind: PensionKind
  onPensionKindChange: (value: PensionKind) => void
  gradeResult: GradeLookupResult | null
  consultationPreview: string
  onReset: () => void
  onBack: () => void
}

export function Results({
  disabilityType,
  answers,
  average,
  degree,
  freeText,
  onFreeTextChange,
  pensionKind,
  onPensionKindChange,
  gradeResult,
  consultationPreview,
  onReset,
  onBack,
}: ResultsProps) {
  const degreeLabel =
    degree === null
      ? null
      : DEGREE_OPTIONS[disabilityType].find((entry) => entry.value === degree)
          ?.label

  function handleExport() {
    const markdown = buildMarkdown({
      disabilityType,
      answers,
      degree,
      freeText,
      pensionKind,
      gradeResult,
    })
    downloadMarkdown('disability-pension-self-check.md', markdown)
  }

  return (
    <section className={styles.section} aria-labelledby="results-heading">
      <h2 id="results-heading">結果（自己評価の整理）</h2>
      <Disclaimer variant="results" />

      <h3>障害の系統</h3>
      <p>{DISABILITY_TYPE_LABELS[disabilityType]}（程度の文言）</p>

      <h3>日常生活能力の判定（7項目）の回答一覧</h3>
      <ul className={styles.answerList}>
        {JUDGMENT_ITEMS.map((item) => {
          const score = answers[item.id]
          return (
            <li key={item.id}>
              <strong>
                {item.number}. {item.title}
              </strong>
              {score === undefined ? (
                <span> — 未回答</span>
              ) : (
                <span>
                  {' '}
                  — 評価値 {score}：{getOptionLabel(item.id, score as Score)}
                </span>
              )}
            </li>
          )
        })}
      </ul>

      <h3>判定平均</h3>
      {average.complete && average.displayAverage !== null ? (
        <p>
          7項目の平均値: <strong>{average.displayAverage}</strong>
          <span className={styles.hint}>
            （合計 {average.sum} ÷ 7。表示は小数第2位。等級目安の照合は丸め前の値を使用）
          </span>
        </p>
      ) : (
        <p className={styles.warning} role="status">
          未回答があるため、7項目の平均値は確定表示しません。回答済み項目だけの平均を、7項目の平均と誤認しないでください。
          未回答:{' '}
          {average.unansweredIds
            .map((id) => {
              const item = JUDGMENT_ITEMS.find((entry) => entry.id === id)
              return item ? `${item.number}. ${item.title}` : id
            })
            .join('、')}
        </p>
      )}

      <h3>日常生活能力の程度（5段階・自己選択）</h3>
      {degree === null || !degreeLabel ? (
        <p>未選択</p>
      ) : (
        <p>
          ({degree}) {degreeLabel}
        </p>
      )}
      <p className={styles.hint}>
        この5段階は判定平均とは独立した自己評価です。医師の診断書上の評価ではありません。
      </p>

      <h3>等級の目安（参考）</h3>
      <p className={styles.hint}>{GRADE_GUIDE_DISCLAIMER}</p>
      <fieldset className={styles.pensionFieldset}>
        <legend>参照する年金の種類（目安の読み替え用）</legend>
        <label className={styles.inlineOption}>
          <input
            type="radio"
            name="pension-kind"
            checked={pensionKind === 'disabilityEmployees'}
            onChange={() => onPensionKindChange('disabilityEmployees')}
          />
          障害厚生年金（表の文言をそのまま表示）
        </label>
        <label className={styles.inlineOption}>
          <input
            type="radio"
            name="pension-kind"
            checked={pensionKind === 'disabilityBasic'}
            onChange={() => onPensionKindChange('disabilityBasic')}
          />
          障害基礎年金（表内の「3級」を「2級非該当」に置き換え）
        </label>
      </fieldset>

      {!average.complete || degree === null || gradeResult === null ? (
        <p role="status">
          判定平均と程度の両方がそろっていないため、ガイドライン〔表１〕の目安は表示できません。
        </p>
      ) : gradeResult.hasGuide && gradeResult.displayText !== null ? (
        <div className={styles.guideBox}>
          <p>
            判定平均帯: {gradeResult.bandLabel} ／ 程度: ({degree})
          </p>
          <p>
            ガイドライン〔表１〕の目安:{' '}
            <strong>{gradeResult.displayText}</strong>
          </p>
          <p className={styles.hint}>
            複数の目安がある場合は、可能性をそのまま表示しています。確定的な等級ではありません。
          </p>
        </div>
      ) : (
        <div className={styles.guideBox}>
          <p>
            判定平均帯: {gradeResult.bandLabel} ／ 程度: ({degree})
          </p>
          <p role="status">
            公式表に対応する目安なし（空欄）。独自には補完していません。
          </p>
        </div>
      )}

      <ul className={styles.links}>
        {OFFICIAL_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <h3>日常生活で困っていること（自由記述）</h3>
      <label className={styles.srOnly} htmlFor="free-text">
        日常生活で困っていること
      </label>
      <textarea
        id="free-text"
        className={styles.textarea}
        rows={6}
        value={freeText}
        onChange={(event) => onFreeTextChange(event.target.value)}
        placeholder="例: 朝の支度に時間がかかる、服薬を忘れやすい、外出時に不安が強い、など"
      />

      <h3>医師への相談用テキスト（プレビュー）</h3>
      <pre className={styles.preview}>{consultationPreview}</pre>

      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={handleExport}>
          Markdownでエクスポート
        </button>
        <button type="button" className={styles.secondary} onClick={onBack}>
          回答を修正する
        </button>
        <button type="button" className={styles.danger} onClick={onReset}>
          すべてリセット
        </button>
      </div>
      <p className={styles.hint}>
        エクスポートは、このボタンを押したときだけ端末内でファイルを保存します。第三者へ自動送信しません。
      </p>
    </section>
  )
}
