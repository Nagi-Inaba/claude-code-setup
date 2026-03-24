---
description: Diagnose Claude Code environment health (hooks, config, cross-refs, state files, workflow)
---

# Environment Doctor

Run comprehensive health checks on the ~/.claude/ environment.

## Usage

`/env-doctor [scope] [--fix] [--update-baseline]`

- `scope` (optional): `all` (default), `hooks`, `crossref`, `config`, `state`, `workflow`, `regression`
- `--fix`: Attempt automatic fixes for safe issues (stale locks, counter resets, count updates)
- `--update-baseline`: Save current state as the new baseline for drift detection

## Execution

1. Run the core diagnostic library to execute all checks:
   ```bash
   node -e "const c = require('~/.claude/scripts/lib/env-doctor-checks.js'); console.log(c.formatReport(c.runFullChecks()))"
   ```

2. Review the report and provide analysis:
   - For each CRITICAL issue: explain the impact and provide exact fix commands
   - For each WARNING: explain the risk and suggest remediation
   - For OK categories: confirm briefly

3. If `--fix` was specified:
   - Clean stale lock files: `rm /tmp/.claude-hook-locks/*.lock`
   - Reset corrupted counter files
   - Update CLAUDE.md declared counts to match actual

4. If `--update-baseline` was specified:
   ```bash
   node -e "const c = require('~/.claude/scripts/lib/env-doctor-checks.js'); const fs = require('fs'); fs.writeFileSync('~/.claude/config/env-doctor-baseline.json', JSON.stringify(c.generateBaseline(), null, 2))"
   ```

## Scoped Execution

When a specific scope is provided, only run checks for that category:
- `hooks`: Category 1 (8 checks) — hook scripts, syntax, locks, counters
- `crossref`: Category 2 (6 checks) — routing, index, CLAUDE.md references
- `config`: Category 3 (5 checks) — deny list, hook counts, plugins, mode
- `state`: Category 4 (4 checks) — sessions, homunculus, triggers, learned
- `workflow`: Category 5 (3 checks) — routing resolution, quality gates, dev chain
- `regression`: Category 6 (3 checks) — agent/skill/command count drift

## Relationship to /harness-audit

| Tool | Question | Output |
|------|----------|--------|
| `/harness-audit` | Is this a good setup? | Score 0-70 |
| `/env-doctor` | Is this setup working? | 29 checks PASS/FAIL |

Run both for complete coverage. If `/env-doctor` finds config drift, also run `/harness-audit`.

## Arguments

$ARGUMENTS:
- `all|hooks|crossref|config|state|workflow|regression` (optional scope)
- `--fix` (optional: auto-fix safe issues)
- `--update-baseline` (optional: save current state as baseline)
