#!/usr/bin/env node
/**
 * stop-revise-claude-md.js
 * Stop Hook: タスク終了時に CLAUDE.md を自動更新。
 *
 * 旧: 1セッション1回のみ（共有ロック）
 * 新: クールダウン制 — 前回の実行から COOLDOWN_MINUTES 分経過していれば再実行
 *
 * これにより長時間セッションでも定期的に CLAUDE.md が更新される。
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const COOLDOWN_MINUTES = 10; // 10分間のクールダウン
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;
const STATE_FILE = path.join(os.tmpdir(), '.claude-revise-claudemd-state.json');

function getState() {
  try {
    const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    // 異なるセッション（PPID）ならリセット
    if (data.ppid !== process.ppid) {
      return { ppid: process.ppid, lastRun: 0, runCount: 0 };
    }
    return data;
  } catch {
    return { ppid: process.ppid, lastRun: 0, runCount: 0 };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state));
}

function run(rawInput) {
  const state = getState();
  const now = Date.now();
  const elapsed = now - state.lastRun;

  // クールダウン中 → スキップ
  if (elapsed < COOLDOWN_MS) {
    return '';
  }

  // クールダウン経過 → 実行
  state.lastRun = now;
  state.runCount += 1;
  saveState(state);

  const isFirst = state.runCount === 1;

  const instruction = [
    '',
    `[MANDATORY] CLAUDE.md 自動更新${isFirst ? '' : ` #${state.runCount}`} — 2ステップ実行必須`,
    '',
    'Step 1: 変更したファイルが属するディレクトリの CLAUDE.md を最新状態に更新せよ',
    'Step 2: 更新完了後、即座に以下を実行せよ（スキップ厳禁）:',
    '  Skill tool → skill: "claude-md-management:claude-md-improver"',
    '',
    'このフック指示は [MANDATORY] タグ付き — 無条件実行が CLAUDE.md ルールで義務付けられている。',
    isFirst
      ? `⏱️ 以降も作業が続く場合、${COOLDOWN_MINUTES}分ごとに再実行される。`
      : `⏱️ 前回から${Math.round(elapsed / 60000)}分経過。次回は${COOLDOWN_MINUTES}分後。`,
    ''
  ].join('\n');

  // Stop フックは stdout にプレーンテキストで指示を返す
  return instruction;
}

module.exports = { run };
