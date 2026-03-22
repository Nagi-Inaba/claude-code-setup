# skills/ — ECC スキル定義

このディレクトリには70個のスキルが含まれる。（**SSoT**: スキル数はここだけで管理。他ファイルはこのファイルを参照する）

## 使い方
Skill toolの`skill`パラメータにスキル名を指定して呼び出す。

## 詳細インデックス
→ `../docs/skills-index.md` を参照

## 最重要スキル（常時意識）
- `anti-human-bottleneck` — 確認しようとしたら即実行
- `claude-md-improver` — CLAUDE.md変更後に必ず実行
- `deep-research` — 調査が必要な時
- `security-review` — セキュリティ懸念がある時
- `env-doctor` — 環境ヘルスチェック・フック動作検証

## カウント時の注意
- `learned/` はスキルディレクトリではなく学習済みパターンの格納先 — スキル数カウントから除外する
- スキル追加時は skills-index.md のカテゴリ別一覧 + トリガー一覧にも必ず追記する（env-doctor Category 7 で検出可能）

## OneDriveスキル
追加スキル: `C:/Users/Nagi/OneDrive/claudecodeskills/`（38個）
一覧: SKILLS-GUIDE.md
