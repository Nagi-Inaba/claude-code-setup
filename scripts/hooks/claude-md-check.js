#!/usr/bin/env node
/**
 * claude-md-check.js
 * PostToolUse hook: Write/Edit 後に CLAUDE.md 変更を検出し、
 * claude-md-improver の実行を Claude のコンテキストに注入する。
 *
 * v2: run() export 形式に移行（run-with-flags.js 最適化対応）
 */

'use strict';

function run(rawInput) {
  let input;
  try {
    input = JSON.parse(rawInput);
  } catch {
    return '';
  }

  const filePath = (input?.tool_input?.file_path || '').replace(/\\/g, '/');

  if (/CLAUDE\.md$/i.test(filePath)) {
    return [
      '',
      '[MANDATORY] CLAUDE.md 変更検出 — claude-md-improver 実行必須',
      `対象: ${filePath}`,
      '',
      '次のツール呼び出しを即座に実行せよ（スキップ厳禁）:',
      '  Skill tool → skill: "claude-md-management:claude-md-improver"',
      '',
      'このフック指示は [MANDATORY] タグ付き — 無条件実行が CLAUDE.md ルールで義務付けられている。',
      ''
    ].join('\n');
  }

  return '';
}

module.exports = { run };
