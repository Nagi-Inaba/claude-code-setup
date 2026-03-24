# claudecodeskills - Skills管理リポジトリ

## 概要
Claude Code の Skills を管理・共有するリポジトリ。OneDrive 経由で同期。

## 構成ルール
- 各スキル = 1ディレクトリ（ディレクトリ名 = スキル名）
- 各ディレクトリ内に `SKILL.md` を配置
- `SKILLS-GUIDE.md` = 全スキルのマスターインデックス（自動参照用）

## SKILL.md の必須フォーマット
```markdown
---
name: スキル名
description: 1行説明（自動トリガー判定に使われる）
---

# スキル名
...本文...
```

## ディレクトリ命名
- kebab-case（例: `dev-workflow`, `claude-api`）
- スキル名とディレクトリ名を一致させる

## 禁止事項
- `SKILL.md` の frontmatter を省略しない（`name` と `description` は必須）
- SKILLS-GUIDE.md を手動で書き換えない（スキル追加時は自動更新 or `/company` 経由で依頼）

## 担当
engineering 部署が管理。スキルの追加・変更は `engineering/docs/` にログを残す。

## スキル操作コマンド
```bash
# Claude Code でのインストール（プロジェクトスコープ）
/install-plugin cursor-skills

# ローカルパスをマーケットプレイスとして登録済み
# <your-skills-directory> が cursor-skills として登録されている
```

## Gotchas
- OneDrive 同期中はファイル編集しない（競合が発生する）
- スキル追加後は Claude Code を再起動しないとスキルが認識されない場合がある
- `SKILLS-GUIDE.md` のスキル数と実際のディレクトリ数を定期的に照合する（2026-03-17時点: 80ディレクトリ）

## 同期

`~/.claude/skills/` → このフォルダへの一方向同期がセッション終了時に自動実行される。
- フック: `~/.claude/scripts/hooks/sync-skills-to-onedrive.js`
- 差分検知: `SKILL.md` の更新日時（mtime）を比較し、変更があったスキルのみコピー
- 手動実行: `node ~/.claude/scripts/hooks/sync-skills-to-onedrive.js`

## 関連スキル
- `/create-skill` — 新スキル作成
- `/company` — 組織管理（このリポジトリ内に `company/` スキルあり）
