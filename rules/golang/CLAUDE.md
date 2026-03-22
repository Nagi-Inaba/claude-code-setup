# rules/golang/ — Go ルール

Go プロジェクトに適用されるルール群。

## ファイル一覧

| ファイル | 内容 |
|---------|-----|
| `coding-style.md` | gofmt・エラーハンドリング・慣用的Go |
| `testing.md` | テーブル駆動テスト・go test・ベンチマーク |
| `patterns.md` | Go固有デザインパターン・インターフェース |
| `hooks.md` | PostToolUse フック（gofmt・go vet） |
| `security.md` | 入力検証・goroutine安全性 |

## 関連エージェント

- レビュー: `go-reviewer`
- ビルドエラー: `go-build-resolver`
- テスト: `tdd-guide` (`/go-test` コマンド)
