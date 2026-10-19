import { SCORE_DIRECTION_NOTE, type JudgmentItem, type Score } from '../data/criteria'
import styles from './ItemQuestion.module.css'

interface ItemQuestionProps {
  item: JudgmentItem
  value: Score | undefined
  onChange: (value: Score) => void
}

export function ItemQuestion({ item, value, onChange }: ItemQuestionProps) {
  const groupName = `item-${item.id}`

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        <span className={styles.number}>{item.number}.</span> {item.title}
      </legend>

      {item.formNote && (
        <p className={styles.formNote}>
          <span className={styles.badge}>診断書様式上の補足</span>
          {item.formNote}
        </p>
      )}

      <p className={styles.direction}>{SCORE_DIRECTION_NOTE}</p>

      <div className={styles.options}>
        {item.options.map((option) => {
          const inputId = `${groupName}-${option.value}`
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
                name={groupName}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
              />
              <span className={styles.optionBody}>
                <span className={styles.optionLabel}>
                  <span className={styles.scoreBadge} aria-hidden="true">
                    {option.value}
                  </span>
                  <span className={styles.officialLabel}>
                    <span className={styles.scaleTag}>公式評価尺度</span>
                    {option.label}
                  </span>
                </span>
                <span className={styles.description}>{option.description}</span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
