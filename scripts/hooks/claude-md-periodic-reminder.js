#!/usr/bin/env node
/**
 * claude-md-periodic-reminder.js
 * PostToolUse hook: Edit/Write が一定回数に達したら
 * CLAUDE.md の更新をリマインドする。
 *
 * カウンターはファイルベース（セッション中持続）。
 * リマインド後カウンターをリセットし、繰り返し発火する。
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const REMINDER_INTERVAL = 15; // 15回の Edit/Write ごとにリマインド
const COUNTER_FILE = path.join(os.tmpdir(), '.claude-md-reminder-counter.json');

function getCounter() {
  try {
    const data = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8'));
    // PPIDが異なれば新セッション → リセット
    if (data.ppid !== process.ppid) {
      return { count: 0, ppid: process.ppid };
    }
    return data;
  } catch {
    return { count: 0, ppid: process.ppid };
  }
}

function saveCounter(counter) {
  fs.writeFileSync(COUNTER_FILE, JSON.stringify(counter));
}

function run(rawInput) {
  let input;
  try {
    input = JSON.parse(rawInput);
  } catch {
    return '';
  }

  const filePath = (input?.tool_input?.file_path || '').replace(/\\/g, '/');

  // CLAUDE.md 自体の編集はカウントしない（claude-md-check.js が担当）
  if (/CLAUDE\.md$/i.test(filePath)) {
    return '';
  }

  // カウンターをインクリメント
  const counter = getCounter();
  counter.count += 1;

  if (counter.count >= REMINDER_INTERVAL) {
    // リセットして次のサイクルへ
    counter.count = 0;
    saveCounter(counter);

    return [
      '',
      '📝 [定期リマインド] 変更が蓄積しています。',
      '変更したファイルが属するディレクトリの CLAUDE.md を最新状態に更新してください。',
      '更新が不要であれば無視して構いません。',
      ''
    ].join('\n');
  }

  saveCounter(counter);
  return '';
}

module.exports = { run };
