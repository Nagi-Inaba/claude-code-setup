'use strict';

/**
 * PostToolUse (Bash) — Error Pattern Capture & Resolution Tracking
 *
 * On error (exit_code != 0):
 *   - Check against known patterns → suggest fix
 *   - If unknown → add to pending for resolution tracking
 *
 * On success (exit_code == 0):
 *   - Check recent pending entries → if this command resolves one, create/update pattern
 */

const db = require('../lib/error-pattern-db');

const RESOLUTION_WINDOW_MS = 60 * 1000; // 60 seconds
const MAX_PENDING_SCAN = 5;

function run(rawInput) {
  try {
    const input = JSON.parse(rawInput);

    // PostToolUse input structure: { tool_name, tool_input, tool_result }
    const toolInput = input.tool_input || {};
    const toolResult = input.tool_result || {};
    const command = toolInput.command || '';
    const stdout = typeof toolResult === 'string' ? toolResult : (toolResult.stdout || '');
    const stderr = toolResult.stderr || '';
    const exitCode = toolResult.exit_code;

    // Determine exit code — PostToolUse for Bash includes it in result
    // The exact structure varies; handle multiple formats
    const code = typeof exitCode === 'number' ? exitCode :
                 (typeof toolResult === 'string' && toolResult.includes('exit code') ? 1 : 0);

    if (code !== 0) {
      return handleError(command, stderr || stdout);
    } else {
      return handleSuccess(command);
    }
  } catch {
    // Never fail — silent exit
    return rawInput;
  }
}

function handleError(command, errorOutput) {
  const errorText = (errorOutput || '').substring(0, 500);
  if (!errorText.trim()) return '';

  // Check known patterns
  const match = db.findMatchingPattern(errorText);
  if (match) {
    match.hit_count += 1;
    match.last_seen = new Date().toISOString();
    const patterns = db.loadPatterns();
    const idx = patterns.findIndex(p => p.id === match.id);
    if (idx >= 0) patterns[idx] = match;
    db.savePatterns(patterns);

    const fixes = match.solution_commands.slice(0, 2).join('; ');
    process.stderr.write(
      `[ErrorPattern] Known error detected (${match.category}, confidence: ${match.confidence_score}).\n` +
      `  Fix: ${match.solution_description}\n` +
      `  Commands: ${fixes}\n`
    );
    return rawInput || '';
  }

  // Unknown error → add to pending
  db.addPending(errorText, command, process.cwd());
  process.stderr.write(
    `[ErrorPattern] New error captured (${db.categorizeError(errorText)}). Tracking resolution...\n`
  );
  return '';
}

function handleSuccess(command) {
  if (!command) return '';

  const pending = db.loadPending();
  const now = Date.now();
  let resolved = false;

  // Scan recent unresolved pending entries (max 5, newest first)
  const unresolved = pending
    .filter(p => !p.resolved)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, MAX_PENDING_SCAN);

  for (const entry of unresolved) {
    const age = now - new Date(entry.timestamp).getTime();
    if (age > RESOLUTION_WINDOW_MS) continue;

    if (db.looksLikeFix(command, entry.error_output)) {
      db.resolvePending(entry.id, command);
      resolved = true;
      process.stderr.write(
        `[ErrorPattern] Resolution detected! Pattern saved (command: ${command.substring(0, 80)})\n`
      );
      break; // Resolve one at a time
    }
  }

  return '';
}

module.exports = { run };
