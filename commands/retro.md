---
description: "Git定量メトリクスベースのエンジニアリング振り返り。セッション/日/週単位で生産性を可視化する。"
---

# /retro — エンジニアリング振り返り

> Source: gstack `/retro` (Garry Tan) のコンセプトをECCに統合

## 目的

`/revise-claude-md` が「学んだことをCLAUDE.mdに反映する」定性的な振り返りであるのに対し、
`/retro` は git 履歴から定量メトリクスを算出し、生産性トレンドを可視化する。

## 実行手順

### Step 1: 期間の特定

ユーザーに期間を確認する。デフォルトは「今日」。
- 今日: `--since="today 00:00"`
- 今週: `--since="last Monday"`
- カスタム: `--since="YYYY-MM-DD"`

### Step 2: メトリクス収集

以下のコマンドでデータを収集する:

```bash
# コミット数
git log --oneline --since="$SINCE" | wc -l

# LOC 変更量
git diff --stat $(git log --reverse --since="$SINCE" --format="%H" | head -1)^..HEAD 2>/dev/null

# AI co-author rate
TOTAL=$(git log --oneline --since="$SINCE" | wc -l)
AI=$(git log --since="$SINCE" --grep="Co-Authored-By" | grep "^commit " | wc -l)

# ファイルタイプ別変更
git log --since="$SINCE" --numstat --pretty="" | awk '{print $3}' | sed 's|.*/||' | sort | uniq -c | sort -rn | head -10

# セッション検出（45分以上の間隔でセッション分割）
git log --since="$SINCE" --format="%ai" | sort
```

### Step 3: レポート生成

以下のフォーマットで出力する:

```
═══════════════════════════════════════
  Engineering Retro — {期間}
═══════════════════════════════════════

  Commits:        {N}
  LOC Added:      +{N}
  LOC Deleted:    -{N}
  Net LOC:        {N}
  Files Changed:  {N}

  Sessions:       {N} (avg {M}min each)
  LOC/Hour:       {N}
  AI Co-author:   {N}% ({X}/{Y} commits)

  Hot Files:
    1. {file} ({N} changes)
    2. {file} ({N} changes)
    3. {file} ({N} changes)

  Commit Types:
    feat: {N}  fix: {N}  refactor: {N}
    docs: {N}  test: {N}  chore: {N}

═══════════════════════════════════════
```

### Step 4: JSON スナップショット保存

結果を JSON で保存する:

```bash
mkdir -p ~/.claude/retro
```

ファイル: `~/.claude/retro/YYYY-MM-DD.json`

```json
{
  "date": "YYYY-MM-DD",
  "period": "today|week|custom",
  "commits": 0,
  "loc_added": 0,
  "loc_deleted": 0,
  "files_changed": 0,
  "sessions": 0,
  "avg_session_minutes": 0,
  "loc_per_hour": 0,
  "ai_coauthor_rate": 0.0,
  "commit_types": {},
  "hot_files": []
}
```

### Step 5: トレンド比較（過去データがある場合）

`~/.claude/retro/` に過去の JSON がある場合、前回との比較を表示:

```
  Trend (vs {前回の日付}):
    LOC/Hour:      {N} → {M} ({+/-}%)
    AI Co-author:  {N}% → {M}%
    Commits/Day:   {N} → {M}
```

## /revise-claude-md との使い分け

| 項目 | /retro | /revise-claude-md |
|------|--------|-------------------|
| 目的 | 定量メトリクス可視化 | 定性的な学び反映 |
| 出力 | レポート + JSON | CLAUDE.md 更新 |
| トリガー | 手動 | Stop フック自動 |
| 頻度 | 日次/週次 | セッション終了時 |
| 補完関係 | メトリクスで傾向を把握 | 傾向から学びを抽出 |
