/**
 * env-doctor-quick.js — SessionStart 軽量環境チェック
 *
 * 5項目のクリティカルチェックを <5秒 で実行。
 * 問題があれば警告を stdout に出力し、/env-doctor の実行を促す。
 *
 * run-with-flags.js 経由で呼び出される（全プロファイルで有効）。
 */

'use strict';

function run(rawInput) {
  try {
    const { runQuickChecks } = require('../lib/env-doctor-checks');
    const results = runQuickChecks();
    const failures = results.filter(r => !r.pass);

    if (failures.length === 0) return '';

    const lines = failures.map((f, i) => `  ${i + 1}. [${f.severity}] ${f.details}`);
    return `[env-doctor] ${failures.length} issue(s) detected:\n${lines.join('\n')}\nRun /env-doctor for full diagnosis.`;
  } catch (err) {
    // チェックライブラリ自体のエラーは握りつぶさず報告
    return `[env-doctor] Quick check failed: ${err.message}`;
  }
}

module.exports = { run };
