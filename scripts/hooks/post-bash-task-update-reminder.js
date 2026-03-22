#!/usr/bin/env node
'use strict';

/**
 * PostToolUse hook: Reminds to update task file after git commit.
 *
 * Triggers when a `git commit` command is detected.
 * Outputs a reminder to stderr so it gets injected into the conversation context.
 */

const MAX_STDIN = 1024 * 1024;
let raw = '';

process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  if (raw.length < MAX_STDIN) {
    const remaining = MAX_STDIN - raw.length;
    raw += chunk.substring(0, remaining);
  }
});

process.stdin.on('end', () => {
  try {
    const input = JSON.parse(raw);
    const cmd = String(input.tool_input?.command || '');
    const output = String(input.tool_output?.output || '');

    // Detect successful git commit
    if (/\bgit\s+commit\b/.test(cmd) && !output.includes('nothing to commit')) {
      const today = new Date().toISOString().slice(0, 10);
      const taskFile = `.company/secretary/todos/${today}.md`;
      console.error(`[MANDATORY] git commit 検出。作業完了タスクがあれば ${taskFile} を更新してください（完了タスクに [x] を付ける、新規タスクがあれば追加）。`);
    }
  } catch {
    // ignore parse errors
  }

  process.stdout.write(raw);
});
