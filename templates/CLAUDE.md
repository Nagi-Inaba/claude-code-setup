# Claude Code Global Settings

## Development Workflow

### Feature Implementation Flow
```
Research → Plan → TDD → Code Review → Commit
```

1. **Research & Reuse** - Search GitHub/npm/PyPI before writing new code
2. **Plan First** - Use `planner` agent for complex features
3. **TDD Approach** - Write tests first, then implement
4. **Code Review** - Use `code-reviewer` agent after writing code
5. **Commit** - Follow conventional commits format

## Available Resources

### Agents (20)
Run specialized agents for: planning, architecture, code review, security, TDD, build errors, E2E testing, refactoring, documentation, and more.

### Commands (69+)
- `/plan` - Feature planning
- `/code-review` - Code review
- `/tdd` - Test-driven development
- `/verify` - Verification loop
- `/build-fix` - Build error resolution
- `/e2e` - E2E testing
- `/qa` - Web QA testing
- `/autoresearch` - Autonomous improvement loop

### Skills (91)
Deep-research, e2e-testing, security, coding-standards, frontend/backend patterns, and many more.

### Rules
Language-specific coding standards for: TypeScript, Python, Go, Kotlin, Swift, PHP, Perl.

## Hooks (Auto-enabled)

- **PreToolUse**: tmux reminders, git push confirmation, security checks
- **PostToolUse**: CLAUDE.md validation, auto-formatting, type checking, quality gates
- **Stop**: console.log check, session save, cost tracking
- **SessionStart**: previous session load, environment health check

## Windows Environment Notes

- `winget install` の MSI パッケージは CLI から失敗しやすい → zip 展開 + `~/bin/` に配置を優先
- Git Bash の jq で `!=` が `\!=` にエスケープされる → `python -c` で JSON パースを代替
- `gh auth login --web` でブラウザが開かない場合 → デバイスコード方式 (`https://github.com/login/device`) を案内
- `gh` CLI は `~/bin/gh.exe` にインストール済み → `export PATH="$HOME/bin:$PATH"` が必要

## Security Module

- `Nagi-ip/claude-security-module` からインストール済み
- deny: 59ルール（curl/rm/sudo/powershell/秘密ファイル等をブロック。npx/python -c は都度確認に格下げ済み）
- allow: 119ルール（git操作/npm run/npx開発ツール/go/pip等を自動承認）
- WebFetch ドメインガード + 設定変更監査ログ有効
- permissions 変更時は deny から外す＝都度確認、allow に入れる＝自動承認、の2段階で管理

## Codex Integration

- Codex を使う場合は `/codex:*` プラグインコマンド経由で使用する（CLI 直接実行ではなく `codex@openai-codex` プラグイン）
- コードレビュー: `/codex:review` または `/codex:adversarial-review`
- タスク委譲: `/codex:rescue` で Codex にタスクを委任
- 状態確認: `/codex:status`, `/codex:result`, `/codex:cancel`
- サブエージェント `codex:codex-rescue` も利用可能
- Codex 設定は `~/.codex/config.toml` で管理

## Gotchas

- `settings.json` の deny はブランケット deny（`Bash(npx *)`等）で特定 allow より優先されうる → 個別 allow で制御する場合は deny から除外が必要
- Playwright MCP の `--allowed-origins` はドメイン許可であり、`file://` プロトコル許可ではない → `file://` ナビゲーションには `--allow-unrestricted-file-access` フラグが必要
- プラグインの `.mcp.json`（`plugins/cache/`, `plugins/marketplaces/`）を直接編集してもプラグイン更新で上書きされる → 永続的なカスタマイズは `~/.claude/mcp.json` で上書きする
