'use strict';

/**
 * SessionStart — Error Pattern Injection
 *
 * Reads the auto-generated CLAUDE.md and injects top patterns as context.
 * Also logs a summary count to stderr.
 */

const fs = require('fs');
const path = require('path');
const db = require('../lib/error-pattern-db');

function run() {
  try {
    const claudeMdPath = path.join(db.EP_DIR, 'CLAUDE.md');

    // Count high-confidence patterns
    const patterns = db.loadPatterns();
    const highConf = patterns.filter(p => p.confidence_score >= 5);

    if (highConf.length > 0 && fs.existsSync(claudeMdPath)) {
      process.stderr.write(
        `[ErrorPattern] Loaded ${highConf.length} high-confidence error patterns from ${patterns.length} total.\n`
      );
    }

    // The CLAUDE.md file in error-patterns/ is auto-loaded by Claude Code
    // due to directory convention. No need to output its content.
    return '';
  } catch {
    return '';
  }
}

module.exports = { run };
