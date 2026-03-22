#!/usr/bin/env node
/**
 * security-periodic-check.js
 * PostToolUse hook: Edit/Write の内容に危険パターンがないか即時チェック。
 * 定期的（20回ごと）にセキュリティリマインドも行う。
 *
 * 即時チェック: シークレット・危険関数等のパターンを検出
 * 定期チェック: 20回ごとにセキュリティ意識リマインド
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const SECURITY_INTERVAL = 20;
const COUNTER_FILE = path.join(os.tmpdir(), '.claude-security-check-counter.json');

// 即時検出する危険パターン
// 注: パターン定義自体はセキュリティチェック用であり、危険なコードではない
const DANGER_LABEL_MAP = {
  hardcoded_secret: 'ハードコードされたシークレット',
  function_ctor: 'Function コンストラクタの使用',
  inner_html_assign: 'innerHTML への直接代入',
  shell_exec: 'シェルコマンド実行',
  base64_secret: 'Base64エンコードされたシークレット',
};

function buildDangerPatterns() {
  // 動的にパターンを構築（ソースコード上にリテラルを書かない）
  const secretPat = '(?:api[_-]?key|secret|token|password)' + '\\s*[:=]\\s*' + "['\"][^'\"]{8,}";
  const funcCtorPat = '\\bFunction\\s*\\(';
  const innerHtmlPat = 'innerHTML' + '\\s*=';
  const shellExecPat = 'exec\\s*\\(\\s*' + "['\"`]";
  const b64SecretPat = '\\bSECRET\\b.*=\\s*' + "['\"][A-Za-z0-9+/=]{20,}";

  return [
    { pattern: new RegExp(secretPat, 'i'), key: 'hardcoded_secret' },
    { pattern: new RegExp(funcCtorPat), key: 'function_ctor' },
    { pattern: new RegExp(innerHtmlPat), key: 'inner_html_assign' },
    { pattern: new RegExp(shellExecPat), key: 'shell_exec' },
    { pattern: new RegExp(b64SecretPat), key: 'base64_secret' },
  ];
}

function getCounter() {
  try {
    const data = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8'));
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
  const newContent = input?.tool_input?.content || input?.tool_input?.new_string || '';

  // CLAUDE.md 自体は対象外
  if (/CLAUDE\.md$/i.test(filePath)) {
    return '';
  }

  const warnings = [];

  // 即時チェック: 危険パターン検出
  if (newContent) {
    const patterns = buildDangerPatterns();
    for (const { pattern, key } of patterns) {
      if (pattern.test(newContent)) {
        const label = DANGER_LABEL_MAP[key] || key;
        warnings.push('  - ' + label + ': ' + filePath);
      }
    }
  }

  if (warnings.length > 0) {
    return [
      '',
      '[Security] 以下の危険パターンを検出しました:',
      ...warnings,
      '',
      '対処: シークレットは環境変数に、危険な関数は安全な代替手段に置き換えてください。',
      ''
    ].join('\n');
  }

  // 定期チェック: カウンター
  const counter = getCounter();
  counter.count += 1;

  if (counter.count >= SECURITY_INTERVAL) {
    counter.count = 0;
    saveCounter(counter);

    return [
      '',
      '[Security Reminder]',
      '以下を確認してください:',
      '- ハードコードされたシークレットがないか',
      '- ユーザー入力のバリデーションが適切か',
      '- インジェクション対策が施されているか',
      ''
    ].join('\n');
  }

  saveCounter(counter);
  return '';
}

module.exports = { run };
