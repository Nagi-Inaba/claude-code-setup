#!/usr/bin/env bash
set -euo pipefail

# Remove installed components (preserves settings.json, CLAUDE.md, and user data)

CLAUDE_DIR="$HOME/.claude"

echo "This will remove agents, commands, skills, rules, scripts, hooks, and docs from ~/.claude/"
echo "Your settings.json, CLAUDE.md, sessions, and personal data will NOT be removed."
echo ""
read -p "Continue? [y/N] " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

DIRS_TO_REMOVE=(
  "$CLAUDE_DIR/agents"
  "$CLAUDE_DIR/commands"
  "$CLAUDE_DIR/skills"
  "$CLAUDE_DIR/rules"
  "$CLAUDE_DIR/scripts"
  "$CLAUDE_DIR/hooks"
  "$CLAUDE_DIR/docs"
)

for dir in "${DIRS_TO_REMOVE[@]}"; do
  if [ -d "$dir" ]; then
    rm -rf "$dir"
    echo "Removed: $dir"
  fi
done

echo ""
echo "Uninstall complete. Your settings.json, CLAUDE.md, and personal data are preserved."
echo "Restart Claude Code to apply changes."
