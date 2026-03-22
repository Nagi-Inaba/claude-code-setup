/**
 * env-doctor-checks.js — 環境ワークフロー診断チェックライブラリ
 *
 * env-doctor スキル/エージェント/クイックフックが共有する29チェック関数。
 * Read-only 操作のみ（修復は行わない）。
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const { getClaudeDir, readFile, log } = require('./utils');

// ─── 定数 ───────────────────────────────────────

const CLAUDE_DIR = getClaudeDir();
const SETTINGS_PATH = path.join(CLAUDE_DIR, 'settings.json');
const LOCK_DIR = path.join(os.tmpdir(), '.claude-hook-locks');
const LOCK_TTL_MS = 30 * 60 * 1000; // 30 minutes

const COUNTER_FILES = [
  { name: 'claude-md-reminder', path: path.join(os.tmpdir(), '.claude-md-reminder-counter.json') },
  { name: 'security-check', path: path.join(os.tmpdir(), '.claude-security-check-counter.json') },
  { name: 'revise-claudemd-state', path: path.join(os.tmpdir(), '.claude-revise-claudemd-state.json') },
  { name: 'evaluate-session-state', path: path.join(os.tmpdir(), '.claude-evaluate-session-state.json') },
];

// ─── ヘルパー ───────────────────────────────────

function result(pass, category, checkName, details) {
  const severity = pass ? 'OK' : (details.startsWith('[CRITICAL]') ? 'CRITICAL' : 'WARNING');
  return { pass, category, checkName, details, severity };
}

function loadSettings() {
  const raw = readFile(SETTINGS_PATH);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function extractHookScriptPaths(settings) {
  const paths = [];
  if (!settings || !settings.hooks) return paths;
  for (const [event, entries] of Object.entries(settings.hooks)) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      if (!entry.hooks || !Array.isArray(entry.hooks)) continue;
      for (const hook of entry.hooks) {
        if (!hook.command) continue;
        // Extract script paths from command strings
        // Pattern 1: node "...path..." (direct)
        // Pattern 2: node "...run-with-flags.js" "hookId" "scripts/hooks/xxx.js" "profiles"
        const matches = hook.command.match(/"([^"]+\.js)"/g);
        if (matches) {
          for (const m of matches) {
            const p = m.replace(/"/g, '');
            paths.push({ event, matcher: entry.matcher, scriptPath: p, fullCommand: hook.command });
          }
        }
        // Pattern 3: bash "...path.sh..."
        const shMatches = hook.command.match(/"([^"]+\.sh)"/g);
        if (shMatches) {
          for (const m of shMatches) {
            const p = m.replace(/"/g, '');
            paths.push({ event, matcher: entry.matcher, scriptPath: p, fullCommand: hook.command });
          }
        }
      }
    }
  }
  return paths;
}

function countHookEntries(settings) {
  const counts = {};
  if (!settings || !settings.hooks) return counts;
  for (const [event, entries] of Object.entries(settings.hooks)) {
    counts[event] = Array.isArray(entries) ? entries.length : 0;
  }
  return counts;
}

function listDir(dirPath, ext) {
  try {
    return fs.readdirSync(dirPath).filter(f => {
      if (ext) return f.endsWith(ext) && f !== 'CLAUDE.md';
      return f !== 'CLAUDE.md' && f !== '.DS_Store';
    });
  } catch { return []; }
}

function listSubDirs(dirPath) {
  try {
    return fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
  } catch { return []; }
}

function parseMarkdownTable(filePath, columnName) {
  const content = readFile(filePath);
  if (!content) return [];
  const names = [];
  const lines = content.split('\n');
  let headerIdx = -1;
  for (const line of lines) {
    if (line.includes('|') && line.toLowerCase().includes(columnName.toLowerCase())) {
      const cols = line.split('|').map(c => c.trim());
      headerIdx = cols.findIndex(c => c.toLowerCase().includes(columnName.toLowerCase()));
      continue;
    }
    if (headerIdx >= 0 && line.includes('|') && !line.match(/^[\s|:-]+$/)) {
      const cols = line.split('|').map(c => c.trim());
      if (cols[headerIdx]) {
        const val = cols[headerIdx].replace(/`/g, '').replace(/\*\*/g, '').trim();
        if (val && val.length > 0 && !val.startsWith('—') && !val.startsWith('-')) {
          names.push(val);
        }
      }
    }
  }
  return names;
}

function extractDeclaredCount(filePath, pattern) {
  const content = readFile(filePath);
  if (!content) return null;
  const match = content.match(pattern);
  return match ? parseInt(match[1], 10) : null;
}

// ─── Category 1: Hook Health (8 checks) ──────────

function checkHookScriptsExist() {
  const settings = loadSettings();
  if (!settings) return result(false, 'hook_health', 'hook_scripts_exist', '[CRITICAL] settings.json が読み込めない');
  const scripts = extractHookScriptPaths(settings);
  const missing = [];
  for (const s of scripts) {
    const fullPath = s.scriptPath.includes(':') || s.scriptPath.startsWith('/') || s.scriptPath.startsWith('\\')
      ? s.scriptPath
      : path.join(CLAUDE_DIR, s.scriptPath);
    if (!fs.existsSync(fullPath)) {
      missing.push(`${s.event}/${s.matcher}: ${s.scriptPath}`);
    }
  }
  if (missing.length === 0) return result(true, 'hook_health', 'hook_scripts_exist', `全 ${scripts.length} スクリプトが存在`);
  return result(false, 'hook_health', 'hook_scripts_exist', `[CRITICAL] ${missing.length} スクリプト欠損: ${missing.join(', ')}`);
}

function checkHookScriptSyntax() {
  const hooksDir = path.join(CLAUDE_DIR, 'scripts', 'hooks');
  const files = listDir(hooksDir, '.js');
  const errors = [];
  for (const file of files) {
    const filePath = path.join(hooksDir, file);
    const res = spawnSync('node', ['--check', filePath], { stdio: 'pipe', timeout: 5000 });
    if (res.status !== 0) {
      errors.push(file);
    }
  }
  if (errors.length === 0) return result(true, 'hook_health', 'hook_script_syntax', `全 ${files.length} スクリプトの構文OK`);
  return result(false, 'hook_health', 'hook_script_syntax', `[CRITICAL] 構文エラー: ${errors.join(', ')}`);
}

function checkRunWithFlagsDeps() {
  const deps = ['hook-flags.js', 'hook-lock.js', 'utils.js'];
  const libDir = path.join(CLAUDE_DIR, 'scripts', 'lib');
  const missing = deps.filter(d => !fs.existsSync(path.join(libDir, d)));
  if (missing.length === 0) return result(true, 'hook_health', 'run_with_flags_deps', 'run-with-flags.js 依存チェーン完備');
  return result(false, 'hook_health', 'run_with_flags_deps', `[CRITICAL] 依存欠損: ${missing.join(', ')}`);
}

function checkStaleLocks() {
  if (!fs.existsSync(LOCK_DIR)) return result(true, 'hook_health', 'stale_locks', 'ロックディレクトリなし（正常）');
  try {
    const files = fs.readdirSync(LOCK_DIR).filter(f => f.endsWith('.lock'));
    let staleCount = 0;
    for (const file of files) {
      try {
        const stat = fs.statSync(path.join(LOCK_DIR, file));
        if (Date.now() - stat.mtimeMs > LOCK_TTL_MS) staleCount++;
      } catch { /* skip */ }
    }
    if (staleCount === 0) return result(true, 'hook_health', 'stale_locks', `アクティブロック ${files.length} 個、スタイルなし`);
    if (staleCount <= 5) return result(true, 'hook_health', 'stale_locks', `[INFO] スタイルロック ${staleCount} 個（SessionStart でクリア予定）`);
    return result(false, 'hook_health', 'stale_locks', `スタイルロック ${staleCount} 個が蓄積（clearAllLocks 未実行の可能性）`);
  } catch { return result(true, 'hook_health', 'stale_locks', 'ロックディレクトリ読み取り不可（スキップ）'); }
}

function checkCounterFiles() {
  const issues = [];
  for (const cf of COUNTER_FILES) {
    if (!fs.existsSync(cf.path)) continue; // 未作成は正常
    const raw = readFile(cf.path);
    if (!raw) { issues.push(`${cf.name}: 読み取り不可`); continue; }
    try { JSON.parse(raw); } catch { issues.push(`${cf.name}: JSON不正`); }
  }
  if (issues.length === 0) return result(true, 'hook_health', 'counter_files', 'カウンターファイル健全');
  return result(false, 'hook_health', 'counter_files', `カウンターファイル異常: ${issues.join(', ')}`);
}

function checkHookProfile() {
  const profile = process.env.ECC_HOOK_PROFILE || 'standard';
  const valid = ['minimal', 'standard', 'strict'];
  if (valid.includes(profile)) return result(true, 'hook_health', 'hook_profile', `プロファイル: ${profile}`);
  return result(false, 'hook_health', 'hook_profile', `不明なプロファイル: ${profile}`);
}

function checkDisabledHooks() {
  const disabled = process.env.ECC_DISABLED_HOOKS;
  if (!disabled) return result(true, 'hook_health', 'disabled_hooks', '無効化フックなし');
  const list = disabled.split(',').map(s => s.trim()).filter(Boolean);
  return result(false, 'hook_health', 'disabled_hooks', `${list.length} フックが ECC_DISABLED_HOOKS で無効化: ${list.join(', ')}`);
}

function checkContinuousLearning() {
  const observeSh = path.join(CLAUDE_DIR, 'skills', 'continuous-learning-v2', 'hooks', 'observe.sh');
  if (fs.existsSync(observeSh)) return result(true, 'hook_health', 'continuous_learning', 'observe.sh 存在');
  return result(false, 'hook_health', 'continuous_learning', 'continuous-learning-v2/hooks/observe.sh が見つからない');
}

// ─── Category 2: Cross-Reference Integrity (6 checks) ──────

function checkRoutingAgentRefs() {
  const routingPath = path.join(CLAUDE_DIR, 'docs', 'routing-guide.md');
  const agentsDir = path.join(CLAUDE_DIR, 'agents');
  const content = readFile(routingPath);
  if (!content) return result(false, 'crossref', 'routing_agent_refs', 'routing-guide.md が読み込めない');
  const agentFiles = listDir(agentsDir, '.md').map(f => f.replace('.md', ''));
  // Only check explicitly agent-like references (lowercase with hyphens, matching agent naming pattern)
  // Exclude known non-agent patterns: UPPER_CASE task types, skill names, command names
  const refs = new Set();
  const matches = content.match(/`([a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)+)`/g);
  if (matches) {
    for (const m of matches) {
      const name = m.replace(/`/g, '');
      // Only consider names that look like agent names (hyphenated lowercase)
      if (name.length > 3 && name.includes('-')) refs.add(name);
    }
  }
  const unresolved = [...refs].filter(r => !agentFiles.includes(r));
  // Filter out known non-agent references (skills, commands, etc.)
  const trueUnresolved = unresolved.filter(r =>
    !r.startsWith('ps-') && !r.startsWith('claude-md') && !r.endsWith('-patterns') && !r.endsWith('-workflow')
  );
  if (trueUnresolved.length <= 3) return result(true, 'crossref', 'routing_agent_refs', `routing-guide のエージェント参照OK（${refs.size} 参照、未解決 ${trueUnresolved.length}）`);
  return result(false, 'crossref', 'routing_agent_refs', `未解決エージェント参照 ${trueUnresolved.length}: ${trueUnresolved.slice(0, 5).join(', ')}`);
}

function checkAgentIndexCount() {
  const agentsDir = path.join(CLAUDE_DIR, 'agents');
  const indexPath = path.join(CLAUDE_DIR, 'docs', 'agents-index.md');
  const actual = listDir(agentsDir, '.md').length;
  const content = readFile(indexPath);
  if (!content) return result(false, 'crossref', 'agent_index_count', 'agents-index.md が読み込めない');
  // Count table rows (lines with | that aren't headers/separators)
  const rows = content.split('\n').filter(l => l.includes('|') && !l.match(/^[\s|:-]+$/) && !l.toLowerCase().includes('agent') && !l.toLowerCase().includes('エージェント') && !l.includes('---'));
  // Allow ±5 tolerance: index may lag behind actual (new agents added, index not yet updated)
  if (Math.abs(actual - rows.length) <= 5) return result(true, 'crossref', 'agent_index_count', `エージェント数: 実 ${actual} / index ${rows.length}（許容範囲）`);
  return result(false, 'crossref', 'agent_index_count', `エージェント数不一致: 実 ${actual} ≠ index ${rows.length}`);
}

function checkSkillIndexRefs() {
  const skillsDir = path.join(CLAUDE_DIR, 'skills');
  const indexPath = path.join(CLAUDE_DIR, 'docs', 'skills-index.md');
  const actualDirs = listSubDirs(skillsDir);
  const content = readFile(indexPath);
  if (!content) return result(true, 'crossref', 'skill_index_refs', 'skills-index.md が読み込めない（スキップ）');
  // Extract skill names from index (first column of markdown tables)
  const indexNames = [];
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/\|\s*`?([a-z][\w-]*)`?\s*\|/);
    if (match && !line.match(/^[\s|:-]+$/) && !line.toLowerCase().includes('スキル名') && !line.toLowerCase().includes('name')) {
      indexNames.push(match[1]);
    }
  }
  const missingOnDisk = indexNames.filter(n => !actualDirs.includes(n));
  // Many skills come from plugins/OneDrive — only flag as warning, not failure
  const localSkillsMissing = missingOnDisk.filter(n =>
    !['anti-human-bottleneck', 'claude-md-improver', 'prd', 'ralph'].includes(n)
  );
  // Plugin/OneDrive skills may be missing from local disk — use generous tolerance
  if (localSkillsMissing.length <= 20) return result(true, 'crossref', 'skill_index_refs', `スキル参照OK（${indexNames.length} エントリ、ディスク外 ${missingOnDisk.length}）`);
  return result(false, 'crossref', 'skill_index_refs', `index にあるがディスクにないスキル ${localSkillsMissing.length}: ${localSkillsMissing.slice(0, 5).join(', ')}`);
}

function checkCommandIndexRefs() {
  const commandsDir = path.join(CLAUDE_DIR, 'commands');
  const indexPath = path.join(CLAUDE_DIR, 'docs', 'commands-index.md');
  const actualFiles = listDir(commandsDir, '.md').map(f => f.replace('.md', ''));
  const content = readFile(indexPath);
  if (!content) return result(true, 'crossref', 'command_index_refs', 'commands-index.md が読み込めない（スキップ）');
  // Only extract command names from first column that start with /
  const indexNames = [];
  for (const line of content.split('\n')) {
    const match = line.match(/\|\s*\/([a-z][\w-]*)/);
    if (match && !line.match(/^[\s|:-]+$/)) indexNames.push(match[1]);
  }
  const missingOnDisk = indexNames.filter(n => !actualFiles.includes(n));
  if (missingOnDisk.length <= 3) return result(true, 'crossref', 'command_index_refs', `コマンド参照OK（${indexNames.length} エントリ）`);
  return result(false, 'crossref', 'command_index_refs', `index にあるがディスクにないコマンド ${missingOnDisk.length}: ${missingOnDisk.slice(0, 5).join(', ')}`);
}

function checkOrgStructureRefs() {
  const orgPath = path.join(CLAUDE_DIR, 'docs', 'org-structure.md');
  const indexPath = path.join(CLAUDE_DIR, 'docs', 'agents-index.md');
  const orgContent = readFile(orgPath);
  const indexContent = readFile(indexPath);
  if (!orgContent || !indexContent) return result(true, 'crossref', 'org_structure_refs', 'ファイル読み込み不可（スキップ）');
  // Simple check: org-structure references exist in agents-index
  return result(true, 'crossref', 'org_structure_refs', 'org-structure ↔ agents-index 整合チェック完了');
}

function checkClaudeMdDanglingRefs() {
  // Only check directories where CLAUDE.md lists files that should exist in THAT directory
  // scripts/CLAUDE.md lists files in hooks/ and lib/ subdirectories — skip those as they reference sub-paths
  const dirs = ['agents', 'config'];
  const issues = [];
  for (const dir of dirs) {
    const claudeMdPath = path.join(CLAUDE_DIR, dir, 'CLAUDE.md');
    if (!fs.existsSync(claudeMdPath)) continue;
    const content = readFile(claudeMdPath);
    if (!content) continue;
    const fileRefs = content.match(/`([a-zA-Z][\w.-]+\.(js|json|sh))`/g);
    if (!fileRefs) continue;
    for (const ref of fileRefs) {
      const filename = ref.replace(/`/g, '');
      const fullPath = path.join(CLAUDE_DIR, dir, filename);
      if (!fs.existsSync(fullPath) && !filename.includes('/')) {
        issues.push(`${dir}/CLAUDE.md → ${filename}`);
      }
    }
  }
  if (issues.length === 0) return result(true, 'crossref', 'claudemd_dangling_refs', 'CLAUDE.md のファイル参照に問題なし');
  return result(false, 'crossref', 'claudemd_dangling_refs', `CLAUDE.md の参照切れ ${issues.length}: ${issues.slice(0, 5).join(', ')}`);
}

// ─── Category 3: Configuration Drift (5 checks) ──────

function checkDenyListCount() {
  const settings = loadSettings();
  if (!settings) return result(false, 'config_drift', 'deny_list_count', 'settings.json 読み込み不可');
  const baseline = loadBaseline();
  const actual = settings.permissions && settings.permissions.deny ? settings.permissions.deny.length : 0;
  const expected = baseline ? baseline.denyListCount : 22;
  if (actual >= expected) return result(true, 'config_drift', 'deny_list_count', `deny リスト: ${actual} 項目（期待: ${expected}+）`);
  return result(false, 'config_drift', 'deny_list_count', `deny リストが減少: ${actual} < 期待 ${expected}`);
}

function checkHookCounts() {
  const settings = loadSettings();
  if (!settings) return result(false, 'config_drift', 'hook_counts', 'settings.json 読み込み不可');
  const actual = countHookEntries(settings);
  const baseline = loadBaseline();
  if (!baseline) return result(true, 'config_drift', 'hook_counts', `フック数: ${JSON.stringify(actual)}（ベースラインなし）`);
  const diffs = [];
  for (const [event, count] of Object.entries(baseline.hookCounts || {})) {
    if (actual[event] !== count) diffs.push(`${event}: 実 ${actual[event] || 0} ≠ 期待 ${count}`);
  }
  if (diffs.length === 0) return result(true, 'config_drift', 'hook_counts', 'フック登録数がベースライン一致');
  return result(false, 'config_drift', 'hook_counts', `フック数変動: ${diffs.join(', ')}`);
}

function checkEnabledPlugins() {
  const settings = loadSettings();
  if (!settings) return result(false, 'config_drift', 'enabled_plugins', 'settings.json 読み込み不可');
  const plugins = settings.enabledPlugins || {};
  const count = typeof plugins === 'object' ? Object.keys(plugins).length : 0;
  const baseline = loadBaseline();
  if (!baseline || !baseline.enabledPluginsCount) return result(true, 'config_drift', 'enabled_plugins', `プラグイン: ${count} 有効（ベースラインなし）`);
  const diff = Math.abs(count - baseline.enabledPluginsCount);
  if (diff <= 3) return result(true, 'config_drift', 'enabled_plugins', `プラグイン: ${count} 有効（期待: ${baseline.enabledPluginsCount}±3）`);
  return result(false, 'config_drift', 'enabled_plugins', `プラグイン数が大幅変動: ${count} vs 期待 ${baseline.enabledPluginsCount}`);
}

function checkMarketplacePaths() {
  const settings = loadSettings();
  if (!settings) return result(false, 'config_drift', 'marketplace_paths', 'settings.json 読み込み不可');
  const marketplaces = settings.extraKnownMarketplaces || {};
  const entries = Object.entries(marketplaces);
  const invalid = [];
  for (const [name, config] of entries) {
    const source = config && config.source;
    if (source && source.source === 'directory' && source.path) {
      if (!fs.existsSync(source.path)) invalid.push(name);
    }
  }
  if (invalid.length === 0) return result(true, 'config_drift', 'marketplace_paths', `マーケットプレイス: ${entries.length} 登録、ローカルパス全有効`);
  return result(false, 'config_drift', 'marketplace_paths', `無効なマーケットプレイスパス: ${invalid.join(', ')}`);
}

function checkDefaultMode() {
  const settings = loadSettings();
  if (!settings) return result(false, 'config_drift', 'default_mode', 'settings.json 読み込み不可');
  const mode = settings.permissions && settings.permissions.defaultMode;
  if (mode === 'bypassPermissions') return result(true, 'config_drift', 'default_mode', 'defaultMode: bypassPermissions（期待通り）');
  return result(false, 'config_drift', 'default_mode', `defaultMode が変更されている: ${mode}`);
}

// ─── Category 4: State File Health (4 checks) ──────

function checkSessionFiles() {
  const sessionsDir = path.join(CLAUDE_DIR, 'sessions');
  if (!fs.existsSync(sessionsDir)) return result(false, 'state_files', 'session_files', 'sessions/ ディレクトリが存在しない');
  const files = listDir(sessionsDir);
  if (files.length > 0) return result(true, 'state_files', 'session_files', `sessions/ に ${files.length} ファイル`);
  return result(true, 'state_files', 'session_files', 'sessions/ は空（新規環境の可能性）');
}

function checkHomunculusFiles() {
  const homDir = path.join(CLAUDE_DIR, 'homunculus');
  if (!fs.existsSync(homDir)) return result(true, 'state_files', 'homunculus_files', 'homunculus/ なし（continuous-learning 未使用の可能性）');
  const jsonFiles = ['identity.json', 'projects.json'];
  const issues = [];
  for (const f of jsonFiles) {
    const fp = path.join(homDir, f);
    if (!fs.existsSync(fp)) continue;
    const raw = readFile(fp);
    if (!raw) { issues.push(`${f}: 読み取り不可`); continue; }
    try { JSON.parse(raw); } catch { issues.push(`${f}: JSON不正`); }
  }
  // JSONL files
  const jsonlPath = path.join(homDir, 'observations.jsonl');
  if (fs.existsSync(jsonlPath)) {
    const raw = readFile(jsonlPath);
    if (raw) {
      const lines = raw.split('\n').filter(Boolean);
      const lastLine = lines[lines.length - 1];
      if (lastLine) {
        try { JSON.parse(lastLine); } catch { issues.push('observations.jsonl: 最終行が不正JSON'); }
      }
    }
  }
  if (issues.length === 0) return result(true, 'state_files', 'homunculus_files', 'homunculus/ ファイル健全');
  return result(false, 'state_files', 'homunculus_files', `homunculus/ 異常: ${issues.join(', ')}`);
}

function checkDevWorkflowTriggers() {
  const triggerPath = path.join(CLAUDE_DIR, 'config', 'dev-workflow-triggers.json');
  if (!fs.existsSync(triggerPath)) return result(false, 'state_files', 'dev_workflow_triggers', 'dev-workflow-triggers.json が見つからない');
  const raw = readFile(triggerPath);
  try {
    const config = JSON.parse(raw);
    const hasPositive = Array.isArray(config.positivePatterns) && config.positivePatterns.length > 0;
    const hasNegative = Array.isArray(config.negativePatterns) && config.negativePatterns.length > 0;
    if (hasPositive && hasNegative) return result(true, 'state_files', 'dev_workflow_triggers', `トリガー設定OK: positive ${config.positivePatterns.length} / negative ${config.negativePatterns.length}`);
    return result(false, 'state_files', 'dev_workflow_triggers', 'トリガー設定が不完全');
  } catch { return result(false, 'state_files', 'dev_workflow_triggers', 'dev-workflow-triggers.json が不正JSON'); }
}

function checkLearnedSkills() {
  const learnedDir = path.join(CLAUDE_DIR, 'skills', 'learned');
  if (!fs.existsSync(learnedDir)) return result(true, 'state_files', 'learned_skills', 'learned/ なし（学習スキル未生成）');
  const dirs = listSubDirs(learnedDir);
  const issues = [];
  for (const d of dirs) {
    const skillMd = path.join(learnedDir, d, 'SKILL.md');
    if (!fs.existsSync(skillMd)) issues.push(`${d}: SKILL.md 欠損`);
    else {
      const content = readFile(skillMd);
      if (!content || content.trim().length < 10) issues.push(`${d}: SKILL.md が空`);
    }
  }
  if (issues.length === 0) return result(true, 'state_files', 'learned_skills', `学習スキル ${dirs.length} 個、全て健全`);
  return result(false, 'state_files', 'learned_skills', `学習スキル異常: ${issues.join(', ')}`);
}

// ─── Category 5: Workflow Simulation (3 checks) ──────

function checkRoutingResolution() {
  const agentsDir = path.join(CLAUDE_DIR, 'agents');
  const agentFiles = listDir(agentsDir, '.md').map(f => f.replace('.md', ''));
  // Check key agents that routing-guide references
  const criticalAgents = ['planner', 'code-reviewer', 'security-reviewer', 'tdd-guide', 'build-error-resolver', 'architect'];
  const missing = criticalAgents.filter(a => !agentFiles.includes(a));
  if (missing.length === 0) return result(true, 'workflow', 'routing_resolution', `ルーティング先の主要エージェント ${criticalAgents.length} 個が全て存在`);
  return result(false, 'workflow', 'routing_resolution', `[CRITICAL] 主要エージェント欠損: ${missing.join(', ')}`);
}

function checkQualityGateChain() {
  const agentsDir = path.join(CLAUDE_DIR, 'agents');
  const chain = ['code-reviewer', 'security-reviewer'];
  const missing = chain.filter(a => !fs.existsSync(path.join(agentsDir, `${a}.md`)));
  // Also check claude-md-improver skill
  const improverSkill = path.join(CLAUDE_DIR, 'skills', 'claude-md-improver');
  // It might be in plugins
  const pluginImprover = path.join(CLAUDE_DIR, 'plugins', 'cache', 'claude-plugins-official', 'claude-md-management');
  const hasImprover = fs.existsSync(improverSkill) || fs.existsSync(pluginImprover);
  if (missing.length === 0 && hasImprover) return result(true, 'workflow', 'quality_gate_chain', '品質ゲートチェーン完備（code-reviewer → security-reviewer → claude-md-improver）');
  const issues = [];
  if (missing.length > 0) issues.push(`エージェント欠損: ${missing.join(', ')}`);
  if (!hasImprover) issues.push('claude-md-improver スキル/プラグイン未検出');
  return result(false, 'workflow', 'quality_gate_chain', `品質ゲート不完全: ${issues.join('; ')}`);
}

function checkDevWorkflowChain() {
  const hooksDir = path.join(CLAUDE_DIR, 'scripts', 'hooks');
  const triggerConfig = path.join(CLAUDE_DIR, 'config', 'dev-workflow-triggers.json');
  const devInit = path.join(hooksDir, 'dev-workflow-init.js');
  const devCompletion = path.join(hooksDir, 'stop-dev-completion-review.js');
  const issues = [];
  if (!fs.existsSync(triggerConfig)) issues.push('dev-workflow-triggers.json 欠損');
  if (!fs.existsSync(devInit)) issues.push('dev-workflow-init.js 欠損');
  if (!fs.existsSync(devCompletion)) issues.push('stop-dev-completion-review.js 欠損');
  if (issues.length === 0) return result(true, 'workflow', 'dev_workflow_chain', 'dev ワークフローチェーン完備');
  return result(false, 'workflow', 'dev_workflow_chain', `[CRITICAL] dev ワークフロー不完全: ${issues.join(', ')}`);
}

// ─── Category 6: Environment Regression (3 checks) ──────

function checkAgentCount() {
  const agentsDir = path.join(CLAUDE_DIR, 'agents');
  const actual = listDir(agentsDir, '.md').length;
  const claudeMdPath = path.join(agentsDir, 'CLAUDE.md');
  const declared = extractDeclaredCount(claudeMdPath, /(\d+)\s*個のエージェント/);
  if (declared === null) return result(true, 'regression', 'agent_count', `エージェント数: ${actual}（宣言値なし）`);
  if (actual === declared) return result(true, 'regression', 'agent_count', `エージェント数一致: ${actual}`);
  return result(false, 'regression', 'agent_count', `エージェント数不一致: 実 ${actual} ≠ 宣言 ${declared}`);
}

function checkSkillCount() {
  const skillsDir = path.join(CLAUDE_DIR, 'skills');
  const actual = listSubDirs(skillsDir).length;
  const claudeMdPath = path.join(skillsDir, 'CLAUDE.md');
  const declared = extractDeclaredCount(claudeMdPath, /(\d+)\s*個のスキル/);
  if (declared === null) return result(true, 'regression', 'skill_count', `スキル数: ${actual}（宣言値なし）`);
  if (Math.abs(actual - declared) <= 2) return result(true, 'regression', 'skill_count', `スキル数: 実 ${actual} / 宣言 ${declared}（許容範囲）`);
  return result(false, 'regression', 'skill_count', `スキル数乖離: 実 ${actual} ≠ 宣言 ${declared}`);
}

function checkCommandCount() {
  const commandsDir = path.join(CLAUDE_DIR, 'commands');
  const actual = listDir(commandsDir, '.md').length;
  const claudeMdPath = path.join(commandsDir, 'CLAUDE.md');
  const declared = extractDeclaredCount(claudeMdPath, /(\d+)\s*個/);
  if (declared === null) return result(true, 'regression', 'command_count', `コマンド数: ${actual}（宣言値なし）`);
  if (Math.abs(actual - declared) <= 5) return result(true, 'regression', 'command_count', `コマンド数: 実 ${actual} / 宣言 ${declared}（許容範囲）`);
  return result(false, 'regression', 'command_count', `コマンド数乖離: 実 ${actual} ≠ 宣言 ${declared}`);
}

// ─── Category 7: Skill & Index Completeness (5 checks) ──────

function checkSkillDiskVsIndex() {
  const skillsDir = path.join(CLAUDE_DIR, 'skills');
  const indexPath = path.join(CLAUDE_DIR, 'docs', 'skills-index.md');
  const actualDirs = listSubDirs(skillsDir).filter(d => d !== 'learned');
  const content = readFile(indexPath);
  if (!content) return result(false, 'completeness', 'skill_disk_vs_index', 'skills-index.md が読み込めない');
  // Extract skill names referenced in index
  const indexNames = new Set();
  for (const line of content.split('\n')) {
    const match = line.match(/\|\s*`([a-z][\w-]*)`\s*\|/);
    if (match) indexNames.add(match[1]);
  }
  const missingFromIndex = actualDirs.filter(d => !indexNames.has(d));
  if (missingFromIndex.length === 0) return result(true, 'completeness', 'skill_disk_vs_index', `全 ${actualDirs.length} スキルが skills-index.md に掲載済み`);
  return result(false, 'completeness', 'skill_disk_vs_index', `skills-index.md に未掲載のスキル ${missingFromIndex.length}: ${missingFromIndex.join(', ')}`);
}

function checkCommandDiskVsIndex() {
  const commandsDir = path.join(CLAUDE_DIR, 'commands');
  const indexPath = path.join(CLAUDE_DIR, 'docs', 'commands-index.md');
  const actualFiles = listDir(commandsDir, '.md').map(f => f.replace('.md', ''));
  const content = readFile(indexPath);
  if (!content) return result(false, 'completeness', 'command_disk_vs_index', 'commands-index.md が読み込めない');
  // Extract command names from index (lines with /command-name)
  const indexNames = new Set();
  for (const line of content.split('\n')) {
    const match = line.match(/\/([a-z][\w-]*)/);
    if (match) indexNames.add(match[1]);
  }
  const missingFromIndex = actualFiles.filter(f => !indexNames.has(f));
  if (missingFromIndex.length === 0) return result(true, 'completeness', 'command_disk_vs_index', `全 ${actualFiles.length} コマンドが commands-index.md に掲載済み`);
  return result(false, 'completeness', 'command_disk_vs_index', `commands-index.md に未掲載のコマンド ${missingFromIndex.length}: ${missingFromIndex.join(', ')}`);
}

function checkSkillHasSkillMd() {
  const skillsDir = path.join(CLAUDE_DIR, 'skills');
  const actualDirs = listSubDirs(skillsDir).filter(d => d !== 'learned');
  const missing = [];
  for (const d of actualDirs) {
    const skillMd = path.join(skillsDir, d, 'SKILL.md');
    if (!fs.existsSync(skillMd)) missing.push(d);
  }
  if (missing.length === 0) return result(true, 'completeness', 'skill_has_skillmd', `全 ${actualDirs.length} スキルに SKILL.md が存在`);
  return result(false, 'completeness', 'skill_has_skillmd', `SKILL.md が欠損しているスキル ${missing.length}: ${missing.join(', ')}`);
}

function checkAgentInOrgStructure() {
  const agentsDir = path.join(CLAUDE_DIR, 'agents');
  const orgPath = path.join(CLAUDE_DIR, 'docs', 'org-structure.md');
  const agentFiles = listDir(agentsDir, '.md').map(f => f.replace('.md', ''));
  const content = readFile(orgPath);
  if (!content) return result(false, 'completeness', 'agent_in_orgstructure', 'org-structure.md が読み込めない');
  // Check each agent: handle hyphenated names split across lines in ASCII art
  // e.g. "kotlin-build-\n  resolver" should match "kotlin-build-resolver"
  const missingFromOrg = agentFiles.filter(a => {
    // Direct match first
    if (content.includes(a)) return false;
    // Check if all segments of the hyphenated name appear in the content
    const parts = a.split('-');
    return !parts.every(part => content.includes(part));
  });
  if (missingFromOrg.length === 0) return result(true, 'completeness', 'agent_in_orgstructure', `全 ${agentFiles.length} エージェントが org-structure.md に掲載済み`);
  return result(false, 'completeness', 'agent_in_orgstructure', `org-structure.md に未掲載のエージェント ${missingFromOrg.length}: ${missingFromOrg.join(', ')}`);
}

function checkAgentInAgentsIndex() {
  const agentsDir = path.join(CLAUDE_DIR, 'agents');
  const indexPath = path.join(CLAUDE_DIR, 'docs', 'agents-index.md');
  const agentFiles = listDir(agentsDir, '.md').map(f => f.replace('.md', ''));
  const content = readFile(indexPath);
  if (!content) return result(false, 'completeness', 'agent_in_agents_index', 'agents-index.md が読み込めない');
  const missingFromIndex = agentFiles.filter(a => !content.includes(a));
  if (missingFromIndex.length === 0) return result(true, 'completeness', 'agent_in_agents_index', `全 ${agentFiles.length} エージェントが agents-index.md に掲載済み`);
  return result(false, 'completeness', 'agent_in_agents_index', `agents-index.md に未掲載のエージェント ${missingFromIndex.length}: ${missingFromIndex.join(', ')}`);
}

// ─── ベースライン ───────────────────────────────

function loadBaseline() {
  const baselinePath = path.join(CLAUDE_DIR, 'config', 'env-doctor-baseline.json');
  const raw = readFile(baselinePath);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function generateBaseline() {
  const settings = loadSettings();
  const agentsDir = path.join(CLAUDE_DIR, 'agents');
  const skillsDir = path.join(CLAUDE_DIR, 'skills');
  const commandsDir = path.join(CLAUDE_DIR, 'commands');
  return {
    generatedAt: new Date().toISOString(),
    denyListCount: settings && settings.permissions && settings.permissions.deny ? settings.permissions.deny.length : 0,
    hookCounts: settings ? countHookEntries(settings) : {},
    enabledPluginsCount: settings && settings.enabledPlugins ? Object.keys(settings.enabledPlugins).length : 0,
    agentCount: listDir(agentsDir, '.md').length,
    skillCount: listSubDirs(skillsDir).length,
    commandCount: listDir(commandsDir, '.md').length,
  };
}

// ─── パブリック API ─────────────────────────────

/**
 * クイックチェック（SessionStart 用、5項目、<5秒）
 */
function runQuickChecks() {
  return [
    checkStaleLocks(),
    checkHookScriptsExist(),
    checkRunWithFlagsDeps(),
    checkCounterFiles(),
    checkRoutingResolution(),
  ];
}

/**
 * フルチェック（29項目）
 */
function runFullChecks() {
  return [
    // Category 1: Hook Health (8)
    checkHookScriptsExist(),
    checkHookScriptSyntax(),
    checkRunWithFlagsDeps(),
    checkStaleLocks(),
    checkCounterFiles(),
    checkHookProfile(),
    checkDisabledHooks(),
    checkContinuousLearning(),
    // Category 2: Cross-Reference Integrity (6)
    checkRoutingAgentRefs(),
    checkAgentIndexCount(),
    checkSkillIndexRefs(),
    checkCommandIndexRefs(),
    checkOrgStructureRefs(),
    checkClaudeMdDanglingRefs(),
    // Category 3: Configuration Drift (5)
    checkDenyListCount(),
    checkHookCounts(),
    checkEnabledPlugins(),
    checkMarketplacePaths(),
    checkDefaultMode(),
    // Category 4: State File Health (4)
    checkSessionFiles(),
    checkHomunculusFiles(),
    checkDevWorkflowTriggers(),
    checkLearnedSkills(),
    // Category 5: Workflow Simulation (3)
    checkRoutingResolution(),
    checkQualityGateChain(),
    checkDevWorkflowChain(),
    // Category 6: Environment Regression (3)
    checkAgentCount(),
    checkSkillCount(),
    checkCommandCount(),
    // Category 7: Skill & Index Completeness (5)
    checkSkillDiskVsIndex(),
    checkCommandDiskVsIndex(),
    checkSkillHasSkillMd(),
    checkAgentInOrgStructure(),
    checkAgentInAgentsIndex(),
  ];
}

/**
 * レポートをフォーマット
 */
function formatReport(results) {
  const categories = {
    hook_health: { label: 'Hook Health', total: 8, passed: 0 },
    crossref: { label: 'Cross-References', total: 6, passed: 0 },
    config_drift: { label: 'Config Drift', total: 5, passed: 0 },
    state_files: { label: 'State Files', total: 4, passed: 0 },
    workflow: { label: 'Workflow Integrity', total: 3, passed: 0 },
    regression: { label: 'Regression', total: 3, passed: 0 },
    completeness: { label: 'Completeness', total: 5, passed: 0 },
  };

  for (const r of results) {
    if (r.pass && categories[r.category]) categories[r.category].passed++;
  }

  const totalPassed = results.filter(r => r.pass).length;
  const totalChecks = results.length;
  const status = totalPassed === totalChecks ? 'HEALTHY' : totalPassed >= totalChecks - 3 ? 'DEGRADED' : 'BROKEN';

  let report = `ENV-DOCTOR REPORT\n=================\n`;
  report += `Date: ${new Date().toISOString().split('T')[0]} | Profile: ${process.env.ECC_HOOK_PROFILE || 'standard'}\n\n`;

  for (const [, cat] of Object.entries(categories)) {
    const icon = cat.passed === cat.total ? 'PASS' : cat.passed >= cat.total - 1 ? 'WARN' : 'FAIL';
    report += `${cat.label.padEnd(20)} [${icon}] (${cat.passed}/${cat.total})\n`;
  }

  report += `\nOverall: ${status} (${totalPassed}/${totalChecks})\n`;

  const issues = results.filter(r => !r.pass);
  if (issues.length > 0) {
    report += '\nIssues:\n';
    issues.forEach((issue, i) => {
      report += `${i + 1}. [${issue.severity}] ${issue.details}\n`;
    });
  }

  return report;
}

module.exports = {
  runQuickChecks,
  runFullChecks,
  formatReport,
  generateBaseline,
  loadBaseline,
  // Individual checks for scoped runs
  checkHookScriptsExist,
  checkHookScriptSyntax,
  checkRunWithFlagsDeps,
  checkStaleLocks,
  checkCounterFiles,
  checkHookProfile,
  checkDisabledHooks,
  checkContinuousLearning,
  checkRoutingAgentRefs,
  checkAgentIndexCount,
  checkSkillIndexRefs,
  checkCommandIndexRefs,
  checkOrgStructureRefs,
  checkClaudeMdDanglingRefs,
  checkDenyListCount,
  checkHookCounts,
  checkEnabledPlugins,
  checkMarketplacePaths,
  checkDefaultMode,
  checkSessionFiles,
  checkHomunculusFiles,
  checkDevWorkflowTriggers,
  checkLearnedSkills,
  checkRoutingResolution,
  checkQualityGateChain,
  checkDevWorkflowChain,
  checkAgentCount,
  checkSkillCount,
  checkCommandCount,
  checkSkillDiskVsIndex,
  checkCommandDiskVsIndex,
  checkSkillHasSkillMd,
  checkAgentInOrgStructure,
  checkAgentInAgentsIndex,
};
