#!/usr/bin/env node
/**
 * SessionStart Hook - Daily Task Briefing
 *
 * セッション開始時に今日のタスクファイルを読み込み、
 * Claude（秘書）が優先度順に提示できるようコンテキストに注入する。
 *
 * v2: run() export 形式（run-with-flags.js 直接呼び出し対応）
 */

'use strict';

const fs = require('fs');
const path = require('path');

const COMPANY_DIR = path.join(require('os').homedir(), '.company');
const TODOS_DIR = path.join(COMPANY_DIR, 'secretary', 'todos');

function getToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getYesterday() {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function readTodoFile(dateStr) {
  const filePath = path.join(TODOS_DIR, `${dateStr}.md`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return null;
}

function countPending(content) {
  if (!content) return { total: 0, manual: 0, auto: 0 };
  const lines = content.split('\n');
  let total = 0;
  let manual = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') && !trimmed.startsWith('- [x]') && !trimmed.startsWith('- ~~')) {
      // Skip sub-items (lines starting with >) and completed items
      if (trimmed.startsWith('- T-') || (trimmed.startsWith('- ') && !trimmed.startsWith('- >'))) {
        total++;
        if (trimmed.includes('手動')) {
          manual++;
        }
      }
    }
  }
  return { total, manual, auto: total - manual };
}

function run(_rawInput) {
  const today = getToday();
  const todayContent = readTodoFile(today);
  const yesterdayContent = readTodoFile(getYesterday());

  const parts = [];

  parts.push(`SessionStart:daily-task-briefing: Today is ${today}.`);

  if (todayContent) {
    const stats = countPending(todayContent);
    parts.push(`Today's task file found: secretary/todos/${today}.md (${stats.total} pending, ${stats.manual} manual)`);
    parts.push('');
    parts.push('[DAILY-TASKS]');
    parts.push(todayContent.trim());
    parts.push('[/DAILY-TASKS]');
  } else {
    // No today file - check yesterday for carryover
    parts.push(`No task file for today (${today}).`);
    if (yesterdayContent) {
      parts.push(`Yesterday's tasks exist (secretary/todos/${getYesterday()}.md). Consider creating today's file with carryover items.`);
    }
  }

  parts.push('');
  parts.push('[BRIEFING-INSTRUCTION]');
  parts.push('When the user greets you or asks about tasks, present the daily tasks in this order:');
  parts.push('1. Security/urgent items first (marked with priority indicators)');
  parts.push('2. Items the user can act on immediately (non-manual tasks)');
  parts.push('3. Manual tasks (marked with hand icon) grouped together');
  parts.push('4. Backlog/carryover items last');
  parts.push('Suggest which task to start with based on priority and actionability.');
  parts.push('[/BRIEFING-INSTRUCTION]');

  return parts.join('\n');
}

module.exports = { run };
