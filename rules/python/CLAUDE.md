# rules/python/ — Python ルール

Python プロジェクトに適用されるルール群。

## ファイル一覧

| ファイル | 内容 |
|---------|-----|
| `coding-style.md` | PEP 8・型ヒント・Black/Ruff設定 |
| `testing.md` | pytest・カバレッジ・フィクスチャ |
| `patterns.md` | Python固有デザインパターン |
| `hooks.md` | PostToolUse フック（Black・mypy） |
| `security.md` | 入力検証・SQLインジェクション防止 |

## 関連エージェント

- レビュー: `python-reviewer`
- ビルドエラー: `build-error-resolver`
- テスト: `tdd-guide`
