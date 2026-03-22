'use strict';

/**
 * Stop (async) — Error Pattern Maintenance
 *
 * - Promote high-confidence patterns to CLAUDE.md
 * - Archive stale + low-confidence patterns
 * - Prune old unresolved pending entries
 * - Cap patterns at 500
 * - Regenerate CLAUDE.md
 */

const db = require('../lib/error-pattern-db');

function run() {
  try {
    const result = db.runMaintenance();
    db.writeClaudeMd();

    const patterns = db.loadPatterns();
    const highConf = patterns.filter(p => p.confidence_score >= 5).length;

    process.stderr.write(
      `[ErrorPattern] Maintenance complete. ` +
      `Patterns: ${result.patternsCount} | High-confidence: ${highConf} | ` +
      `Archived: ${result.archivedCount} | Pending pruned: ${result.pendingPruned}\n`
    );
    return '';
  } catch (err) {
    process.stderr.write(`[ErrorPattern] Maintenance error: ${err.message}\n`);
    return '';
  }
}

module.exports = { run };
