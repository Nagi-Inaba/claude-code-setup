---
name: env-doctor
description: "Use when diagnosing Claude Code environment health, after ECC updates, when hooks seem broken, or when workflow behavior is unexpected. Runs 34 integrity checks across 7 categories: hook health, cross-references, config drift, state files, workflow simulation, regression detection, and skill/index completeness."
origin: custom
tools: Read, Grep, Glob, Bash
---

# Environment Doctor — 環境ワークフロー診断スキル

## When to Use

- ECC アップデート後（`install-apply.js` 実行後）
- フックが発火しない・挙動がおかしい時
- ルーティングが期待通り動かない時
- 定期的な環境ヘルスチェック（週1推奨）
- `claude -p "/env-doctor --format json" --max-budget-usd 0.50` でスケジュール実行

## `/harness-audit` との関係

| ツール | 対象 | 問い |
|--------|------|------|
| `/harness-audit` | 設定品質 | 「良いセットアップか？」（0-70 スコア） |
| `/env-doctor` | 運用健全性 | 「セットアップが実際に動いているか？」（29チェック PASS/FAIL） |

## 診断カテゴリ（7カテゴリ・34チェック）

### Category 1: Hook Health（8チェック）

| # | チェック | 検証内容 | 重大度 |
|---|---------|---------|--------|
| 1 | hook_scripts_exist | settings.json の全フックスクリプトがディスク上に存在 | CRITICAL |
| 2 | hook_script_syntax | 全フックスクリプトが `node --check` で構文エラーなし | CRITICAL |
| 3 | run_with_flags_deps | hook-flags.js, hook-lock.js, utils.js の存在確認 | CRITICAL |
| 4 | stale_locks | ロックディレクトリの肥大化（TTL 30分超が5個以上で WARNING） | WARNING |
| 5 | counter_files | カウンターファイルの JSON 妥当性 | WARNING |
| 6 | hook_profile | ECC_HOOK_PROFILE が valid (minimal/standard/strict) | WARNING |
| 7 | disabled_hooks | ECC_DISABLED_HOOKS で意図せず無効化されたフックがないか | WARNING |
| 8 | continuous_learning | observe.sh の存在確認 | WARNING |

### Category 2: Cross-Reference Integrity（6チェック）

| # | チェック | 検証内容 |
|---|---------|---------|
| 9 | routing_agent_refs | routing-guide.md のエージェント参照 → agents/ に実ファイルあり |
| 10 | agent_index_count | agents-index.md のエージェント数 ≈ agents/*.md 実数 |
| 11 | skill_index_refs | skills-index.md のスキル参照 → skills/ に実ディレクトリあり |
| 12 | command_index_refs | commands-index.md のコマンド参照 → commands/*.md に実ファイルあり |
| 13 | org_structure_refs | org-structure.md のエージェント名 ⊂ agents-index.md |
| 14 | claudemd_dangling_refs | 各 CLAUDE.md が存在しないファイルを参照していないか |

### Category 3: Configuration Drift（5チェック）

| # | チェック | 検証内容 |
|---|---------|---------|
| 15 | deny_list_count | settings.json deny リスト数 ≥ ベースライン |
| 16 | hook_counts | 各ライフサイクルイベントのフック登録数がベースライン一致 |
| 17 | enabled_plugins | enabledPlugins の変動が ±3 以内 |
| 18 | marketplace_paths | extraKnownMarketplaces のパスが全て有効 |
| 19 | default_mode | defaultMode が bypassPermissions のまま |

### Category 4: State File Health（4チェック）

| # | チェック | 検証内容 |
|---|---------|---------|
| 20 | session_files | sessions/ ディレクトリの存在 |
| 21 | homunculus_files | homunculus/ の JSON/JSONL ファイル妥当性 |
| 22 | dev_workflow_triggers | dev-workflow-triggers.json の構造妥当性 |
| 23 | learned_skills | skills/learned/ のスキルファイル健全性 |

### Category 5: Workflow Simulation（3チェック）

| # | チェック | 検証内容 |
|---|---------|---------|
| 24 | routing_resolution | 主要エージェント(planner, code-reviewer, security-reviewer, tdd-guide, build-error-resolver, architect) 全存在 |
| 25 | quality_gate_chain | code-reviewer → security-reviewer → claude-md-improver チェーン完備 |
| 26 | dev_workflow_chain | trigger config → dev-workflow-init.js → stop-dev-completion-review.js 全在 |

### Category 6: Environment Regression（3チェック）

| # | チェック | 検証内容 |
|---|---------|---------|
| 27 | agent_count | 実エージェント数 = agents/CLAUDE.md 宣言数 |
| 28 | skill_count | 実スキル数 ≈ skills/CLAUDE.md 宣言数（±2許容） |
| 29 | command_count | 実コマンド数 ≈ commands/CLAUDE.md 宣言数（±5許容） |

### Category 7: Skill & Index Completeness（5チェック）

| # | チェック | 検証内容 |
|---|---------|---------|
| 30 | skill_disk_vs_index | ディスク上の全スキルが skills-index.md に掲載されているか（逆方向チェック） |
| 31 | command_disk_vs_index | ディスク上の全コマンドが commands-index.md に掲載されているか（逆方向チェック） |
| 32 | skill_has_skillmd | 全スキルディレクトリに SKILL.md が存在するか |
| 33 | agent_in_orgstructure | 全エージェントが org-structure.md に掲載されているか |
| 34 | agent_in_agents_index | 全エージェントが agents-index.md に掲載されているか |

## 出力フォーマット

```
ENV-DOCTOR REPORT
=================
Date: 2026-03-22 | Profile: standard

Hook Health          [PASS] (8/8)
Cross-References     [WARN] (5/6)
Config Drift         [PASS] (5/5)
State Files          [PASS] (4/4)
Workflow Integrity   [PASS] (3/3)
Regression           [WARN] (2/3)
Completeness         [WARN] (4/5)

Overall: DEGRADED (31/34)

Issues:
1. [WARNING] skills-index にあるがディスクにないスキル: foo-skill
2. [WARNING] スキル数乖離: 実 71 ≠ 宣言 69

Actions:
1. skills-index.md から foo-skill を削除
2. skills/CLAUDE.md のスキル数を 71 に更新
```

## ベースライン管理

- 初回実行時 `~/.claude/config/env-doctor-baseline.json` を自動生成
- `/env-doctor --update-baseline` で現状をベースラインに保存
- ベースラインがない場合、Category 3 (Config Drift) はスキップまたは緩和判定

## 修復ガイドライン

### 安全な自動修復（`--fix` で実行可能）
- スタイルロックの削除
- カウンターファイルのリセット
- CLAUDE.md の宣言数更新

### 手動修復が必要
- フックスクリプトの欠損 → ECC 再インストール: `cd C:/dev/everything-claude-code && git pull && node scripts/install-apply.js --profile full`
- settings.json のフック登録 → 手動追加または ECC 再インストール
- プラグインの変動 → `installed_plugins.json` の確認

## コアライブラリ

チェック実装: `~/.claude/scripts/lib/env-doctor-checks.js`

```javascript
const { runFullChecks, formatReport, generateBaseline } = require('./env-doctor-checks');
const results = runFullChecks();
console.log(formatReport(results));
```
