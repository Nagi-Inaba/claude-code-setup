# skills/vibe-design/ — Vibe Design UI Prototyping Skill

Sota Mikami作のUIプロトタイピングスキル。ワイヤーフレーム→リッチプロトタイプ→スペック→QAケースの一貫フローを提供。

## ファイル一覧

| ファイル | 内容 |
|---------|------|
| `SKILL.md` | スキル定義（ワークフロー6ステップ・AI制約） |
| `DESIGN.md` | プロジェクトテンプレート用デザイントークン定義 |
| `SCREEN_MAP_GUIDE.md` | マルチスクリーンプロトタイプのスクリーンマップガイド |
| `SPEC_GUIDE.md` | 実装スペック・QAケース作成ガイド |

## ソース

- リポジトリ: https://github.com/Sota-Mikami/design-with-claude-code
- ローカルクローン: /tmp/design-with-claude-code/
- テンプレート: /tmp/design-with-claude-code/template/（Next.js プロジェクト）

## トリガーワード

design / prototype / mockup / UI / wireframe / spec / QA / test cases / handoff

## ワークフロー概要

1. DESIGN.md 読み込み
2. ワイヤーフレーム（グレースケール --wf-* トークン）
3. リッチプロトタイプ（ブランドカラー適用）
4. スクリーンマップ & States/Variants/Patterns
5. 実装スペック（/spec ページ）
6. QAケース（/qa ページ）
