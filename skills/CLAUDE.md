# skills/ — ECC スキル定義

このディレクトリには82個のスキルが含まれる。（**SSoT**: スキル数はここだけで管理。他ファイルはこのファイルを参照する）

## 使い方
Skill toolの`skill`パラメータにスキル名を指定して呼び出す。

## 詳細インデックス
→ `../docs/skills-index.md` を参照

## 最重要スキル（常時意識）
- `anti-human-bottleneck` — 確認しようとしたら即実行
- `claude-md-improver` — CLAUDE.md変更後に必ず実行
- `deep-research` — 調査が必要な時
- `security-review` — セキュリティ懸念がある時
- `env-doctor` — 環境ヘルスチェック・フック動作検証

## カウント時の注意
- `learned/` はスキルディレクトリではなく学習済みパターンの格納先 — スキル数カウントから除外する
- スキル追加時は skills-index.md のカテゴリ別一覧 + トリガー一覧にも必ず追記する（env-doctor Category 7 で検出可能）

## Antigravity スキル（2026-03-23 選択導入）
ソース: `sickn33/antigravity-awesome-skills` v8.5.0（26.5k Stars）
セキュリティ監査済み（プロンプトインジェクション・データ流出・供給チェーン攻撃チェック全PASS）

| スキル | カテゴリ | 用途 |
|--------|---------|------|
| `pricing-strategy` | 収益化 | 価格設計（Van Westendorp、ティア設計、フリーミアム戦略） |
| `launch-strategy` | 収益化 | ORBフレームワーク、Product Hunt戦略、5段階ローンチ |
| `free-tool-strategy` | 収益化 | Engineering-as-marketing、無料ツールでリード獲得 |
| `email-sequence` | マーケ | SaaSライフサイクルメール設計（オンボ/リテンション/ウィンバック） |
| `lead-magnets` | マーケ | リードマグネット設計・ゲーティング戦略・LP構成 |
| `cold-email` | マーケ | B2Bコールドメール・フォローアップシーケンス |
| `seo-fundamentals` | SEO | E-E-A-T、Core Web Vitals、技術SEO基礎 |
| `seo-content-planner` | SEO | トピッククラスター計画・コンテンツカレンダー |
| `top-web-vulnerabilities` | セキュリティ | Web脆弱性100種（15カテゴリ、OWASP対応）— 攻撃側知識 |
| `kaizen` | 改善 | 継続的改善・ポカヨケ・標準化（TypeScript例付き） |

## OneDriveスキル
追加スキル: `C:/Users/Nagi/OneDrive/claudecodeskills/`（38個）
一覧: SKILLS-GUIDE.md
