# rules/php/ — PHP ルール

PHP プロジェクトに適用されるルール群。

## ファイル一覧

| ファイル | 内容 |
|---------|-----|
| `coding-style.md` | PSR-12・型宣言・PHP-CS-Fixer |
| `testing.md` | PHPUnit・テストダブル |
| `patterns.md` | PHP固有デザインパターン |
| `hooks.md` | PostToolUse フック（php-cs-fixer） |
| `security.md` | SQLインジェクション・XSS・CSRF防止 |

## 関連エージェント

- レビュー: `code-reviewer`
- ビルドエラー: `build-error-resolver`
- テスト: `tdd-guide`
