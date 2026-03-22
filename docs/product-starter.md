# product-starter (jujunjun110) — DDD実装支援ツール

`ps-` プレフィックスで統合済み。全プロジェクトの実装フェーズで使用可能。DDD 4層アーキテクチャ（Next.js + Supabase + Prisma）プロジェクトでは特に推奨。
ソース: `C:/Users/Nagi/tmp/product-starter/` (git clone済み)

## コマンド（`~/.claude/commands/`）

| コマンド | 用途 |
|---------|------|
| `/ps-init` | プロジェクト初期セットアップ（Homebrew→Node→pnpm→Docker→Supabase→DB→dev server） |
| `/ps-plan <内容>` | DDD準拠の設計ドキュメント作成（`docs/tasks/` に保存） |
| `/ps-pr` | フィーチャーブランチ作成→品質チェック→PR作成 |

## スキル（`~/.claude/skills/ps-*/`）

| スキル | 用途 |
|--------|------|
| `ps-add-feature` | DDD 4層に従って全レイヤーのファイルを一括生成 |
| `ps-add-page` | Next.js ページ + Loader を生成（Server Component デフォルト） |
| `ps-db-table` | Prisma スキーマ変更 + マイグレーション + Repository 生成 |
| `ps-add-api-integration` | Gateway interface + 本番/Stub 実装を3ファイルセットで生成 |
| `ps-design-ui` | shadcn/ui + Tailwind でUI作成・修正 |
| `ps-fix-error` | エラー解析→修正→`pnpm verify` で検証 |

## 既存ワークフローとの使い分け

- **既存フロー**（`/prd` → `/ralph` → planner → code-reviewer）: 何を作るか・タスク管理
- **ps-系ツール**: DDD構造に沿ってどう実装するか
- **棲み分け**: 既存フローで要件定義後、実装フェーズで ps-系スキルが自動適用される
