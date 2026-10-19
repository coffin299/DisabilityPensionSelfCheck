import {
  DEGREE_OPTIONS,
  DISABILITY_TYPE_LABELS,
  type DegreeLevel,
  type DisabilityType,
} from '../data/criteria'
import styles from './DegreeSelect.module.css'

interface DegreeSelectProps {
  disabilityType: DisabilityType
  value: DegreeLevel | null
  onChange: (value: DegreeLevel) => void
}

export function DegreeSelect({
  disabilityType,
  value,
  onChange,
}: DegreeSelectProps) {
  const options = DEGREE_OPTIONS[disabilityType]

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>日常生活能力の程度（5段階）</legend>
      <p className={styles.note}>
        この項目は「日常生活能力の判定」7項目の平均とは独立した自己評価です。
        平均値から自動では決まりません。文言は
        {DISABILITY_TYPE_LABELS[disabilityType]}
        用の公式表現です。医師が診断書に記入する評価とは異なります。
      </p>
      <div className={styles.options}>
        {options.map((option) => {
          const inputId = `degree-${option.value}`
          const checked = value === option.value
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={checked ? `${styles.option} ${styles.selected}` : styles.option}
            >
              <input
                id={inputId}
                className={styles.input}
                type="radio"
                name="degree"
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
              />
              <span className={styles.optionBody}>
                <span className={styles.degreeBadge} aria-hidden="true">
                  ({option.value})
                </span>
                <span className={styles.label}>{option.label}</span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
