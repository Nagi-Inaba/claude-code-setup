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

### Skills (70+)
Deep-research, e2e-testing, security, coding-standards, frontend/backend patterns, and many more.

### Rules
Language-specific coding standards for: TypeScript, Python, Go, Kotlin, Swift, PHP, Perl.

## Hooks (Auto-enabled)

- **PreToolUse**: tmux reminders, git push confirmation, security checks
- **PostToolUse**: CLAUDE.md validation, auto-formatting, type checking, quality gates
- **Stop**: console.log check, session save, cost tracking
- **SessionStart**: previous session load, environment health check

## Customization

Edit this file to add your own project-specific settings.
Add project-specific CLAUDE.md files in each project directory.
