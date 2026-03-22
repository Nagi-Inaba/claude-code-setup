# Claude Code Skills 管理リポジトリ

Claude Codeで使用するスキルの一元管理ディレクトリ。
OneDrive上に配置し、複数PC間で同期可能。

## ディレクトリ構成

```
claudecodeskills/
├── README.md                    ← このファイル
├── SKILLS-GUIDE.md              ← 全スキルの詳細ガイド（トリガー・呼び出し方・概要）
├── .claude-plugin/
│   └── marketplace.json         ← cursor-skills ローカルマーケットプレイス定義
│
├── ── Anthropic公式スキル ──
├── algorithmic-art/
├── brand-guidelines/
├── canvas-design/
├── claude-api/
├── doc-coauthoring/
├── docx/
├── frontend-design/
├── internal-comms/
├── mcp-builder/
├── pdf/
├── pptx/
├── skill-creator/
├── slack-gif-creator/
├── theme-factory/
├── webapp-testing/
├── web-artifacts-builder/
├── web-design-guidelines/
├── vercel-composition-patterns/
├── vercel-react-best-practices/
├── vercel-react-native-skills/
├── xlsx/
│
├── ── コミュニティ / カスタムスキル ──
├── anti-human-bottleneck/
├── create-rule/
├── create-skill/
├── create-subagent/
├── migrate-to-skills/
├── prd/
├── ralph/
├── shell/
├── update-cursor-settings/
├── vercel-deploy-claimable/
│
├── ── ShinCode Dev Skills ──
├── new-webapp/
├── dev-workflow/
├── stripe-setup/
├── idea-finder/
├── growth-advisor/
│
├── ── CC-Company / CC-Secretary ──
├── company/
└── secretary/
```

## スキルの出典

| 出典 | マーケットプレイス名 | スキル数 | 内容 |
|------|------------|----------|------|
| [Anthropic公式](https://github.com/anthropics/skills) | cursor-skills | 21 | ドキュメント操作、デザイン、API、テスト等 |
| [snarktank/ralph](https://github.com/snarktank/ralph) | cursor-skills | 2 | PRD生成、自律エージェントループ |
| コミュニティ / Cursor組み込み | cursor-skills | 7 | ルール作成、スキル作成、設定変更等 |
| カスタム | cursor-skills | 1 | anti-human-bottleneck（自律実行） |
| [Shin-sibainu/shincode-dev-skills](https://github.com/Shin-sibainu/shincode-dev-skills) | shincode-dev-skills | 5 | Webアプリ開発、Stripe、ビジネス支援等 |
| [Shin-sibainu/cc-company](https://github.com/Shin-sibainu/cc-company) | cc-company | 1 | 仮想会社組織管理 |
| [Shin-sibainu/cc-secretary](https://github.com/Shin-sibainu/cc-secretary) | cc-secretary | 1 | パーソナル秘書・ライフ管理 |
| Claude Code組み込み | — | 3 | simplify, loop, keybindings-help（ここには含まず） |

**合計: 38スキル（フォルダ管理分）**

## インストール方法

### cursor-skills（ローカルマーケットプレイス）からインストール

このフォルダが `cursor-skills` マーケットプレイスとして登録されている場合:

```bash
# 個別インストール
claude plugins install <スキル名>@cursor-skills

# 例
claude plugins install anti-human-bottleneck@cursor-skills
claude plugins install prd@cursor-skills
```

### マーケットプレイスとして登録する（新しいPCでの初回設定）

```bash
claude plugins marketplace add "C:/Users/<ユーザー名>/OneDrive/claudecodeskills"
```

### shincode-dev-skills / cc-company / cc-secretary からインストール

```bash
# マーケットプレイス登録
claude plugins marketplace add Shin-sibainu/shincode-dev-skills
claude plugins marketplace add Shin-sibainu/cc-company
claude plugins marketplace add Shin-sibainu/cc-secretary

# インストール
claude plugins install new-webapp@shincode-dev-skills
claude plugins install dev-workflow@shincode-dev-skills
claude plugins install company@cc-company
claude plugins install secretary@cc-secretary
```

### インストール済みスキルの確認

```bash
claude plugins list
```

## 使い方

スキルは2つの方法で呼び出される:

1. **自動トリガー** — 会話中の文脈やキーワードに応じてClaude Codeが自動的にスキルを読み込む
2. **明示的呼び出し** — `/スキル名` で直接呼び出す（例: `/pdf`, `/docx`, `/prd`）

各スキルのトリガーワードや詳細は [SKILLS-GUIDE.md](SKILLS-GUIDE.md) を参照。

## スキルの追加・更新

### 新しいスキルを追加する場合

1. このディレクトリにスキルフォルダを作成:
   ```bash
   mkdir ~/OneDrive/claudecodeskills/<スキル名>
   ```

2. `SKILL.md` を作成（フロントマター必須）:
   ```markdown
   ---
   name: スキル名
   description: スキルの説明。いつ使うかを含める。
   ---
   # スキル名

   本文...
   ```

3. `.claude-plugin/marketplace.json` にエントリを追加

4. インストール:
   ```bash
   claude plugins install <スキル名>@cursor-skills
   ```

5. `SKILLS-GUIDE.md` にエントリを追加

## SKILL.md のフォーマット

```markdown
---
name: my-skill                  # 必須: 小文字+ハイフン、最大64文字
description: スキルの説明文      # 必須: 最大1024文字、トリガーワードを含める
disable-model-invocation: true  # 任意: trueにすると自動トリガーされない
---

# スキル名

## 手順
ステップバイステップの説明...

## 例
具体的な使用例...
```

### description の書き方のコツ

- **何をするか** と **いつ使うか** の両方を含める
- トリガーとなるキーワードを明示的に記述する
- 三人称で書く（「ユーザーを助ける」ではなく「○○を処理する」）

## 注意事項

- スキルをインストール・変更した場合、新しいClaude Codeセッションで反映される
- スキルは500行以内が推奨（長い場合は参照ファイルに分離）
- OneDriveの同期競合に注意（複数PCで同時編集しない）
