import { JUDGMENT_ITEMS, type ItemId } from '../data/criteria'
import styles from './Progress.module.css'

interface ProgressProps {
  answeredCount: number
  unansweredIds: ItemId[]
}

export function Progress({ answeredCount, unansweredIds }: ProgressProps) {
  const unansweredLabels = unansweredIds.map((id) => {
    const item = JUDGMENT_ITEMS.find((entry) => entry.id === id)
    return item ? `${item.number}. ${item.title}` : id
  })

  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <p className={styles.count}>
        回答済み {answeredCount} / {JUDGMENT_ITEMS.length}
        <span className={styles.separator}>・</span>
        未回答 {unansweredIds.length} 件
      </p>
      {unansweredIds.length > 0 ? (
        <p className={styles.list}>未回答: {unansweredLabels.join('、')}</p>
      ) : (
        <p className={styles.list}>7項目すべて回答済みです。</p>
      )}
    </div>
  )
}
