# rules/kotlin/ — Kotlin/Android ルール

Kotlin・Android・KMP プロジェクトに適用されるルール群。

## ファイル一覧

| ファイル | 内容 |
|---------|-----|
| `coding-style.md` | Kotlin慣用表現・Compose・Clean Architecture |
| `testing.md` | Kotest・MockK・Kover カバレッジ |
| `patterns.md` | KMP・Android固有パターン |
| `hooks.md` | PostToolUse フック（ktlint） |
| `security.md` | Android セキュリティ・ProGuard |

## 関連エージェント

- レビュー: `kotlin-reviewer`
- ビルドエラー: `kotlin-build-resolver` → `/kotlin-build`
- Gradleビルドエラー: → `/gradle-build`
- テスト: `tdd-guide` → `/kotlin-test`
