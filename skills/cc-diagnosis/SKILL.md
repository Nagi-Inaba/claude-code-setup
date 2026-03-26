---
name: cc-diagnosis
description: Claude Code環境の活用度を6軸100点でスコアリングし、具体的な改善アクションを提案する診断スキル。「CC診断」「活用診断」「環境チェック」で発火。/env-doctor（健全性）や /harness-audit（設定品質）とは異なり「どれだけ活用できているか」を測る。
---

# CC活用診断 — 6軸スコアリング

## トリガー

- 「CC診断」「活用診断」「CC活用度」「環境診断」
- 「CCをもっと使いこなしたい」「活用度チェック」

## 既存ツールとの棲み分け

| ツール | 観点 | このスキルとの関係 |
|--------|------|-------------------|
| `/env-doctor` | 環境の**健全性**（壊れていないか） | 補完: 健全だが活用していないケースを検出 |
| `/harness-audit` | 設定の**品質**（ベストプラクティスか） | 補完: 品質は高いが使いこなしていないケースを検出 |
| `cc-diagnosis` | **活用度**（どれだけ使いこなしているか） | 本スキル |

## 診断プロセス

### Step 1: データ収集

以下のコマンドで環境を走査する:

```bash
# スキル数
ls ~/.claude/skills/ | wc -l

# エージェント数
ls ~/.claude/agents/ | wc -l

# フック数（settings.json から）
grep -c '"hookId"' ~/.claude/settings.json 2>/dev/null || echo 0

# MCP登録数
grep -c '"command"' ~/.claude.json 2>/dev/null || echo 0

# プラグイン数
ls ~/.claude/plugins/ 2>/dev/null | wc -l

# コマンド数
ls ~/.claude/commands/ | wc -l

# CLAUDE.md 更新日
stat -c %Y ~/.claude/CLAUDE.md 2>/dev/null || stat -f %m ~/.claude/CLAUDE.md

# memory ファイル数
ls ~/.claude/projects/*/memory/*.md 2>/dev/null | wc -l

# error-patterns 件数
cat ~/.claude/error-patterns/patterns.json 2>/dev/null | grep -c '"pattern"' || echo 0

# ルール言語数
ls ~/.claude/rules/ | grep -v CLAUDE | grep -v README | wc -l

# cron/schedule/loop 設定
# (Desktop scheduled tasks は CLI で確認不可のため手動確認を促す)
```

### Step 2: スコアリング（6軸 × 100点）

#### 1. スキル活用 (20点)

| 条件 | 点数 |
|------|------|
| スキル数 ≥ 30 | 8 |
| スキル数 10-29 | 5 |
| スキル数 1-9 | 2 |
| SKILL.md に description frontmatter がある率 ≥ 80% | 4 |
| 業種別/ドメイン別スキルがある（lp-builder, security-review 等） | 4 |
| 直近7日以内に新規スキル作成/更新がある | 4 |

#### 2. フック網羅 (15点)

| 条件 | 点数 |
|------|------|
| PreToolUse フックが1つ以上ある | 3 |
| PostToolUse フックが1つ以上ある | 3 |
| Stop フックが1つ以上ある | 3 |
| フック合計 ≥ 5 | 3 |
| セキュリティ系フックがある（security-periodic-check 等） | 3 |

#### 3. MCP活用 (15点)

| 条件 | 点数 |
|------|------|
| MCP登録数 ≥ 3 | 5 |
| MCP登録数 1-2 | 3 |
| ナレッジ系MCP（code-review-graph, oksskolten 等）がある | 5 |
| 外部サービス系MCP（Gmail, Notion, Vercel 等）がある | 5 |

#### 4. エージェント活用 (15点)

| 条件 | 点数 |
|------|------|
| カスタムエージェント数 ≥ 10 | 5 |
| カスタムエージェント数 1-9 | 3 |
| 品質系エージェント（code-reviewer, security-reviewer）がある | 5 |
| 実装系エージェント（frontend/backend/infra-engineer）がある | 5 |

#### 5. 自動化 (20点)

| 条件 | 点数 |
|------|------|
| Windows Task Scheduler or cron ジョブがある | 5 |
| UserPromptSubmit フックで自動ワークフローがある | 5 |
| SessionStart フックで自動コンテキスト注入がある | 5 |
| CI/CD 連携（GitHub Actions + CC）がある | 5 |

#### 6. ナレッジ循環 (15点)

| 条件 | 点数 |
|------|------|
| CLAUDE.md が直近3日以内に更新されている | 3 |
| memory/ ファイルが5つ以上ある | 3 |
| error-patterns に3件以上のパターンがある | 3 |
| ルールが2言語以上定義されている | 3 |
| 日次/週次の自動レポート生成がある | 3 |

### Step 3: 評価ランク

| ランク | スコア | 意味 |
|--------|--------|------|
| S | 90-100 | CC マスター — 環境を最大限活用 |
| A | 75-89 | 上級者 — 大部分を活用、微調整で S へ |
| B | 60-74 | 中級者 — 基盤はある、活用の幅を広げる余地 |
| C | 45-59 | 初級者 — 基本機能のみ、自動化の余地大 |
| D | 0-44 | 入門者 — セットアップから見直し推奨 |

### Step 4: 改善アクション生成

スコアが低いカテゴリから TOP 3 の具体的アクションを提案:

- **何をするか**（具体的な操作）
- **どのコマンド/ファイルを使うか**
- **期待される効果**（スコア何点上昇見込み）

例:
> 1. **MCP に oksskolten（RSSリーダー）を追加** → `~/.claude.json` に登録 → MCP活用 +5点
> 2. **`/env-doctor` の定期実行フックを追加** → settings.json に Stop フック登録 → 自動化 +5点

### Step 5: レポート出力

```markdown
# CC活用診断レポート
**日付**: YYYY-MM-DD
**総合スコア**: XX/100 (ランク: X)

## カテゴリ別スコア
| カテゴリ | スコア | 満点 | 判定 |
|---------|--------|------|------|
| スキル活用 | X | 20 | ○/△/× |
| フック網羅 | X | 15 | ○/△/× |
| MCP活用 | X | 15 | ○/△/× |
| エージェント | X | 15 | ○/△/× |
| 自動化 | X | 20 | ○/△/× |
| ナレッジ循環 | X | 15 | ○/△/× |

## TOP 3 改善アクション
1. [アクション + コマンド + 効果]
2. ...
3. ...

## 検出データ
[各カテゴリの生データ]
```

## 注意事項

- 診断はファイルシステムの走査のみ。外部サービスへの接続や API 呼び出しは行わない
- Desktop scheduled tasks は CLI から確認できないため、ユーザーに手動確認を促す
- スコアリング基準は環境の成長に合わせて更新する（design-system.md の差分学習サイクルと同じ思想）
