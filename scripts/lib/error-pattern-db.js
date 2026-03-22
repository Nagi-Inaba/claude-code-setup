'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const CLAUDE_DIR = path.join(os.homedir(), '.claude');
const EP_DIR = path.join(CLAUDE_DIR, 'error-patterns');
const PATTERNS_FILE = path.join(EP_DIR, 'patterns.json');
const PENDING_FILE = path.join(EP_DIR, 'pending.json');
const ARCHIVE_FILE = path.join(EP_DIR, 'archive.json');
const MAX_PATTERNS = 500;
const MAX_REGEX_LEN = 200;
const REGEX_TIMEOUT_MS = 50;

// --- File I/O (atomic write) ---

function ensureDir() {
  if (!fs.existsSync(EP_DIR)) {
    fs.mkdirSync(EP_DIR, { recursive: true });
  }
}

function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeJson(filePath, data) {
  ensureDir();
  const tmp = filePath + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, filePath);
}

function loadPatterns() { return readJson(PATTERNS_FILE); }
function savePatterns(arr) { writeJson(PATTERNS_FILE, arr); }
function loadPending() { return readJson(PENDING_FILE); }
function savePending(arr) { writeJson(PENDING_FILE, arr); }
function loadArchive() { return readJson(ARCHIVE_FILE); }
function saveArchive(arr) { writeJson(ARCHIVE_FILE, arr); }

// --- ID generation ---

function generateId(prefix) {
  return prefix + '_' + crypto.randomBytes(4).toString('hex');
}

// --- Safe regex matching ---

function safeRegexTest(pattern, text) {
  try {
    if (pattern.length > MAX_REGEX_LEN) return false;
    const re = new RegExp(pattern, 'i');
    // Simple timeout guard: test on truncated text
    const truncated = text.substring(0, 2000);
    return re.test(truncated);
  } catch {
    return false;
  }
}

// --- Pattern matching ---

function findMatchingPattern(errorText) {
  const patterns = loadPatterns();
  let best = null;
  for (const p of patterns) {
    if (safeRegexTest(p.error_signature, errorText)) {
      if (!best || p.confidence_score > best.confidence_score) {
        best = p;
      }
    }
  }
  return best;
}

function findPreventivePatterns(command) {
  const patterns = loadPatterns();
  const matches = [];
  for (const p of patterns) {
    if (p.trigger_command_pattern && safeRegexTest(p.trigger_command_pattern, command)) {
      if (p.confidence_score >= 3) {
        matches.push(p);
      }
    }
  }
  return matches.sort((a, b) => b.confidence_score - a.confidence_score);
}

// --- Error categorization ---

const CATEGORY_RULES = [
  { pattern: /\b(npm|pnpm|yarn|node_modules)\b/i, category: 'npm' },
  { pattern: /\b(pip|python|ModuleNotFoundError|ImportError|venv)\b/i, category: 'python' },
  { pattern: /\bgit\b/i, category: 'git' },
  { pattern: /\b(EPERM|EACCES|Permission denied|Access is denied)\b/i, category: 'permission' },
  { pattern: /\b(ENOENT|not found|No such file|cannot find)\b/i, category: 'path' },
  { pattern: /\b(tsc|build|compile|webpack|vite|esbuild)\b/i, category: 'build' },
  { pattern: /\b(powershell|PSVersion|&&|cmdlet)\b/i, category: 'shell' },
  { pattern: /\b(ETIMEDOUT|ECONNREFUSED|fetch|curl|wget)\b/i, category: 'network' },
];

function categorizeError(errorText) {
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(errorText)) return rule.category;
  }
  return 'unknown';
}

// --- Pending management ---

function addPending(errorOutput, command, cwd) {
  const pending = loadPending();
  const entry = {
    id: generateId('pend'),
    error_output: (errorOutput || '').substring(0, 500),
    failed_command: command || '',
    cwd: cwd || '',
    timestamp: new Date().toISOString(),
    matched_pattern_id: null,
    resolved: false,
    resolution_command: null,
  };
  pending.push(entry);
  savePending(pending);
  return entry;
}

// --- Resolution heuristics ---

const FIX_INDICATORS = [
  /\b(npm|pnpm|yarn)\s+install\b/i,
  /\bpip\s+install\b/i,
  /\bmkdir\s+-p\b/i,
  /\bchmod\b/i,
  /\bexport\s+/i,
  /\bset\s+.*=/i,
  /\bgit\s+(checkout|reset|stash|pull)\b/i,
];

function looksLikeFix(successCommand, errorOutput) {
  for (const re of FIX_INDICATORS) {
    if (re.test(successCommand)) return true;
  }
  // Check if the successful command addresses a similar domain
  const errorCat = categorizeError(errorOutput);
  const cmdCat = categorizeError(successCommand);
  return errorCat !== 'unknown' && errorCat === cmdCat;
}

function resolvePending(pendingId, resolutionCommand) {
  const pending = loadPending();
  const patterns = loadPatterns();
  const entry = pending.find(p => p.id === pendingId);
  if (!entry) return null;

  entry.resolved = true;
  entry.resolution_command = resolutionCommand;
  savePending(pending);

  // Find or create pattern
  const existing = findMatchingPattern(entry.error_output);
  if (existing) {
    existing.confidence_score += 1;
    existing.resolution_count += 1;
    existing.last_seen = new Date().toISOString();
    if (!existing.solution_commands.includes(resolutionCommand)) {
      existing.solution_commands.push(resolutionCommand);
    }
    savePatterns(patterns);
    return existing;
  }

  // Create new pattern
  const errorSig = escapeForRegex(entry.error_output.split('\n')[0].substring(0, MAX_REGEX_LEN));
  const newPattern = {
    id: generateId('ep'),
    error_signature: errorSig,
    error_example: entry.error_output,
    category: categorizeError(entry.error_output),
    trigger_command_pattern: escapeForRegex(entry.failed_command.substring(0, MAX_REGEX_LEN)),
    solution_description: `Run: ${resolutionCommand}`,
    solution_commands: [resolutionCommand],
    confidence_score: 1,
    hit_count: 1,
    resolution_count: 1,
    last_seen: new Date().toISOString(),
    created_at: new Date().toISOString(),
    context: {
      os: process.platform,
      cwd_pattern: null,
    },
  };
  patterns.push(newPattern);
  savePatterns(patterns);
  return newPattern;
}

function escapeForRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// --- Staleness ---

function isStale(pattern, days) {
  if (days === undefined) days = 30;
  if (!pattern.last_seen) return true;
  const lastSeen = new Date(pattern.last_seen);
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return lastSeen < cutoff;
}

// --- Maintenance ---

function runMaintenance() {
  const patterns = loadPatterns();
  const archive = loadArchive();
  const pending = loadPending();

  // Archive stale + low-confidence patterns
  const keep = [];
  for (const p of patterns) {
    if (isStale(p, 30) && p.confidence_score < 3) {
      archive.push(p);
    } else {
      keep.push(p);
    }
  }

  // Cap enforcement
  if (keep.length > MAX_PATTERNS) {
    keep.sort((a, b) => b.confidence_score - a.confidence_score);
    const overflow = keep.splice(MAX_PATTERNS);
    archive.push(...overflow);
  }

  // Prune pending > 24h
  const cutoff24h = Date.now() - 24 * 60 * 60 * 1000;
  const activePending = pending.filter(p =>
    !p.resolved && new Date(p.timestamp).getTime() > cutoff24h
  );

  savePatterns(keep);
  saveArchive(archive);
  savePending(activePending);

  return { patternsCount: keep.length, archivedCount: archive.length, pendingPruned: pending.length - activePending.length };
}

// --- CLAUDE.md generation ---

function generateClaudeMd() {
  const patterns = loadPatterns();
  const archive = loadArchive();

  const promoted = patterns
    .filter(p => p.confidence_score >= 5)
    .sort((a, b) => (b.hit_count * b.confidence_score) - (a.hit_count * a.confidence_score))
    .slice(0, 15);

  const lines = [
    '# Error Patterns (Auto-Generated)',
    '',
    '> This file is auto-generated by error-pattern-maintain.js. Do not edit manually.',
    `> Last updated: ${new Date().toISOString()}`,
    `> Total patterns: ${patterns.length} | High-confidence: ${promoted.length} | Archived: ${archive.length}`,
    '',
  ];

  if (promoted.length === 0) {
    lines.push('No high-confidence patterns yet. Patterns are promoted after 5+ successful resolutions.');
    return lines.join('\n');
  }

  lines.push('## Known Error Patterns');
  lines.push('');
  lines.push('These errors have been encountered and resolved multiple times. Apply the fix proactively.');
  lines.push('');

  for (let i = 0; i < promoted.length; i++) {
    const p = promoted[i];
    lines.push(`### ${i + 1}. [${p.category}] ${p.solution_description}`);
    lines.push(`- **Error signature:** \`${p.error_signature.substring(0, 100)}\``);
    lines.push(`- **Fix:** ${p.solution_commands.slice(0, 3).map(c => '`' + c + '`').join(', ')}`);
    lines.push(`- **Confidence:** ${p.confidence_score} | Hits: ${p.hit_count}`);
    lines.push('');
  }

  return lines.join('\n');
}

function writeClaudeMd() {
  const content = generateClaudeMd();
  ensureDir();
  writeJson; // not needed, just write text
  const filePath = path.join(EP_DIR, 'CLAUDE.md');
  const tmp = filePath + '.tmp';
  fs.writeFileSync(tmp, content, 'utf8');
  fs.renameSync(tmp, filePath);
  return content;
}

module.exports = {
  loadPatterns, savePatterns,
  loadPending, savePending,
  loadArchive, saveArchive,
  findMatchingPattern, findPreventivePatterns,
  categorizeError, generateId,
  addPending, resolvePending, looksLikeFix,
  isStale, runMaintenance,
  generateClaudeMd, writeClaudeMd,
  escapeForRegex,
  EP_DIR, PATTERNS_FILE, PENDING_FILE, ARCHIVE_FILE,
};
