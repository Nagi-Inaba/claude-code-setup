# LP Design System (mdA)

## カラーパレット

| 用途 | 変数名 | デフォルト値 | 説明 |
|------|--------|-------------|------|
| Primary | `--color-primary` | `#2563EB` | CTAボタン・リンク・アクセント |
| Primary Dark | `--color-primary-dark` | `#1D4ED8` | ホバー状態 |
| Secondary | `--color-secondary` | `#0F172A` | 見出し・ナビゲーション |
| Background | `--color-bg` | `#FFFFFF` | ページ背景 |
| Background Alt | `--color-bg-alt` | `#F8FAFC` | 交互セクション背景 |
| Text | `--color-text` | `#334155` | 本文テキスト |
| Text Muted | `--color-text-muted` | `#64748B` | 補足テキスト |
| Border | `--color-border` | `#E2E8F0` | 区切り線・カード枠 |
| Success | `--color-success` | `#16A34A` | 成功状態 |
| Warning | `--color-warning` | `#F59E0B` | 注意状態 |

**ルール**: 業種指定がある場合、`ui-ux-pro-max` の推奨カラーで上記をオーバーライドする。

## フォント

| 用途 | フォント | フォールバック |
|------|---------|--------------|
| 見出し | Noto Sans JP | sans-serif |
| 本文 | Noto Sans JP | sans-serif |

| レベル | サイズ | ウェイト | 行間 |
|--------|-------|---------|------|
| H1 (ヒーロー) | 2.5rem (40px) | 700 | 1.2 |
| H2 (セクション) | 2rem (32px) | 700 | 1.3 |
| H3 (サブセクション) | 1.5rem (24px) | 600 | 1.4 |
| Body Large | 1.125rem (18px) | 400 | 1.7 |
| Body | 1rem (16px) | 400 | 1.7 |

**モバイル**: H1 → 1.75rem, H2 → 1.5rem, H3 → 1.25rem

## コンポーネント仕様

### ボタン

| バリエーション | 背景 | テキスト | パディング | 角丸 |
|--------------|------|---------|-----------|------|
| Primary (CTA) | `--color-primary` | white | 16px 32px | 8px |
| Secondary | transparent | `--color-primary` | 16px 32px | 8px (border: 2px) |
| Ghost | transparent | `--color-text` | 12px 24px | 8px |

- ホバー: Primary → `--color-primary-dark`、transform: translateY(-1px)、shadow追加
- フォーカス: outline 2px offset 2px `--color-primary`
- 最小タップ領域: 44px x 44px

### カード

| バリエーション | 背景 | 影 | パディング | 角丸 |
|--------------|------|---|-----------|------|
| Default | white | `0 1px 3px rgba(0,0,0,0.1)` | 24px | 12px |
| Highlighted | white | `0 4px 6px rgba(0,0,0,0.1)` + border-top 3px primary | 24px | 12px |

- ホバー: shadow拡大、transform: translateY(-2px)
- transition: all 0.2s ease

### フォーム要素

- Input: height 48px, border 1px `--color-border`, 角丸 8px, padding 12px 16px
- Focus: border-color `--color-primary`, ring 2px
- Label: Body サイズ, weight 500, margin-bottom 8px
- エラー: border-color `--color-warning`, エラーメッセージは赤系テキスト

## スペーシングシステム

4px 基準:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px
- `4xl`: 96px

セクション間: `4xl` (96px)、モバイル: `3xl` (64px)
コンテナ最大幅: 1200px、パディング: 24px

## アニメーション

### Scroll Reveal
- 方式: IntersectionObserver (JS) または CSS `@starting-style`
- 効果: opacity 0→1 + translateY(20px→0)
- duration: 0.6s
- easing: cubic-bezier(0.16, 1, 0.3, 1)
- stagger: 子要素に 0.1s ずつ遅延

### ホバー
- ボタン: translateY(-1px) + shadow拡大
- カード: translateY(-2px) + shadow拡大
- リンク: underline-offset アニメーション
- duration: 0.2s ease

## アクセシビリティ

- コントラスト比: テキスト/背景 4.5:1 以上（WCAG AA）
- フォーカス: 全インタラクティブ要素に visible focus ring
- 画像: alt 属性必須（装飾画像は alt=""）
- セマンティック: `<main>`, `<section>`, `<nav>`, `<footer>` 使用
- reduced-motion: `prefers-reduced-motion: reduce` でアニメーション無効化

## 禁止事項

- グラデーションの多用（背景グラデーションは1ページ1箇所まで）
- box-shadow の3重以上重ね
- アニメーション duration 3秒超
- テキストの影（text-shadow）
- 自動再生メディア
- 画面全体を覆うモーダル（LP のコンバージョンを妨げる）
- フォントサイズ 14px 未満（本文）
