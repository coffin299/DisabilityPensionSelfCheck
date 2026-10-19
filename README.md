# 障害年金・日常生活能力セルフチェック

精神障害・知的障害に係る障害年金の「日常生活能力の判定」（7項目）と「日常生活能力の程度」（5段階）を、診察前に自己整理するための静的Webツールです。

**公開URL:** [https://coffin299.github.io/DisabilityPensionSelfCheck/](https://coffin299.github.io/DisabilityPensionSelfCheck/)

> このツールは自己チェック用です。医師による診断書上の評価や、日本年金機構による障害等級の認定を代替しません。

## 主な機能

- 日常生活能力の判定（7項目）を各4段階で自己評価
- 全項目回答後の判定平均（合計 ÷ 7、表示は小数第2位）
- 日常生活能力の程度（5段階）を精神障害／知的障害の文言で自己選択
- 厚生労働省ガイドライン〔表１〕に基づく等級の目安（参考表示）
- 自由記述、医師への相談用テキストプレビュー、Markdownエクスポート
- 回答のリセット（永続保存なし）

## 利用方法

1. 免責事項を確認して開始する
2. 程度の文言として「精神障害」または「知的障害」を選ぶ
3. 7項目を順に自己評価する（単身生活を想定）
4. 程度（5段階）を自己選択する
5. 結果を確認し、必要なら自由記述やMarkdownをエクスポートする

## 自己評価と公式評価の違い

| 本ツール | 公式の評価 |
|---|---|
| 本人による自己評価 | 医師が診断書に記載する評価 |
| 相談準備・生活の整理が目的 | 障害等級の認定資料の一部 |
| 等級の目安は参考表示のみ | 認定は診断書・病歴・生活・就労等を総合判断 |

評価尺度の文言は厚生労働省の記載要領・ガイドラインに沿っていますが、画面上の入力はあくまで自己評価です。

## 免責事項

このツールは、日常生活の困難を整理し、医師への相談を補助するための自己チェックツールです。入力結果は本人による自己評価であり、医師による診断書上の評価や、日本年金機構による障害等級の認定を示すものではありません。障害年金の認定は、診断書、病歴、療養状況、生活環境、就労状況などを含む資料に基づいて総合的に判断されます。このツールの結果だけで受給の可否や障害等級を判断することはできません。

## プライバシー方針

- 回答データを外部サーバーへ送信しません
- アカウント登録・ログインはありません
- アクセス解析・広告トラッキングはありません
- localStorage 等への永続保存はしません（再読み込みで消えます）
- Markdownエクスポートは利用者が明示操作したときのみ端末内で保存します

## 公式資料

- [厚生労働省「精神の障害に係る等級判定ガイドライン」（PDF）](https://www.mhlw.go.jp/file/04-Houdouhappyou-12512000-Nenkinkyoku-Jigyoukanrika/0000130045.pdf)
- [厚生労働省「障害年金の診断書（精神の障害用）記載要領」（PDF）](https://www.mhlw.go.jp/file/04-Houdouhappyou-12512000-Nenkinkyoku-Jigyoukanrika/0000130048.pdf)
- [日本年金機構『国民年金・厚生年金保険　精神の障害に係る等級判定ガイドライン』等](https://www.nenkin.go.jp/service/jukyu/seido/shougainenkin/ninteikijun/20160715.html)

## ローカル開発

```bash
npm install
npm run dev
```

開発サーバーは Vite の `base` 設定により `/DisabilityPensionSelfCheck/` 配下で動作します。

## テスト

```bash
npm test
```

## ビルド

```bash
npm run build
npm run preview
```

## GitHub Pages の公開方法

1. リポジトリの Settings → Pages で Source を **GitHub Actions** にする
2. `main` ブランチへマージ（または push）する
3. `.github/workflows/deploy.yml` が `npm test` → `npm run build` → Pages デプロイを実行する
4. 公開URL: https://coffin299.github.io/DisabilityPensionSelfCheck/

`vite.config.ts` の `base` は `/DisabilityPensionSelfCheck/` です。

## 技術構成

- React + TypeScript (strict) + Vite
- Vitest
- CSS Modules
- サーバー・データベース・外部APIなし

## ライセンス

[MIT License](LICENSE)
