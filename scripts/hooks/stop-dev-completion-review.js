#!/usr/bin/env node
/**
 * stop-dev-completion-review.js
 * Stop Hook: 開発タスク完了時に PRD/実装手順書に基づくレビューを指示する
 *
 * フロー:
 *   1. 共有ロック 'stop-dev-review' を確認
 *   2. CWD 内に PRD/実装手順書ファイルが存在するか確認
 *   3. 存在すれば → 各項目を辿って正確性レビューの指示を stdout に注入
 *   4. 存在しなければ → 空出力（スキップ）
 *
 * 'stop-workflow' ロックとは独立したロック。
 * revise-claude-md が実行された後の Stop サイクルで発火しうるが、
 * 'stop-dev-review' ロックで1回に制限。
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { acquireLock } = require('../lib/hook-lock');

const LOCK_NAME = 'stop-dev-review';

// PRD / 実装手順書の検出パターン
const PRD_PATTERNS = [
  'prd.json',
  'prd.md',
  'PRD.md',
  '.claude/prd.json',
  '.claude/prd.md',
  'docs/prd.md',
  'docs/PRD.md'
];

const PROCEDURE_PATTERNS = [
  'implementation-plan.md',
  'implementation_plan.md',
  '実装手順書.md',
  '.claude/procedures/*.md',
  'docs/implementation-plan.md',
  'docs/implementation_plan.md'
];

/**
 * CWD 内で PRD/手順書ファイルを検索
 */
function findDevArtifacts(cwd) {
  const found = { prds: [], procedures: [] };

  for (const pattern of PRD_PATTERNS) {
    const fullPath = path.join(cwd, pattern);
    if (fs.existsSync(fullPath)) {
      found.prds.push(fullPath);
    }
  }

  for (const pattern of PROCEDURE_PATTERNS) {
    if (pattern.includes('*')) {
      // Glob パターン: ディレクトリ内の全ファイルを検索
      const dir = path.join(cwd, path.dirname(pattern));
      const ext = path.extname(pattern);
      if (fs.existsSync(dir)) {
        try {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            if (file.endsWith(ext)) {
              found.procedures.push(path.join(dir, file));
            }
          }
        } catch (_) {
          // 無視
        }
      }
    } else {
      const fullPath = path.join(cwd, pattern);
      if (fs.existsSync(fullPath)) {
        found.procedures.push(fullPath);
      }
    }
  }

  return found;
}

function run(rawInput) {
  // ロック取得（Write-Ahead）
  if (!acquireLock(LOCK_NAME)) {
    return '';
  }

  const cwd = process.cwd();
  const artifacts = findDevArtifacts(cwd);

  // PRD も手順書も見つからない → スキップ
  if (artifacts.prds.length === 0 && artifacts.procedures.length === 0) {
    return '';
  }

  // レビュー指示を構築
  const lines = [
    '',
    '📋 [Stop Hook: 開発完了レビュー]',
    'PRD/実装手順書を検出しました。完了レビューを実施してください:',
    ''
  ];

  if (artifacts.prds.length > 0) {
    lines.push('**検出された PRD:**');
    for (const p of artifacts.prds) {
      lines.push(`  - ${p}`);
    }
    lines.push('');
  }

  if (artifacts.procedures.length > 0) {
    lines.push('**検出された実装手順書:**');
    for (const p of artifacts.procedures) {
      lines.push(`  - ${p}`);
    }
    lines.push('');
  }

  lines.push(
    '**レビュー手順:**',
    '1. 上記のPRD/実装手順書を読み込む',
    '2. 各要件・各ステップを最初から順番に辿る',
    '3. 実装が各項目を正確に満たしているか検証する',
    '4. 不足・差異があれば修正する',
    '5. 全項目の検証結果をサマリーとして報告する',
    '',
    '⚠️ このレビューは1セッションで1回だけ実行されます。',
    ''
  );

  return lines.join('\n');
}

module.exports = { run };
