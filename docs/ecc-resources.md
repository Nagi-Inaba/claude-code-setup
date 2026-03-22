# Everything Claude Code (ECC) — リソース詳細

ECC v1.8.0 が `~/.claude/` にインストール済み。

## リソース一覧

- **エージェント** (`~/.claude/agents/`): 24種 — 実装(frontend/backend/infra/mobile-engineer, ui-designer) + 品質(code-reviewer, security-reviewer等) + 計画(planner, architect) + 運用(env-doctor等)
- **コマンド** (`~/.claude/commands/`): 49種 + ps-系3種 — `/plan`, `/code-review`, `/tdd`, `/verify`, `/skill-create` 等
- **スキル** (`~/.claude/skills/`): 数は `skills/CLAUDE.md` 参照 — deep-research, e2e-testing, security, coding-standards 等（SessionEnd で OneDrive に自動同期）
- **ルール** (`~/.claude/rules/`): TypeScript, Python, Go, Kotlin, Swift, PHP, Perl 共通ルール（各フォルダに CLAUDE.md あり）

## 更新方法

```bash
cd C:/dev/everything-claude-code && git pull && node scripts/install-apply.js --profile full
```
