# Inter-Repository Agent Communication Protocol v0.1

異なるリポジトリに配置された専属エージェント間で、ファイルベースの非同期通信を行うための標準プロトコル。

---

## メールボックス構造

```
~/.claude/mailbox/
  ├── {repo-name}/
  │   ├── inbox/              # 受信: 他エージェントからの問い合わせ
  │   │   └── {timestamp}_{from}_{subject}.md
  │   ├── outbox/             # 送信: 他エージェントへの応答
  │   │   └── {timestamp}_{to}_{subject}.md
  │   └── registry.json       # このリポジトリのエージェント登録情報
  └── directory.json          # 全リポジトリのエージェントディレクトリ
```

---

## メッセージフォーマット

```markdown
---
from: {送信元エージェント名}
to: {宛先エージェント名}
subject: {件名（英語ケバブケース）}
type: data-query | content-proposal | cross-promo | general
timestamp: {ISO 8601}
reply-to: ~/.claude/mailbox/{送信元repo}/inbox/
---

## Request / Response

[本文: 依頼内容または応答]

## Data References

[data-catalog ID や ファイルパスでの参照。大きなデータはファイルパスで指す]
```

---

## エージェント登録 (registry.json)

各リポジトリの `~/.claude/mailbox/{repo-name}/registry.json` に登録する。

```json
{
  "repo": "re-grit",
  "path": "C:/Users/nagii/OneDrive/ドキュメント/GitHub/re-grit",
  "agents": [
    {
      "name": "re-grit-concierge",
      "role": "concierge",
      "capabilities": ["data-query", "content-proposal", "cross-promo"]
    },
    {
      "name": "career-consultant",
      "role": "specialist",
      "capabilities": ["interview-prep", "career-advice"]
    },
    {
      "name": "content-strategist",
      "role": "specialist",
      "capabilities": ["content-creation", "sns-strategy"]
    }
  ]
}
```

---

## ディレクトリ (directory.json)

全リポジトリの registry を集約したグローバルディレクトリ。
オーケストレーター、または各コンシェルジュが参照する。

```json
{
  "version": "0.1",
  "repositories": [
    {
      "name": "re-grit",
      "registry": "~/.claude/mailbox/re-grit/registry.json"
    }
  ]
}
```

新しいリポジトリにコンシェルジュを配置したら、ここにエントリを追加する。

---

## 通信フロー

```
1. 送信側: 自分の outbox/ にメッセージファイルを作成
2. 受信側: セッション開始時に inbox/ を確認（手動または SessionStart フック）
3. 受信側: 内容を処理し、自分の outbox/ に応答を作成（reply-to を参照）
4. 送信側: 次回セッションで inbox/ から応答を受信
```

**同一セッション内の場合**: mailbox を経由せず、Agent ツールで直接呼び出す方が効率的。
mailbox は異なるセッション・異なるリポジトリ間の非同期通信に使用する。

---

## 制約

| 制約 | 理由 |
|------|------|
| 非同期通信のみ | Claude Code のセッションは1リポジトリに紐づくため |
| 1メッセージ1ファイル | 追記による競合を防ぐ |
| メッセージサイズ上限: 10KB | 大きなデータはファイルパスで参照する |
| ファイル名にタイムスタンプ必須 | 時系列の追跡のため |

---

## クリーンアップルール

- 処理済みメッセージは30日後に `archive/` サブフォルダに移動
- `archive/` は90日後に削除可能
- 未処理メッセージは削除しない

---

## 新しいリポジトリの追加手順

1. `~/.claude/templates/repo-concierge.md` をコピーしてカスタマイズ
2. リポジトリの `.claude/agents/` に配置
3. `~/.claude/mailbox/{repo-name}/` ディレクトリを作成（inbox/ outbox/）
4. `registry.json` を作成
5. `~/.claude/mailbox/directory.json` にエントリを追加
