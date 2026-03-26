---
description: "OpenAI Codex CLI で独立したセカンドオピニオンを取得。コードレビュー・敵対的チャレンジ・相談の3モード。「codex レビュー」「セカンドオピニオン」「別のAIに聞いて」と言われたとき使う。"
---

# /codex — マルチAI セカンドオピニオン

> Source: gstack `/codex` (Garry Tan) のコンセプトを ECC に適合

## 前提条件

OpenAI Codex CLI が必要:
```bash
npm install -g @openai/codex
```

## Step 0: バイナリ確認

```bash
which codex 2>/dev/null || echo "NOT_FOUND"
```

`NOT_FOUND` の場合: インストール手順を案内して停止。

## Step 1: モード判定

| 入力 | モード |
|------|--------|
| `/codex review` | Review — diff のコードレビュー |
| `/codex challenge` | Challenge — 敵対的にコードを壊しにかかる |
| `/codex {質問}` | Consult — 何でも相談 |
| `/codex` (引数なし) | diff があれば Review/Challenge を提案、なければ Consult |

## Step 2A: Review Mode

ベースブランチとの差分を Codex にレビューさせる。

```bash
# ベースブランチ検出
BASE=$(gh pr view --json baseRefName -q .baseRefName 2>/dev/null || gh repo view --json defaultBranchRef -q .defaultBranchRef.name 2>/dev/null || echo "main")

# レビュー実行（5分タイムアウト）
codex review --base "$BASE" -c 'model_reasoning_effort="high"' --enable web_search_cached
```

出力を以下のフォーマットで表示:

```
CODEX SAYS (code review):
════════════════════════════════════════════════════════════
{codex の出力をそのまま表示 — 要約・省略禁止}
════════════════════════════════════════════════════════════
GATE: PASS / FAIL (N critical findings)
```

**Cross-model 比較**: 同じセッションで `/code-review` を既に実行済みの場合:
- 両方が指摘した問題
- Codex だけが指摘した問題
- Claude だけが指摘した問題
- 一致率

## Step 2B: Challenge Mode（敵対的テスト）

```bash
codex exec "Review the changes on this branch against $BASE. Run git diff origin/$BASE to see the diff. Find ways this code will fail in production. Think like an attacker and chaos engineer. Find edge cases, race conditions, security holes, resource leaks, and silent data corruption. Be adversarial. No compliments — just problems." -s read-only -c 'model_reasoning_effort="xhigh"' --enable web_search_cached
```

## Step 2C: Consult Mode（相談）

ユーザーの質問をそのまま Codex に投げる:

```bash
codex exec "{ユーザーの質問}" -s read-only -c 'model_reasoning_effort="high"' --enable web_search_cached
```

## 重要ルール

- **! 経由で実行する（必須）**: Codex CLI は対話型ターミナルが必要。Bash ツールでは `stdin is not a terminal` エラーで動作しない。必ず `! codex ...` でユーザーのターミナルセッションで実行する
- **Read-only**: このコマンドはファイルを変更しない。Codex は read-only sandbox で実行する
- **出力はそのまま表示**: Codex の出力を要約・省略しない。全文を表示してから Claude のコメントを追記
- **二重レビュー禁止**: `/code-review` の結果を Codex に渡さない。独立した意見を得るため

## code-reviewer との棲み分け

| 観点 | /codex | code-reviewer |
|------|--------|--------------|
| AI | OpenAI (Codex CLI) | Claude (ECC エージェント) |
| 目的 | 独立したセカンドオピニオン | 主レビュー |
| モード | Review / Challenge / Consult | コードレビューのみ |
| 使い方 | `/code-review` の後に追加実行 | コード変更後に自動実行 |
