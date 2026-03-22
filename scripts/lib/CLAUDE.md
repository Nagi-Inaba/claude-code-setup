# lib/ — 共通ライブラリ

フックスクリプトが共有する共通ライブラリ群。

## ファイル一覧

| ファイル | 用途 |
|---------|-----|
| `hook-lock.js` | セッション単位のフックロック機構（Write-Ahead Lock, TTL 30分） |
| `hook-flags.js` | ECC フックプロファイル制御（`run-with-flags.js` 内部使用） |
| `utils.js` | クロスプラットフォームユーティリティ（ファイル操作・日時・Git等） |
| `project-detect.js` | プロジェクト言語・フレームワーク自動検出 |
| `session-manager.js` | セッション管理 |
| `session-aliases.js` | セッションエイリアス管理 |
| `package-manager.js` | パッケージマネージャー検出 |
| `resolve-formatter.js` | コードフォーマッター解決 |
| `shell-split.js` | シェルコマンドパーサー |
| `env-doctor-checks.js` | 環境ワークフロー診断チェックライブラリ（34チェック関数、7カテゴリ） |
| `error-pattern-db.js` | エラーパターン学習DB（CRUD・パターンマッチ・メンテナンス・CLAUDE.md生成） |

## error-pattern-db.js — エラーパターン学習DB

- `findMatchingPattern(errorText)` → 最高 confidence のマッチングパターン or null
- `findPreventivePatterns(command)` → confidence ≥ 3 のパターン配列（降順）
- `addPending(errorOutput, command, cwd)` → pending エントリ作成
- `resolvePending(pendingId, resolutionCommand)` → パターン作成/更新
- `runMaintenance()` → アーカイブ・prune・cap enforcement
- `writeClaudeMd()` → `error-patterns/CLAUDE.md` 再生成

## hook-lock.js — フックロック機構

- `acquireLock(name)` → true/false: Write-Ahead Lock。stdout出力前に呼ぶ。セッションIDは `CLAUDE_SESSION_ID` 環境変数 → PPIDフォールバック
- `releaseLock(name)` → ロック解放
- `clearAllLocks()` → 全ロック削除（SessionStart で使用。前セッションのロックを確実にクリア）
- `clearSessionLocks([sessionId])` → 指定セッションのロック削除
- `clearStaleLocks()` → TTL(30分)超過ロックを削除
- ロックパス: `os.tmpdir()/.claude-hook-locks/{name}-{sessionId}.lock`
- 排他制御: `fs.writeFileSync` with `{ flag: 'wx' }`

### フックでの使い方

```javascript
const { acquireLock } = require('../lib/hook-lock');
function run(rawInput) {
  if (!acquireLock('my-hook-name')) return ''; // ロック済み→スキップ
  return '指示テキスト'; // stdout に注入
}
module.exports = { run };
```
