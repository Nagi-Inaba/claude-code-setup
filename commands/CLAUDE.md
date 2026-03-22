# commands/ — スラッシュコマンド定義

このディレクトリには55個 + ps-系3個のスラッシュコマンド定義ファイルが含まれる。
各ファイルは `/コマンド名` で呼び出すと Claude Code が実行する指示テンプレート。

## 詳細インデックス
→ `../docs/commands-index.md` を参照

## 新規コマンド追加
ファイル名: `command-name.md`（ハイフン区切り）
フロントマター: `description:` フィールドを必ず記載する（`/help` 表示に使用される）

## 最重要コマンド

| 状況 | コマンド |
|-----|---------|
| 新機能実装前（計画） | /plan |
| TDD実装 | /tdd |
| コードレビュー | /code-review |
| ビルドエラー修正 | /build-fix |
| セッション保存 | /save-session |
| セッション再開 | /resume-session |
| エージェントオーケストレーション | /orchestrate |
| 品質ゲート | /quality-gate |
| プロンプト最適化 | /prompt-optimize |
| マルチモデル開発 | /multi-workflow |
| DDD プロジェクト初期化 | /ps-init |
| DDD 設計ドキュメント | /ps-plan |
| DDD 品質チェック付きPR | /ps-pr |
| 環境ヘルスチェック | /env-doctor |
