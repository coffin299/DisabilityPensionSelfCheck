import { useMemo, useState } from 'react'
import { DegreeSelect } from './components/DegreeSelect'
import { Disclaimer } from './components/Disclaimer'
import { ItemQuestion } from './components/ItemQuestion'
import { Progress } from './components/Progress'
import { Results } from './components/Results'
import { SourceCode } from './components/SourceCode'
import {
  DISABILITY_TYPE_LABELS,
  JUDGMENT_ITEMS,
  type DegreeLevel,
  type DisabilityType,
  type ItemId,
  type Score,
} from './data/criteria'
import type { PensionKind } from './data/gradeGuide'
import { calculateAverage, type Answers } from './lib/average'
import { buildMarkdown } from './lib/exportMarkdown'
import { lookupGradeGuide } from './lib/gradeLookup'
import { createInitialFormState } from './lib/resetState'
import styles from './App.module.css'

type Step = 'start' | 'type' | 'items' | 'degree' | 'results'

export default function App() {
  const [step, setStep] = useState<Step>('start')
  const [disabilityType, setDisabilityType] = useState<DisabilityType | null>(
    null,
  )
  const [answers, setAnswers] = useState<Answers>({})
  const [itemIndex, setItemIndex] = useState(0)
  const [degree, setDegree] = useState<DegreeLevel | null>(null)
  const [freeText, setFreeText] = useState('')
  const [pensionKind, setPensionKind] =
    useState<PensionKind>('disabilityEmployees')

  const average = useMemo(() => calculateAverage(answers), [answers])
  const currentItem = JUDGMENT_ITEMS[itemIndex]

  const gradeResult = useMemo(() => {
    if (!average.complete || average.rawAverage === null || degree === null) {
      return null
    }
    return lookupGradeGuide(average.rawAverage, degree, pensionKind)
  }, [average.complete, average.rawAverage, degree, pensionKind])

  const consultationPreview = useMemo(() => {
    if (disabilityType === null) {
      return ''
    }
    return buildMarkdown({
      disabilityType,
      answers,
      degree,
      freeText,
      pensionKind,
      gradeResult,
    })
  }, [disabilityType, answers, degree, freeText, pensionKind, gradeResult])

  function resetAll() {
    const next = createInitialFormState()
    setStep('start')
    setDisabilityType(next.disabilityType)
    setAnswers(next.answers)
    setItemIndex(next.itemIndex)
    setDegree(next.degree)
    setFreeText(next.freeText)
    setPensionKind(next.pensionKind)
  }

  function handleTypeSelect(type: DisabilityType) {
    setDisabilityType(type)
    setDegree(null)
    setStep('items')
    setItemIndex(0)
  }

  function handleAnswer(itemId: ItemId, value: Score) {
    setAnswers((prev) => ({ ...prev, [itemId]: value }))
  }

  function handleTypeSwitch(type: DisabilityType) {
    setDisabilityType(type)
    setDegree(null)
  }

  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#main">
        本文へスキップ
      </a>
      <header className={styles.header}>
        <p className={styles.brand}>障害年金セルフチェック</p>
        <h1 className={styles.title}>日常生活能力の自己整理ツール</h1>
        <p className={styles.lead}>
          精神障害・知的障害に係る障害年金の「日常生活能力の判定」などを、診察前に整理するための自己チェックです。
        </p>
      </header>

      <main id="main" className={styles.main}>
        {step === 'start' && (
          <section aria-labelledby="start-heading">
            <h2 id="start-heading" className={styles.srOnly}>
              開始
            </h2>
            <Disclaimer variant="start" />
            <SourceCode />
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primary}
                onClick={() => setStep('type')}
              >
                内容を理解して開始する
              </button>
            </div>
          </section>
        )}

        {step === 'type' && (
          <section aria-labelledby="type-heading">
            <h2 id="type-heading">程度の文言の系統を選ぶ</h2>
            <p className={styles.help}>
              「日常生活能力の程度」は、診断書上で精神障害用と知的障害用の文言があります。近いほうを選んでください。あとから変更できます（変更すると程度の選択のみリセットされます）。
            </p>
            <div className={styles.typeGrid}>
              {(Object.keys(DISABILITY_TYPE_LABELS) as DisabilityType[]).map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    className={styles.typeButton}
                    onClick={() => handleTypeSelect(type)}
                  >
                    {DISABILITY_TYPE_LABELS[type]}
                  </button>
                ),
              )}
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => setStep('start')}
              >
                戻る
              </button>
            </div>
          </section>
        )}

        {step === 'items' && disabilityType !== null && currentItem && (
          <section aria-labelledby="items-heading">
            <h2 id="items-heading">日常生活能力の判定（7項目）</h2>
            <p className={styles.help}>
              判断の目安として、単身で生活するとしたら可能かどうかを想像して選んでください。これは自己評価であり、医師の診断書評価そのものではありません。いつでも回答を変更できます。
            </p>
            <Progress
              answeredCount={average.answeredCount}
              unansweredIds={average.unansweredIds}
            />
            <ItemQuestion
              item={currentItem}
              value={answers[currentItem.id]}
              onChange={(value) => handleAnswer(currentItem.id, value)}
            />
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondary}
                onClick={() =>
                  itemIndex === 0
                    ? setStep('type')
                    : setItemIndex((index) => index - 1)
                }
              >
                前へ
              </button>
              {itemIndex < JUDGMENT_ITEMS.length - 1 ? (
                <button
                  type="button"
                  className={styles.primary}
                  onClick={() => setItemIndex((index) => index + 1)}
                >
                  次の項目へ
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.primary}
                  onClick={() => setStep('degree')}
                >
                  程度の自己評価へ
                </button>
              )}
            </div>
            <nav className={styles.itemNav} aria-label="項目ジャンプ">
              {JUDGMENT_ITEMS.map((item, index) => {
                const answered = answers[item.id] !== undefined
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      index === itemIndex
                        ? `${styles.itemJump} ${styles.itemJumpCurrent}`
                        : answered
                          ? `${styles.itemJump} ${styles.itemJumpDone}`
                          : styles.itemJump
                    }
                    onClick={() => setItemIndex(index)}
                    aria-current={index === itemIndex ? 'step' : undefined}
                  >
                    {item.number}
                    <span className={styles.srOnly}>
                      .{item.title}
                      {answered ? '（回答済み）' : '（未回答）'}
                    </span>
                  </button>
                )
              })}
            </nav>
          </section>
        )}

        {step === 'degree' && disabilityType !== null && (
          <section aria-labelledby="degree-heading">
            <h2 id="degree-heading" className={styles.srOnly}>
              日常生活能力の程度
            </h2>
            <Progress
              answeredCount={average.answeredCount}
              unansweredIds={average.unansweredIds}
            />
            <div className={styles.typeSwitch}>
              <span>程度の文言:</span>
              {(Object.keys(DISABILITY_TYPE_LABELS) as DisabilityType[]).map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    className={
                      disabilityType === type
                        ? `${styles.chip} ${styles.chipActive}`
                        : styles.chip
                    }
                    onClick={() => handleTypeSwitch(type)}
                    aria-pressed={disabilityType === type}
                  >
                    {DISABILITY_TYPE_LABELS[type]}
                  </button>
                ),
              )}
            </div>
            <DegreeSelect
              disabilityType={disabilityType}
              value={degree}
              onChange={setDegree}
            />
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => setStep('items')}
              >
                7項目へ戻る
              </button>
              <button
                type="button"
                className={styles.primary}
                onClick={() => setStep('results')}
              >
                結果を見る
              </button>
            </div>
          </section>
        )}

        {step === 'results' && disabilityType !== null && (
          <Results
            disabilityType={disabilityType}
            answers={answers}
            average={average}
            degree={degree}
            freeText={freeText}
            onFreeTextChange={setFreeText}
            pensionKind={pensionKind}
            onPensionKindChange={setPensionKind}
            gradeResult={gradeResult}
            consultationPreview={consultationPreview}
            onReset={resetAll}
            onBack={() => setStep('degree')}
          />
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          回答は外部送信・永続保存しません。アクセス解析や広告トラッキングも使用していません。
        </p>
      </footer>
    </div>
  )
}
