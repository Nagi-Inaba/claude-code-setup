/**
 * hook-lock.js — セッション単位のフックロック機構
 *
 * Write-Ahead Lock パターン:
 *   1. ロックを先に取得（stdout出力前）
 *   2. stdout に指示を出力
 *   3. クラッシュ時は「指示未出力だがロック済み」→ 安全側に倒れる
 *
 * 排他制御: fs.writeFileSync with { flag: 'wx' } (EEXIST で判定)
 * TTL: 30分（古いロックは無視）
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const LOCK_TTL_MS = 30 * 60 * 1000; // 30 minutes
const LOCK_DIR_NAME = '.claude-hook-locks';

/**
 * ロックディレクトリのパスを返す
 */
function getLockDir() {
  const dir = path.join(os.tmpdir(), LOCK_DIR_NAME);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * セッションIDを取得（環境変数 → PID+日付フォールバック）
 */
function getSessionId() {
  const envId = process.env.CLAUDE_SESSION_ID;
  if (envId && envId.length > 0) {
    return envId.slice(-12);
  }
  // フォールバック: PPID（親プロセス=Claude本体）で一意化
  // PPIDはセッションごとに異なるため、セッション単位でロックが独立する
  const ppid = process.ppid || process.pid;
  return `fb-${ppid}`;
}

/**
 * ロックファイルのパスを生成
 * @param {string} lockName - ロック名（例: 'stop-workflow'）
 * @param {string} [sessionId] - セッションID（省略時は自動取得）
 */
function getLockPath(lockName, sessionId) {
  const sid = sessionId || getSessionId();
  const safeName = lockName.replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(getLockDir(), `${safeName}-${sid}.lock`);
}

/**
 * ロックを取得する（Write-Ahead Lock）
 * @param {string} lockName - ロック名
 * @returns {boolean} true = ロック取得成功, false = 既にロック済み or TTL内
 */
function acquireLock(lockName) {
  const lockPath = getLockPath(lockName);

  // TTL チェック: 既存ロックが有効期限内ならスキップ
  try {
    const stat = fs.statSync(lockPath);
    const age = Date.now() - stat.mtimeMs;
    if (age < LOCK_TTL_MS) {
      return false; // ロック有効 → 取得失敗
    }
    // TTL 超過 → 古いロックを削除して再取得
    fs.unlinkSync(lockPath);
  } catch (e) {
    if (e.code !== 'ENOENT') {
      return false; // 予期しないエラー → 安全側
    }
    // ENOENT: ロックなし → 取得へ進む
  }

  // 排他的にロックファイルを作成
  try {
    const content = JSON.stringify({
      pid: process.pid,
      timestamp: Date.now(),
      sessionId: getSessionId()
    });
    fs.writeFileSync(lockPath, content, { flag: 'wx' });
    return true; // ロック取得成功
  } catch (e) {
    if (e.code === 'EEXIST') {
      return false; // 別プロセスがロック取得済み
    }
    return false; // その他のエラー → 安全側
  }
}

/**
 * ロックを解放する
 * @param {string} lockName - ロック名
 */
function releaseLock(lockName) {
  const lockPath = getLockPath(lockName);
  try {
    fs.unlinkSync(lockPath);
  } catch (_) {
    // 既に削除済みなら無視
  }
}

/**
 * 指定セッションの全ロックをクリアする
 * @param {string} [sessionId] - セッションID（省略時は自動取得）
 */
function clearSessionLocks(sessionId) {
  const sid = sessionId || getSessionId();
  const lockDir = getLockDir();

  try {
    const files = fs.readdirSync(lockDir);
    for (const file of files) {
      if (file.endsWith(`-${sid}.lock`)) {
        try {
          fs.unlinkSync(path.join(lockDir, file));
        } catch (_) {
          // 無視
        }
      }
    }
  } catch (_) {
    // ディレクトリが存在しない場合は無視
  }
}

/**
 * TTL を超過した全ての古いロックを削除する
 */
function clearStaleLocks() {
  const lockDir = getLockDir();
  try {
    const files = fs.readdirSync(lockDir);
    for (const file of files) {
      if (!file.endsWith('.lock')) continue;
      const filePath = path.join(lockDir, file);
      try {
        const stat = fs.statSync(filePath);
        if (Date.now() - stat.mtimeMs > LOCK_TTL_MS) {
          fs.unlinkSync(filePath);
        }
      } catch (_) {
        // 無視
      }
    }
  } catch (_) {
    // 無視
  }
}

/**
 * 全てのロックファイルを削除する（セッションID問わず）
 * SessionStart で使用: 新セッション開始時は前セッションのロックは全て無効
 */
function clearAllLocks() {
  const lockDir = getLockDir();
  try {
    const files = fs.readdirSync(lockDir);
    for (const file of files) {
      if (!file.endsWith('.lock')) continue;
      try {
        fs.unlinkSync(path.join(lockDir, file));
      } catch (_) {
        // 無視
      }
    }
  } catch (_) {
    // ディレクトリが存在しない場合は無視
  }
}

module.exports = {
  acquireLock,
  releaseLock,
  clearSessionLocks,
  clearStaleLocks,
  clearAllLocks,
  getLockPath,
  getSessionId,
  LOCK_TTL_MS
};
