#!/usr/bin/env node
/**
 * dev-workflow-init.js
 * UserPromptSubmit Hook: 開発系タスクを検出し、PRD + 実装手順書の作成を指示する
 *
 * フロー:
 *   1. ユーザー入力をキーワード検出（外部設定ファイル参照）
 *   2. positive マッチ AND negative 非マッチ → 開発タスクと判定
 *   3. PRD作成 → 実装手順書作成 → 自律ループ指示を stdout に注入
 *
 * 設定ファイル: ~/.claude/config/dev-workflow-triggers.json
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { acquireLock } = require('../lib/hook-lock');

const LOCK_NAME = 'dev-workflow-init';
const CONFIG_PATH = path.join(os.homedir(), '.claude', 'config', 'dev-workflow-triggers.json');

// デフォルト設定（設定ファイルが読めない場合のフォールバック）
const DEFAULT_CONFIG = {
  positivePatterns: [
    '実装して', '機能を追加', '新機能', '作って', '作成して',
    '開発して', 'implement', 'build a', 'create a', 'new feature'
  ],
  negativePatterns: [
    'PRDを作らないで', 'PRD不要', 'PRDスキップ', '直接修正',
    'skip PRD', 'no PRD', 'レビューして', '教えて', '説明して',
    '修正して', 'バグ', 'fix', 'debug', 'review', 'explain', 'refactor'
  ],
  minInputLength: 10
};

/**
 * 設定ファイルを読み込む
 */
function loadConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    const config = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...config };
  } catch (_) {
    return DEFAULT_CONFIG;
  }
}

/**
 * ユーザー入力が開発系タスクかどうか判定
 */
function isDevTask(userInput, config) {
  if (!userInput || userInput.length < config.minInputLength) {
    return false;
  }

  const input = userInput.toLowerCase();

  // negative パターンに一致 → 開発タスクではない
  for (const neg of config.negativePatterns) {
    if (input.includes(neg.toLowerCase())) {
      return false;
    }
  }

  // positive パターンに一致 → 開発タスク
  for (const pos of config.positivePatterns) {
    if (input.includes(pos.toLowerCase())) {
      return true;
    }
  }

  return false;
}

function run(rawInput) {
  let userInput = '';

  try {
    const parsed = JSON.parse(rawInput);
    // UserPromptSubmit の stdin には user_message が含まれる
    userInput = parsed.user_message || parsed.content || parsed.prompt || '';
    if (typeof userInput !== 'string') {
      userInput = Array.isArray(userInput)
        ? userInput.map(c => (c && c.text) || '').join(' ')
        : '';
    }
  } catch (_) {
    // JSON パース失敗 → raw テキストとして扱う
    userInput = rawInput || '';
  }

  if (!userInput.trim()) {
    return '';
  }

  const config = loadConfig();

  if (!isDevTask(userInput, config)) {
    return '';
  }

  // 同一セッションで2回目以降のdev-workflow-initはスキップ
  if (!acquireLock(LOCK_NAME)) {
    return '';
  }

  const instruction = [
    '',
    '🏗️ [UserPromptSubmit Hook: 開発ワークフロー自動起動]',
    '開発系タスクを検出しました。以下の手順で進めてください:',
    '',
    '**Step 1: PRD 作成**',
    '- `/prd` スキルを実行して要件定義書(PRD)を作成する',
    '- 要件が明確でも省略禁止',
    '',
    '**Step 2: 実装手順書の作成**',
    '- PRD に基づいて実装手順書を作成する',
    '- `/ralph` でprd.jsonに変換する（PRD完了直後に自動実行）',
    '- 各ステップを明確に定義し、完了条件を記載する',
    '',
    '**Step 3: 自律実装ループ**',
    '- 実装手順書の各ステップを順番に実行する',
    '- 各ステップ完了後にテスト・検証を行う',
    '- 問題があれば自律的に修正する',
    '',
    '**Step 4: 完了レビュー（自動）**',
    '- 実装完了後、Stopフックが自動的にPRD/手順書に基づくレビューを起動する',
    '',
    '⚠️ この指示はセッション内で1回だけ注入されます。',
    ''
  ].join('\n');

  return instruction;
}

module.exports = { run };
