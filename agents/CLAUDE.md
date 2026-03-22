# agents/ — エージェント定義

このディレクトリには24個のエージェント定義ファイルが含まれる。

## 使い方
Agent toolの`subagent_type`パラメータにエージェント名を指定して呼び出す。

## 詳細インデックス
→ `../docs/agents-index.md` を参照

## クイック選択ガイド

### 実装（Implementation）
| タスク種別 | 推奨エージェント | model |
|-----------|--------------|-------|
| フロントエンド実装 | frontend-engineer | opus |
| バックエンド実装(DDD) | backend-engineer | opus |
| インフラ・CI/CD | infra-engineer | sonnet |
| モバイルアプリ実装 | mobile-engineer | opus |

### 設計（Design & Planning）
| タスク種別 | 推奨エージェント | model |
|-----------|--------------|-------|
| 新機能実装の計画 | planner | opus |
| アーキテクチャ設計 | architect | opus |
| UI/UXデザイン | ui-designer | opus |

### 品質（Quality）
| タスク種別 | 推奨エージェント | model |
|-----------|--------------|-------|
| コードレビュー(汎用) | code-reviewer | sonnet |
| コードレビュー(Python) | python-reviewer | sonnet |
| コードレビュー(Go) | go-reviewer | sonnet |
| コードレビュー(Kotlin) | kotlin-reviewer | sonnet |
| DB設計レビュー | database-reviewer | sonnet |
| セキュリティ | security-reviewer | sonnet |
| TDD | tdd-guide | sonnet |
| E2Eテスト | e2e-runner | sonnet |
| ビルドエラー(TS/汎用) | build-error-resolver | sonnet |
| ビルドエラー(Go) | go-build-resolver | sonnet |
| ビルドエラー(Kotlin) | kotlin-build-resolver | sonnet |
| デッドコード削除 | refactor-cleaner | sonnet |
| ドキュメント更新 | doc-updater | haiku |

### 運用（Operations）
| タスク種別 | 推奨エージェント | model |
|-----------|--------------|-------|
| ループ監視 | loop-operator | sonnet |
| ハーネス最適化 | harness-optimizer | sonnet |
| メール/Slack管理 | chief-of-staff | opus |
| 環境ヘルスチェック | env-doctor | sonnet |

## 新規エージェント（2026-03-22 作成）

| エージェント | 役割 | 行数 |
|-------------|------|------|
| frontend-engineer | Next.js/React/Tailwind フロントエンド実装 | 270行 |
| backend-engineer | DDD 4層バックエンド実装 | 225行 |
| infra-engineer | Vercel/Supabase/Docker インフラ | 221行 |
| mobile-engineer | RN/Swift/Kotlin モバイル実装 | 290行 |
| ui-designer | デザインシステム・プロトタイプ・アクセシビリティ | 251行 |

## 強化共通項目（2026-03-22 全エージェント適用）

全24エージェントに以下を含む:
- **Cross-Agent Handoffs**: FROM/TO/Complement の連携先
- **Failure Modes**: Problem/Detection/Recovery テーブル
