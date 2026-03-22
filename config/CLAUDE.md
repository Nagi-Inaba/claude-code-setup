# config/ — 設定ファイル

フック・ワークフローの外部設定を格納するディレクトリ。

## ファイル一覧

| ファイル | 用途 |
|---------|-----|
| `dev-workflow-triggers.json` | 開発系タスク検出のキーワード設定（positive/negative パターン） |
| `env-doctor-baseline.json` | env-doctor の期待値ベースライン（フック数・エージェント数・プラグイン数等） |

## dev-workflow-triggers.json

- `positivePatterns`: 開発タスクと判定するキーワード（日英対応）
- `negativePatterns`: 開発タスクから除外するキーワード（バグ修正・レビュー等）
- `minInputLength`: 検出対象の最小文字数（短すぎる入力を無視）

## キーワード変更時の注意

- positive に追加する際は negative との競合を確認する（negative が優先判定される）
- 日本語・英語の両方を登録する（ユーザーは両言語で指示する）
- フック再起動不要（毎回ファイルを読み直す設計）
