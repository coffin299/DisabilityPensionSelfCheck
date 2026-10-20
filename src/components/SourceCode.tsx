import averageSource from '../lib/average.ts?raw'
import gradeLookupSource from '../lib/gradeLookup.ts?raw'
import gradeGuideSource from '../data/gradeGuide.ts?raw'
import criteriaSource from '../data/criteria.ts?raw'
import exportMarkdownSource from '../lib/exportMarkdown.ts?raw'
import appSource from '../App.tsx?raw'
import styles from './SourceCode.module.css'

const REPO_URL =
  'https://github.com/coffin299/DisabilityPensionSelfCheck'

const SOURCE_FILES = [
  {
    path: 'src/lib/average.ts',
    description: '判定平均（合計÷7）の計算',
    code: averageSource,
  },
  {
    path: 'src/lib/gradeLookup.ts',
    description: '等級の目安の照合',
    code: gradeLookupSource,
  },
  {
    path: 'src/data/gradeGuide.ts',
    description: 'ガイドライン〔表１〕のデータ',
    code: gradeGuideSource,
  },
  {
    path: 'src/data/criteria.ts',
    description: '7項目・程度の公式文言',
    code: criteriaSource,
  },
  {
    path: 'src/lib/exportMarkdown.ts',
    description: 'Markdownエクスポート',
    code: exportMarkdownSource,
  },
  {
    path: 'src/App.tsx',
    description: '画面フロー全体',
    code: appSource,
  },
] as const

export function SourceCode() {
  return (
    <section className={styles.section} aria-labelledby="source-heading">
      <h2 id="source-heading" className={styles.heading}>
        このプログラムのソースコード
      </h2>
      <p className={styles.note}>
        計算や表示の内容を確認できるよう、主要なソースを掲載しています。回答はどこにも送信されず、ブラウザ上だけで動作します。全文は
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
          GitHubリポジトリ
        </a>
        （MITライセンス）で公開しています。
      </p>
      <div className={styles.list}>
        {SOURCE_FILES.map((file) => (
          <details key={file.path} className={styles.details}>
            <summary className={styles.summary}>
              <span className={styles.path}>{file.path}</span>
              <span className={styles.desc}>{file.description}</span>
            </summary>
            <pre className={styles.code}>
              <code>{file.code}</code>
            </pre>
          </details>
        ))}
      </div>
    </section>
  )
}
