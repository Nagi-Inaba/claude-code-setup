#!/usr/bin/env node
/**
 * Continuous Learning - Session Evaluator
 *
 * Stop hook (async): 十分な作業量が溜まった時にパターン抽出を指示。
 *
 * 発火条件:
 *   1. 前回の発火から COOLDOWN_MINUTES 分以上経過
 *   2. 前回の発火からの Edit/Write 回数が MIN_TOOL_USES 以上
 *
 * v2: run() export 形式に移行（run-with-flags.js の require() 最適化対応）
 *     PPIDベースのセッション判定を統一
 */

'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const {
  getLearnedSkillsDir,
  ensureDir,
} = require('../lib/utils');

const COOLDOWN_MINUTES = 15;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;
const MIN_TOOL_USES = 10;
const STATE_FILE = path.join(os.tmpdir(), '.claude-evaluate-session-state.json');
const REMINDER_COUNTER_FILE = path.join(os.tmpdir(), '.claude-md-reminder-counter.json');

function getState() {
  try {
    const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    if (data.ppid !== process.ppid) {
      return { ppid: process.ppid, lastRun: 0, lastToolCount: 0, runCount: 0 };
    }
    return data;
  } catch {
    return { ppid: process.ppid, lastRun: 0, lastToolCount: 0, runCount: 0 };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state));
}

function getCurrentToolCount() {
  try {
    const data = JSON.parse(fs.readFileSync(REMINDER_COUNTER_FILE, 'utf8'));
    // PPID が一致するカウンターのみ参照
    if (data.ppid === process.ppid) {
      return data.count || 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

function run(rawInput) {
  const state = getState();
  const now = Date.now();
  const elapsed = now - state.lastRun;
  const currentToolCount = getCurrentToolCount();
  const toolDelta = currentToolCount - state.lastToolCount;

  // 条件1: クールダウン中 → スキップ
  if (elapsed < COOLDOWN_MS) {
    return '';
  }

  // 条件2: 十分な作業量がない → スキップ
  if (toolDelta < MIN_TOOL_USES) {
    return '';
  }

  // 条件クリア → 発火
  state.lastRun = now;
  state.lastToolCount = currentToolCount;
  state.runCount += 1;
  saveState(state);

  let learnedSkillsPath;
  try {
    learnedSkillsPath = getLearnedSkillsDir();
    ensureDir(learnedSkillsPath);
  } catch {
    learnedSkillsPath = path.join(os.homedir(), '.claude', 'skills', 'learned');
  }

  return [
    '',
    `[Self-Learning #${state.runCount}] ${toolDelta}回の変更を検出:`,
    '',
    '1. このセッションで発見した再利用可能なパターンを確認',
    `2. 有用なパターンがあれば ${learnedSkillsPath} にスキルとして保存`,
    '3. ユーザーの修正・フィードバックがあればメモリに記録',
    '4. 変更したプロジェクトの CLAUDE.md が最新状態か確認',
    '',
    `次回: ${COOLDOWN_MINUTES}分後 + ${MIN_TOOL_USES}回以上の変更があった場合`,
    ''
  ].join('\n');
}

module.exports = { run };
