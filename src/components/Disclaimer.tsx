import { DISCLAIMER_TEXT, OFFICIAL_LINKS } from '../data/criteria'
import styles from './Disclaimer.module.css'

interface DisclaimerProps {
  variant?: 'start' | 'results'
}

export function Disclaimer({ variant = 'start' }: DisclaimerProps) {
  const heading =
    variant === 'start' ? 'はじめに（必ずお読みください）' : '免責事項'

  return (
    <aside className={styles.box} aria-labelledby={`disclaimer-${variant}`}>
      <h2 id={`disclaimer-${variant}`} className={styles.heading}>
        {heading}
      </h2>
      <p className={styles.text}>{DISCLAIMER_TEXT}</p>
      {variant === 'start' && (
        <>
          <p className={styles.note}>
            回答内容はブラウザ外へ送信されず、この端末の画面上のみで扱います。ページを再読み込みすると回答は消えます。
          </p>
          <ul className={styles.links}>
            {OFFICIAL_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  )
}
