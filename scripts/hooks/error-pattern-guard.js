'use strict';

/**
 * PreToolUse (Bash) — Error Pattern Guard
 *
 * Checks the command about to be executed against known error patterns.
 * If a high-confidence match is found, outputs a warning to stderr.
 * Never blocks execution — advisory only.
 */

const fs = require('fs');
const db = require('../lib/error-pattern-db');

const MAX_FILE_SIZE = 200 * 1024; // 200KB

function run(rawInput) {
  try {
    // Performance gate: skip if patterns.json is too large
    if (fs.existsSync(db.PATTERNS_FILE)) {
      const stat = fs.statSync(db.PATTERNS_FILE);
      if (stat.size > MAX_FILE_SIZE) return rawInput;
    }

    const input = JSON.parse(rawInput);
    const command = (input.tool_input && input.tool_input.command) || '';
    if (!command) return rawInput;

    const matches = db.findPreventivePatterns(command);
    if (matches.length === 0) return rawInput;

    // Show top 2 warnings
    const warnings = matches.slice(0, 2).map(p =>
      `  [${p.category}] ${p.solution_description} (confidence: ${p.confidence_score})`
    ).join('\n');

    process.stderr.write(
      `[ErrorPattern] Warning: This command has caused errors before.\n${warnings}\n`
    );
  } catch {
    // Never fail
  }
  return rawInput;
}

module.exports = { run };
