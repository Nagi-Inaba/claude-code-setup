# Claude Code Setup

A fully-configured Claude Code environment with 24 agents, 59 commands, 91 skills, 7 language rule sets, and 39 automation hooks.

Built on [Everything Claude Code (ECC)](https://github.com/anthropics/everything-claude-code) v1.8.0 with extensive customization.

## Quick Start

```bash
git clone https://github.com/Nagi-Inaba/claude-code-setup.git
cd claude-code-setup
./install.sh
```

### Install Options

```bash
./install.sh --dry-run                     # Preview without installing
./install.sh --backup                      # Backup existing config first
./install.sh --skip-hooks                  # Skip hook scripts
./install.sh --languages "typescript go"   # Only specific language rules
```

## What's Included

### Agents (24)

Specialized AI agents for different development tasks:

| Agent | Purpose |
|-------|---------|
| **Implementation** | |
| `frontend-engineer` | Next.js App Router + React 19 + Tailwind CSS |
| `backend-engineer` | DDD 4-layer + Next.js Server Actions + Prisma |
| `infra-engineer` | Vercel + Supabase + GitHub Actions + Docker |
| `mobile-engineer` | React Native/Expo + Swift/SwiftUI + Kotlin/Compose |
| `ui-designer` | Design system, UI prototyping, accessibility |
| **Planning & Architecture** | |
| `planner` | Implementation planning for complex features |
| `architect` | System design & architecture decisions |
| **Quality & Review** | |
| `code-reviewer` | Code review with quality gates |
| `security-reviewer` | Security vulnerability detection |
| `tdd-guide` | Test-driven development workflow |
| `build-error-resolver` | Build failure diagnosis |
| `e2e-runner` | End-to-end testing |
| `refactor-cleaner` | Dead code cleanup |
| `doc-updater` | Documentation maintenance |
| **Language-Specific** | |
| `go-reviewer` / `go-build-resolver` | Go-specific review & builds |
| `kotlin-reviewer` / `kotlin-build-resolver` | Kotlin/Android review & builds |
| `python-reviewer` | Python code review |
| `database-reviewer` | Database schema & query review |
| **Operations** | |
| `env-doctor` | Environment health diagnostics |
| `harness-optimizer` | Test harness optimization |
| `loop-operator` | Agent loop orchestration |
| `chief-of-staff` | Executive oversight |

### Commands (59)

Slash commands for common workflows:

| Category | Commands |
|----------|----------|
| **Planning** | `/plan`, `/office-hours` |
| **Development** | `/tdd`, `/build-fix`, `/verify`, `/quality-gate` |
| **Review** | `/code-review`, `/python-review`, `/go-review`, `/kotlin-review` |
| **Testing** | `/e2e`, `/qa`, `/test-coverage`, `/go-test`, `/kotlin-test` |
| **Research** | `/autoresearch` (+ 7 subcommands: plan, debug, fix, predict, scenario, security, ship) |
| **Session** | `/save-session`, `/resume-session`, `/sessions`, `/checkpoint` |
| **Multi-model** | `/multi-plan`, `/multi-backend`, `/multi-frontend`, `/multi-workflow` |
| **Maintenance** | `/refactor-clean`, `/update-docs`, `/update-codemaps`, `/retro` |
| **DDD (Product Starter)** | `/ps-init`, `/ps-plan`, `/ps-pr` |
| **Learning** | `/learn`, `/instinct-status`, `/evolve`, `/promote` |

### Skills (91)

Deep knowledge modules for specific domains:

- **Backend**: backend-patterns, django-*, springboot-*, golang-*, python-*, postgres-patterns, clickhouse-io
- **Frontend**: frontend-patterns, frontend-design, frontend-slides
- **Testing**: e2e-testing, tdd-workflow, verification-loop, eval-harness
- **Security**: security-review, security-scan
- **Research**: deep-research, autoresearch, exa-search
- **Content**: article-writing, content-engine, crosspost, video-editing, videodb
- **Design**: canvas-design, ui-ux-pro-max, vibe-design, brand-guidelines, theme-factory
- **Business**: investor-materials, investor-outreach, market-research
- **DDD**: ps-add-feature, ps-add-page, ps-db-table, ps-add-api-integration, ps-design-ui, ps-fix-error
- **Tools**: claude-api, x-api, mcp-builder, docx, pdf, pptx, xlsx
- **Learning**: continuous-learning, continuous-learning-v2

### Rules (7 Languages)

Coding standards and best practices:

| Language | Includes |
|----------|----------|
| **Common** | agents, coding-style, development-workflow, git-workflow, hooks, performance, security, testing, ban-patterns |
| **TypeScript** | ESLint, Prettier, type guards, React/Next.js patterns |
| **Python** | PEP 8, Black, mypy, Ruff, pytest |
| **Go** | gofmt, error handling, table-driven tests |
| **Kotlin** | ktlint, Compose, Clean Architecture, Kotest |
| **Swift** | SwiftUI, actor isolation, XCTest |
| **PHP** | PSR-12, type declarations, PHPUnit |
| **Perl** | strict/warnings, taint mode, Test::More |

### Hooks (39 scripts)

Automated quality gates and workflows:

| Phase | Hooks |
|-------|-------|
| **PreToolUse** | tmux auto-setup, git push reminder, dev server block, security monitoring, error pattern guard |
| **PostToolUse** | CLAUDE.md validation, auto-formatting, type checking, console.log detection, quality gates, security checks |
| **UserPromptSubmit** | Dev workflow auto-trigger (PRD/planning) |
| **Stop** | Console.log check, CLAUDE.md revision, session save, cost tracking, pattern learning |
| **SessionStart** | Previous session load, environment health check, error pattern injection |
| **SessionEnd** | Session marker |

## Directory Structure

```
~/.claude/
├── agents/           # 24 specialized agents
├── commands/         # 59 slash commands
├── skills/           # 91 knowledge modules
├── rules/            # 7-language coding standards
│   ├── common/       # Universal rules
│   ├── typescript/
│   ├── python/
│   ├── golang/
│   ├── kotlin/
│   ├── swift/
│   ├── php/
│   └── perl/
├── scripts/
│   ├── hooks/        # 39 hook scripts
│   └── lib/          # Shared libraries
├── hooks/
│   └── hooks.json    # Hook definitions (plugin format)
├── docs/             # Routing guide, indexes, org structure
├── config/           # Dev workflow triggers, env baselines
├── settings.json     # Permissions, hooks, plugins
└── CLAUDE.md         # Global instructions
```

## Post-Install Setup

### 1. Apply Hooks to settings.json

After install, merge the generated hooks into your settings:

```bash
cat ~/.claude/config/generated-hooks.json
# Copy the "hooks" section into ~/.claude/settings.json
```

### 2. Install Recommended Plugins

```bash
# Organization plugins
claude plugins install company@cc-company
claude plugins install secretary@cc-secretary

# Anthropic official
claude plugins install engineering@knowledge-work-plugins
claude plugins install code-review@claude-plugins-official
claude plugins install skill-creator@claude-plugins-official
claude plugins install plugin-dev@claude-plugins-official

# Financial (optional)
claude plugins install financial-analysis@financial-services-plugins
```

### 3. Customize CLAUDE.md

Edit `~/.claude/CLAUDE.md` to add your:
- Project-specific instructions
- Preferred language
- Development workflow customizations

## Development Workflow

The setup enforces this workflow for new features:

```
PRD (auto-triggered) -> Plan -> TDD (Red/Green/Refactor) -> Code Review -> Commit
```

With automated quality gates:
- CLAUDE.md consistency checks (every 15 edits)
- Security scanning (every 20 edits)
- Error pattern learning (continuous)
- Session state persistence (on every stop)

## Uninstall

```bash
./uninstall.sh
```

This removes agents, commands, skills, rules, scripts, hooks, and docs. Your `settings.json`, `CLAUDE.md`, and personal data are preserved.

## Requirements

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)
- Node.js (for hook scripts)
- Git

## Credits & Sources

This repository is built on top of the following open-source projects and resources:

### Core Framework

| Project | Author | Description |
|---------|--------|-------------|
| [Everything Claude Code (ECC)](https://github.com/anthropics/everything-claude-code) | [affaan-m](https://github.com/affaan-m) | Base framework for agents, commands, skills, rules, and hooks |

### Plugins & Marketplaces

| Plugin | Repository | Description |
|--------|-----------|-------------|
| Knowledge Work Plugins | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) | Anthropic official: sales, engineering, design, operations, etc. |
| Claude Plugins Official | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Anthropic official: code-review, plugin-dev, skill-creator, LSPs, etc. |
| Financial Services Plugins | [anthropics/financial-services-plugins](https://github.com/anthropics/financial-services-plugins) | Anthropic official: equity research, financial analysis, investment banking |
| cc-company | [Shin-sibainu/cc-company](https://github.com/Shin-sibainu/cc-company) | Virtual company organization plugin |
| cc-secretary | [Shin-sibainu/cc-secretary](https://github.com/Shin-sibainu/cc-secretary) | Personal secretary & life/work management |
| arscontexta | [agenticnotetaking/arscontexta](https://github.com/agenticnotetaking/arscontexta) | Skill Graphs: wikilinks-connected skill network |

### Individual Skills

| Skill | Author / Source | Description |
|-------|----------------|-------------|
| `prd`, `ralph` | [snarktank/ralph](https://github.com/snarktank/ralph) | PRD generation & task decomposition |
| `company` | [Shin-sibainu/cc-company](https://github.com/Shin-sibainu/cc-company) | Virtual company organization |
| `secretary` | [Shin-sibainu/cc-secretary](https://github.com/Shin-sibainu/cc-secretary) (author: nyosegawa) | Personal secretary system |
| `vercel-react-best-practices` | [Vercel Engineering](https://github.com/vercel) | React/Next.js performance patterns |
| `vercel-composition-patterns` | [Vercel Engineering](https://github.com/vercel) | React composition & compound components |
| `vercel-react-native-skills` | [Vercel Engineering](https://github.com/vercel) | React Native performance patterns |
| `vercel-deploy-claimable` | [Vercel Engineering](https://github.com/vercel) | Vercel deployment workflows |
| `ui-ux-pro-max` | Community contribution | 67 UI styles, 96 palettes, 57 font pairings |
| `vibe-design` | Sota Mikami | UI prototyping workflow |
| `continuous-learning-v2` | ECC | Instinct-based learning system |

### Product Starter (DDD Tools)

| Skill | Repository | Description |
|-------|-----------|-------------|
| `ps-add-feature`, `ps-add-page`, `ps-db-table`, `ps-add-api-integration`, `ps-design-ui`, `ps-fix-error` | [jujunjun110/product-starter](https://github.com/jujunjun110/product-starter) | DDD 4-layer architecture tools for Next.js + Prisma + Supabase |

### Other Tools Referenced

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) by Anthropic
- [gstack](https://github.com/garrytan/gstack) by Garry Tan - Framework merged into code-reviewer, planner, build-error-resolver agents

## License

MIT
