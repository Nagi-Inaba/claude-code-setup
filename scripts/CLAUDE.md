# scripts/ — 自動化スクリプト

Claude Code の自動化に使用されるスクリプト群。

## 構造

| ディレクトリ/ファイル | 用途 |
|--------------------|-----|
| `hooks/` | フックスクリプト群（settings.json から呼び出される） |
| `lib/hook-lock.js` | セッション単位のフックロック機構（Write-Ahead Lock, TTL 30分） |

## フック一覧

### セッション管理
| スクリプト | トリガー | 説明 |
|-----------|---------|-----|
| `session-start.js` | SessionStart | セッション開始時の初期化（`clearAllLocks()` で前セッションのロックを全クリア） |
| `daily-task-briefing.js` | SessionStart | 今日のタスクファイル読み込み→優先度順提示指示を注入（v2 run() export形式） |
| `session-end.js` | Stop | セッション状態を `sessions/` に保存 |
| `session-end-marker.js` | SessionEnd | セッション終了マーカー記録 |

### スキル同期
| スクリプト | トリガー | 説明 |
|-----------|---------|-----|
| `sync-skills-to-onedrive.js` | SessionEnd (async) | `~/.claude/skills/` → `OneDrive/claudecodeskills/` 一方向同期。SKILL.md の mtime 比較で差分のみコピー |

### コード品質
| スクリプト | トリガー | 説明 |
|-----------|---------|-----|
| `claude-md-check.js` | PostToolUse (Write/Edit) | CLAUDE.md 更新を検知（v2: run() export形式、run-with-flags.js経由） |
| `quality-gate.js` | PostToolUse (Edit/Write, async) | コード品質チェック |
| `post-edit-format.js` | PostToolUse (Edit) | 自動フォーマット |
| `post-edit-typecheck.js` | PostToolUse (Edit) | 型チェック |
| `post-edit-console-warn.js` | PostToolUse (Edit) | console.log 警告 |
| `check-console-log.js` | Stop | console.log 残存チェック |

### Git・安全対策
| スクリプト | トリガー | 説明 |
|-----------|---------|-----|
| `pre-bash-tmux-reminder.js` | PreToolUse (Bash) | tmux 環境リマインダー |
| `pre-bash-git-push-reminder.js` | PreToolUse (Bash) | git push 前の確認 |
| `pre-bash-dev-server-block.js` | PreToolUse (Bash) | dev server を tmux 外で起動するのをブロック（非Windows） |
| `post-bash-pr-created.js` | PostToolUse (Bash) | PR 作成検知 |
| `post-bash-build-complete.js` | PostToolUse (Bash) | ビルド完了検知・通知 |
| `post-bash-task-update-reminder.js` | PostToolUse (Bash) | git commit 検出 → タスクファイル更新リマインド（[MANDATORY]） |
| `doc-file-warning.js` | PreToolUse (Write) | ドキュメントファイル上書き警告 |
| `pre-write-doc-warn.js` | — | `doc-file-warning.js` の後方互換ラッパー（直接登録不要） |
| `suggest-compact.js` | PreToolUse (Edit/Write) | コンテキスト圧縮提案 |

### セキュリティ
| スクリプト | トリガー | 説明 |
|-----------|---------|-----|
| `insaits-security-wrapper.js` | PreToolUse (Bash, strict) | InsAIts セキュリティモニター（`ECC_ENABLE_INSAITS=1` で有効化） |
| `security-periodic-check.js` | PostToolUse (Edit/Write) | 即時: 危険パターン検出（シークレット・Function()・innerHTML）。定期: 20回ごとにセキュリティリマインド。v2で新規作成（以前は欠損） |

### 定期チェック
| スクリプト | トリガー | 説明 |
|-----------|---------|-----|
| `claude-md-periodic-reminder.js` | PostToolUse (Edit/Write) | 15回ごとに CLAUDE.md 更新リマインド。カウンターはファイルベース（PPID でセッション判定） |

### ワークフロー自動化
| スクリプト | トリガー | 説明 |
|-----------|---------|-----|
| `stop-revise-claude-md.js` | Stop | クールダウン制（10分間隔）で CLAUDE.md 更新を注入。プレーンテキスト出力（Stop フックは JSON 非対応） |
| `stop-dev-completion-review.js` | Stop | PRD/実装手順書が存在すれば全項目を辿って正確性レビューを指示。ロック `stop-dev-review` で1回制限 |
| `dev-workflow-init.js` | UserPromptSubmit | 開発系キーワード検出 → PRD + 実装手順書作成 → 自律ループ指示を注入。設定: `~/.claude/config/dev-workflow-triggers.json` |

### 環境診断
| スクリプト | トリガー | 説明 |
|-----------|---------|-----|
| `env-doctor-quick.js` | SessionStart | 軽量環境チェック（5項目、<5秒）。問題があれば `/env-doctor` 実行を促す |

### エラーパターン学習
| スクリプト | トリガー | 説明 |
|-----------|---------|-----|
| `error-pattern-guard.js` | PreToolUse (Bash) | コマンドを既知エラーパターンと照合し警告表示（confidence >= 3 のみ） |
| `error-pattern-capture.js` | PostToolUse (Bash) | エラー検出 → pending 記録 + 既知 fix 提案。成功時 → 直前エラーの解決追跡 |
| `error-pattern-inject.js` | SessionStart | 高信頼パターン数をログ出力。error-patterns/CLAUDE.md がセッションコンテキストに注入される |
| `error-pattern-maintain.js` | Stop (async) | パターン昇格・アーカイブ・pending 削除・CLAUDE.md 再生成 |

### 継続学習
| スクリプト | トリガー | 説明 |
|-----------|---------|-----|
| `evaluate-session.js` | Stop (async) | 発火条件: 15分経過 + Edit/Write 10回以上。パターン抽出・学習スキル保存。v2: run() export形式に移行 |

### コアユーティリティ
| スクリプト | 用途 |
|-----------|-----|
| `run-with-flags.js` | フラグベースのフックランナー。`minimal` / `standard` / `strict` モードで実行制御 |
| `check-hook-enabled.js` | `run-with-flags.js` 内部で使用されるヘルパー |
| `auto-tmux-dev.js` | Bash 実行前の tmux セッション管理 |
| `cost-tracker.js` | セッションコスト追跡（Stop, async） |
| `pre-compact.js` | コンテキスト圧縮前の状態保存（PreCompact） |

## フックのデバッグ

```bash
# フックを手動テスト（stdin にダミーJSON、stdout で出力確認）
cd ~/.claude && echo '{}' | node scripts/hooks/run-with-flags.js "<hookId>" "<scriptPath>" "<profiles>"

# ロック状態の確認
ls -la /tmp/.claude-hook-locks/

# ロックを手動クリア
rm /tmp/.claude-hook-locks/*.lock
```

## 手動実行

```bash
# 同期スクリプトを手動実行
node ~/.claude/scripts/hooks/sync-skills-to-onedrive.js
```
