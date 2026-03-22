# hooks/ — フック定義

Claude Code のライフサイクルフック。自動実行される処理を定義する。

## フック種類

| 種類 | タイミング | 用途 |
|-----|----------|-----|
| `PreToolUse` | ツール実行前 | バリデーション・パラメータ変更 |
| `PostToolUse` | ツール実行後 | 自動フォーマット・整合性チェック |
| `Stop` | セッション終了時 | 最終検証・セッション保存 |

## 設定ファイル

- `hooks.json` — フック定義（全フックの登録）
- `README.md` — フック実装ガイド

## 重要なフック

| フック | スクリプト | 用途 |
|-------|----------|-----|
| PostToolUse (Write/Edit) | `claude-md-check.js` | CLAUDE.md変更検出 → claude-md-improver実行指示を注入 |
| Stop | `session-end.js` | セッション終了時に状態を自動保存 |
