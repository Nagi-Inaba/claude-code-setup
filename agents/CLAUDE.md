# agents/ — エージェント定義

このディレクトリには19個のエージェント定義ファイルが含まれる。

## 使い方
Agent toolの`subagent_type`パラメータにエージェント名を指定して呼び出す。

## 詳細インデックス
→ `../docs/agents-index.md` を参照

## クイック選択ガイド
| タスク種別 | 推奨エージェント |
|-----------|--------------|
| 新機能実装の計画 | planner |
| アーキテクチャ設計 | architect |
| コードレビュー(汎用) | code-reviewer |
| コードレビュー(Python) | python-reviewer |
| コードレビュー(Go) | go-reviewer |
| コードレビュー(Kotlin) | kotlin-reviewer |
| DB設計レビュー | database-reviewer |
| TDD | tdd-guide |
| E2Eテスト | e2e-runner |
| セキュリティ | security-reviewer |
| ビルドエラー(TS/汎用) | build-error-resolver |
| ビルドエラー(Go) | go-build-resolver |
| ビルドエラー(Kotlin) | kotlin-build-resolver |
| デッドコード削除 | refactor-cleaner |
| ドキュメント更新 | doc-updater |
| ループ監視 | loop-operator |
| ハーネス最適化 | harness-optimizer |
| メール/Slack管理 | chief-of-staff |
| 環境ヘルスチェック | env-doctor |

## 最近の変更
- **code-reviewer**: gstack由来の3セクション追加（Scope Drift Detection / Fix-First Heuristic / LLM Trust Boundary）
- **planner**: gstack由来の2セクション追加（Scope Management Mode / Failure Mode Analysis）
- **build-error-resolver**: gstack由来の2セクション追加（Iron Law / 3-Strike Rule）
- **doc-updater**: gstack由来の2セクション追加（Cross-doc Consistency Check / CHANGELOG Protection）
