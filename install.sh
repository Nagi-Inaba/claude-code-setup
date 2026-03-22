#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Claude Code Setup - Installer
# One-command setup for a fully-configured Claude Code environment
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude"
DRY_RUN=false
BACKUP=false
SKIP_HOOKS=false
LANGUAGES=""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()   { echo -e "${GREEN}[+]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
err()   { echo -e "${RED}[x]${NC} $1"; }
info()  { echo -e "${BLUE}[i]${NC} $1"; }

usage() {
  cat <<EOF
Usage: ./install.sh [OPTIONS]

Options:
  --dry-run          Preview what would be installed
  --backup           Backup existing ~/.claude/ before installing
  --skip-hooks       Skip hook installation
  --languages "..."  Install only specific language rules (e.g., "typescript python")
  --help             Show this help

Examples:
  ./install.sh                              # Full install
  ./install.sh --backup                     # Install with backup
  ./install.sh --languages "typescript go"  # Only TS + Go rules
  ./install.sh --dry-run                    # Preview only
EOF
  exit 0
}

copy_dir() {
  local src="$1"
  local dest="$2"
  local label="$3"
  local count

  if [ ! -d "$src" ]; then
    warn "Source not found: $src"
    return
  fi

  count=$(find "$src" -type f | wc -l)

  if $DRY_RUN; then
    info "[DRY-RUN] Would copy $label ($count files): $src -> $dest"
  else
    mkdir -p "$dest"
    cp -r "$src"/* "$dest"/ 2>/dev/null || true
    log "Installed $label ($count files)"
  fi
}

generate_settings_hooks() {
  local CLAUDE_PATH
  CLAUDE_PATH="$CLAUDE_DIR"

  # Detect Windows and convert path for JSON
  if [[ "${OSTYPE:-}" == "msys" || "${OSTYPE:-}" == "cygwin" || "${OSTYPE:-}" == "win32" ]]; then
    CLAUDE_PATH=$(cygpath -w "$CLAUDE_DIR" 2>/dev/null || echo "$CLAUDE_DIR")
    CLAUDE_PATH="${CLAUDE_PATH//\\/\\\\}"
  fi

  if $DRY_RUN; then
    info "[DRY-RUN] Would generate hooks config with path: $CLAUDE_PATH"
    return
  fi

  local HOOKS_FILE="$CLAUDE_DIR/config/generated-hooks.json"

  cat > "$HOOKS_FILE" <<HOOKS_EOF
{
  "hooks": {
    "PreToolUse": [
      {"matcher": "Bash", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/auto-tmux-dev.js\""}]},
      {"matcher": "Bash", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"pre:bash:tmux-reminder\" \"scripts/hooks/pre-bash-tmux-reminder.js\" \"strict\""}]},
      {"matcher": "Bash", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"pre:bash:git-push-reminder\" \"scripts/hooks/pre-bash-git-push-reminder.js\" \"strict\""}]},
      {"matcher": "Write", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"pre:write:doc-file-warning\" \"scripts/hooks/doc-file-warning.js\" \"standard,strict\""}]},
      {"matcher": "Edit|Write", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"pre:edit-write:suggest-compact\" \"scripts/hooks/suggest-compact.js\" \"standard,strict\""}]},
      {"matcher": "Bash", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"pre:bash:dev-server-block\" \"scripts/hooks/pre-bash-dev-server-block.js\" \"standard,strict\""}]},
      {"matcher": "Bash", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"pre:bash:error-pattern-guard\" \"scripts/hooks/error-pattern-guard.js\" \"standard,strict\""}]}
    ],
    "PostToolUse": [
      {"matcher": "Write|Edit", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"post:write-edit:claude-md-check\" \"scripts/hooks/claude-md-check.js\" \"standard,strict\""}]},
      {"matcher": "Edit|Write", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"post:edit-write:claude-md-reminder\" \"scripts/hooks/claude-md-periodic-reminder.js\" \"standard,strict\""}]},
      {"matcher": "Edit|Write", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"post:edit-write:security-check\" \"scripts/hooks/security-periodic-check.js\" \"standard,strict\""}]},
      {"matcher": "Bash", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"post:bash:pr-created\" \"scripts/hooks/post-bash-pr-created.js\" \"standard,strict\""}]},
      {"matcher": "Edit|Write|MultiEdit", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"post:quality-gate\" \"scripts/hooks/quality-gate.js\" \"standard,strict\"", "timeout": 30, "async": true}]},
      {"matcher": "Edit", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"post:edit:format\" \"scripts/hooks/post-edit-format.js\" \"standard,strict\""}]},
      {"matcher": "Edit", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"post:edit:typecheck\" \"scripts/hooks/post-edit-typecheck.js\" \"standard,strict\""}]},
      {"matcher": "Edit", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"post:edit:console-warn\" \"scripts/hooks/post-edit-console-warn.js\" \"standard,strict\""}]},
      {"matcher": "Bash", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"post:bash:build-complete\" \"scripts/hooks/post-bash-build-complete.js\" \"standard,strict\""}]},
      {"matcher": "Bash", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"post:bash:error-pattern-capture\" \"scripts/hooks/error-pattern-capture.js\" \"standard,strict\""}]}
    ],
    "UserPromptSubmit": [
      {"matcher": "*", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"user:dev-workflow-init\" \"scripts/hooks/dev-workflow-init.js\" \"standard,strict\""}]}
    ],
    "Stop": [
      {"matcher": "*", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"stop:check-console-log\" \"scripts/hooks/check-console-log.js\" \"standard,strict\""}]},
      {"matcher": "*", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"stop:revise-claude-md\" \"scripts/hooks/stop-revise-claude-md.js\" \"standard,strict\""}]},
      {"matcher": "*", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"stop:dev-completion-review\" \"scripts/hooks/stop-dev-completion-review.js\" \"standard,strict\""}]},
      {"matcher": "*", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"stop:session-end\" \"scripts/hooks/session-end.js\" \"minimal,standard,strict\"", "timeout": 10, "async": true}]},
      {"matcher": "*", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"stop:cost-tracker\" \"scripts/hooks/cost-tracker.js\" \"minimal,standard,strict\"", "timeout": 10, "async": true}]},
      {"matcher": "*", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"stop:evaluate-session\" \"scripts/hooks/evaluate-session.js\" \"standard,strict\"", "timeout": 15, "async": true}]},
      {"matcher": "*", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"stop:error-pattern-maintain\" \"scripts/hooks/error-pattern-maintain.js\" \"standard,strict\"", "timeout": 15, "async": true}]}
    ],
    "SessionStart": [
      {"matcher": "*", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"session:start\" \"scripts/hooks/session-start.js\" \"minimal,standard,strict\""}]},
      {"matcher": "*", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"session:env-doctor-quick\" \"scripts/hooks/env-doctor-quick.js\" \"minimal,standard,strict\""}]},
      {"matcher": "*", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"session:error-pattern-inject\" \"scripts/hooks/error-pattern-inject.js\" \"minimal,standard,strict\""}]}
    ],
    "SessionEnd": [
      {"matcher": "*", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"session:end:marker\" \"scripts/hooks/session-end-marker.js\" \"minimal,standard,strict\""}]}
    ],
    "PreCompact": [
      {"matcher": "*", "hooks": [{"type": "command", "command": "node \"${CLAUDE_PATH}/scripts/hooks/run-with-flags.js\" \"pre:compact\" \"scripts/hooks/pre-compact.js\" \"standard,strict\""}]}
    ]
  }
}
HOOKS_EOF

  log "Generated hooks config: $HOOKS_FILE"
  info "To apply: copy the 'hooks' section into ~/.claude/settings.json"
}

# ============================================================
# Main
# ============================================================

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)    DRY_RUN=true; shift ;;
    --backup)     BACKUP=true; shift ;;
    --skip-hooks) SKIP_HOOKS=true; shift ;;
    --languages)  LANGUAGES="$2"; shift 2 ;;
    --help)       usage ;;
    *)            err "Unknown option: $1"; usage ;;
  esac
done

echo ""
echo "============================================"
echo "  Claude Code Setup - Installer"
echo "============================================"
echo ""

# Pre-flight checks
if ! command -v claude &>/dev/null; then
  warn "Claude Code CLI not found. Install it first:"
  info "  npm install -g @anthropic-ai/claude-code"
  echo ""
fi

if ! command -v node &>/dev/null; then
  err "Node.js is required for hook scripts. Please install Node.js first."
  exit 1
fi

# Backup
if $BACKUP && [ -d "$CLAUDE_DIR" ]; then
  BACKUP_DIR="$CLAUDE_DIR.backup.$(date +%Y%m%d_%H%M%S)"
  if $DRY_RUN; then
    info "[DRY-RUN] Would backup $CLAUDE_DIR -> $BACKUP_DIR"
  else
    log "Backing up $CLAUDE_DIR -> $BACKUP_DIR"
    cp -r "$CLAUDE_DIR" "$BACKUP_DIR"
  fi
fi

# Create directories
DIRS=(
  "$CLAUDE_DIR"
  "$CLAUDE_DIR/agents"
  "$CLAUDE_DIR/commands"
  "$CLAUDE_DIR/skills"
  "$CLAUDE_DIR/rules"
  "$CLAUDE_DIR/scripts/hooks"
  "$CLAUDE_DIR/scripts/lib"
  "$CLAUDE_DIR/hooks"
  "$CLAUDE_DIR/docs"
  "$CLAUDE_DIR/config"
  "$CLAUDE_DIR/sessions"
  "$CLAUDE_DIR/error-patterns"
)

for dir in "${DIRS[@]}"; do
  if $DRY_RUN; then
    [ ! -d "$dir" ] && info "[DRY-RUN] Would create: $dir"
  else
    mkdir -p "$dir"
  fi
done

# Install core components
log "Installing agents..."
copy_dir "$SCRIPT_DIR/agents" "$CLAUDE_DIR/agents" "agents"

log "Installing commands..."
copy_dir "$SCRIPT_DIR/commands" "$CLAUDE_DIR/commands" "commands"

log "Installing skills..."
copy_dir "$SCRIPT_DIR/skills" "$CLAUDE_DIR/skills" "skills"

log "Installing docs..."
copy_dir "$SCRIPT_DIR/docs" "$CLAUDE_DIR/docs" "docs"

# Rules (language-filtered)
log "Installing rules..."
if [ -n "$LANGUAGES" ]; then
  copy_dir "$SCRIPT_DIR/rules/common" "$CLAUDE_DIR/rules/common" "rules/common"
  for lang in $LANGUAGES; do
    if [ -d "$SCRIPT_DIR/rules/$lang" ]; then
      copy_dir "$SCRIPT_DIR/rules/$lang" "$CLAUDE_DIR/rules/$lang" "rules/$lang"
    else
      warn "Language rules not found: $lang"
    fi
  done
else
  for rule_dir in "$SCRIPT_DIR/rules"/*/; do
    dirname=$(basename "$rule_dir")
    copy_dir "$rule_dir" "$CLAUDE_DIR/rules/$dirname" "rules/$dirname"
  done
fi
cp "$SCRIPT_DIR/rules/CLAUDE.md" "$CLAUDE_DIR/rules/" 2>/dev/null || true
cp "$SCRIPT_DIR/rules/README.md" "$CLAUDE_DIR/rules/" 2>/dev/null || true

# Hook scripts
if ! $SKIP_HOOKS; then
  log "Installing hook scripts..."
  copy_dir "$SCRIPT_DIR/scripts/hooks" "$CLAUDE_DIR/scripts/hooks" "hook scripts"
  [ -d "$SCRIPT_DIR/scripts/lib" ] && copy_dir "$SCRIPT_DIR/scripts/lib" "$CLAUDE_DIR/scripts/lib" "script libraries"

  if [ -f "$SCRIPT_DIR/hooks/hooks.json" ]; then
    if $DRY_RUN; then
      info "[DRY-RUN] Would copy hooks/hooks.json"
    else
      cp "$SCRIPT_DIR/hooks/hooks.json" "$CLAUDE_DIR/hooks/"
      log "Installed hooks/hooks.json"
    fi
  fi

  # Top-level scripts
  for script_file in "$SCRIPT_DIR"/scripts/*.{js,sh,md}; do
    [ -f "$script_file" ] || continue
    if $DRY_RUN; then
      info "[DRY-RUN] Would copy $(basename "$script_file")"
    else
      cp "$script_file" "$CLAUDE_DIR/scripts/"
    fi
  done

  log "Generating settings.json hooks..."
  generate_settings_hooks
fi

# Config
[ -d "$SCRIPT_DIR/config" ] && copy_dir "$SCRIPT_DIR/config" "$CLAUDE_DIR/config" "config"

# Templates (only if not existing)
if [ ! -f "$CLAUDE_DIR/settings.json" ]; then
  if $DRY_RUN; then
    info "[DRY-RUN] Would create settings.json from template"
  else
    cp "$SCRIPT_DIR/templates/settings.json" "$CLAUDE_DIR/settings.json"
    log "Created settings.json from template"
  fi
else
  info "settings.json already exists, skipping (see templates/ for reference)"
fi

if [ ! -f "$CLAUDE_DIR/CLAUDE.md" ]; then
  if $DRY_RUN; then
    info "[DRY-RUN] Would create CLAUDE.md from template"
  else
    cp "$SCRIPT_DIR/templates/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"
    log "Created CLAUDE.md from template"
  fi
else
  info "CLAUDE.md already exists, skipping"
fi

# Initialize error-patterns
for f in patterns.json pending.json archive.json; do
  target="$CLAUDE_DIR/error-patterns/$f"
  if [ ! -f "$target" ] && ! $DRY_RUN; then
    echo '[]' > "$target"
  fi
done

# Done
echo ""
echo "============================================"
log "Installation complete!"
echo "============================================"
echo ""
info "What's installed:"
info "  - 24 agents          (~/.claude/agents/)"
info "  - 59 commands        (~/.claude/commands/)"
info "  - 91 skills          (~/.claude/skills/)"
info "  - 7 language rules   (~/.claude/rules/)"
info "  - 39 hook scripts    (~/.claude/scripts/hooks/)"
info "  - Documentation      (~/.claude/docs/)"
echo ""
info "Next steps:"
info "  1. Merge hooks from ~/.claude/config/generated-hooks.json into settings.json"
info "  2. Review ~/.claude/CLAUDE.md and add your preferences"
info "  3. Install plugins: claude plugins install <name>@<marketplace>"
info "  4. Restart Claude Code to activate hooks"
echo ""
info "Recommended plugins (from extraKnownMarketplaces in settings.json):"
info "  company@cc-company"
info "  secretary@cc-secretary"
info "  engineering@knowledge-work-plugins"
info "  code-review@claude-plugins-official"
info "  skill-creator@claude-plugins-official"
echo ""
