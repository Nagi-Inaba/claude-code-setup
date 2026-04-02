# /wrap-up — セッション終了ルーティン

作業完了後のセッション学習・記録を最適順序で一括実行する。

## 引数

| 引数 | 説明 |
|------|------|
| (なし) | Phase 2-4 のみ実行（レビュー済み前提） |
| `--full` | Phase 1（レビュー）から全フェーズ実行 |

## 実行フロー

```
[--full のみ] Phase 1: レビュー → Phase 2: 記録 → Phase 3: 学習 → Phase 4: 保存
```

各フェーズは前フェーズ完了後に開始する。フェーズ内は依存順に直列実行。

## 進捗トラッカー（必須）

**各ステップの開始時と完了時に、以下のチェックリストを更新表示すること。**
ユーザーがどこまで進んだか常に把握できるようにする。

```
## wrap-up 進捗
- [ ] Phase 1: /code-review        ← --full のみ
- [ ] Phase 1: /codex:review       ← --full のみ
- [ ] Phase 2: /revise-claude-md
- [ ] Phase 2: /claude-md-improver
- [ ] Phase 2: /session-report
- [ ] Phase 3: instinct 抽出
- [ ] Phase 3: /evolve
- [ ] Phase 3: /learn-eval
- [ ] Phase 4: /save-session
```

ステップ完了時: `- [x]` に更新し、結果サマリー（1行）を追記。
ステップスキップ時: `- [~]` に更新し、スキップ理由を追記。
ステップ失敗時: `- [!]` に更新し、エラー概要を追記。

**フェーズ切替時に進捗チェックリスト全体を再表示する。**

---

## Phase 1: レビュー（`--full` のみ）

### Step 1: /code-review
未コミットの変更に対してコードレビューを実行する。
- `git diff --name-only HEAD` で変更ファイルを取得
- セキュリティ（CRITICAL）、コード品質（HIGH）、ベストプラクティス（MEDIUM）を検査
- CRITICAL / HIGH の指摘があれば修正してから次へ進む

### Step 2: /codex:review
Codex プラグイン経由でセカンドオピニオンを取得する。
- `Skill` ツールで `codex:review` を呼び出す（引数: `--base {base-branch} --wait`）
- Cross-model 比較（Step 1 との一致/相違）を表示
- CRITICAL の指摘があれば修正してから次へ進む

---

## Phase 2: 記録

### Step 3: /revise-claude-md
セッションの学びを対象プロジェクトの CLAUDE.md に反映する。
- 変更したファイルがあるプロジェクトの CLAUDE.md を特定する
- 追記すべき Gotchas / パターン / 禁止事項があれば提案・適用する
- 追記不要と判断した場合は「追記なし」と報告して次へ進む

### Step 4: /claude-md-improver
Step 3 で更新した CLAUDE.md の品質を評価する。
- Quality Report を出力する（スコア + 改善提案）
- 改善提案があれば即座に適用する（ユーザー確認不要）
- Step 3 で追記なしだった場合はスキップ可

### Step 5: /session-report
作業記録を `.company/subsidiaries/{子会社}/engineering/` に保存する。
- git diff + 会話履歴から実施内容・変更ファイル・次にやることを構成する
- タスクファイル（`secretary/todos/YYYY-MM-DD.md`）も更新する

---

## Phase 3: 学習

### Step 6: instinct 抽出
セッションから新しい instinct（atomic な学習パターン）を抽出する。
- プロジェクト固有 → `~/.claude/homunculus/projects/{hash}/instincts/personal/`
- 汎用パターン → `~/.claude/homunculus/instincts/personal/`
- 既存 instinct と重複がないか確認してから作成する
- 抽出対象がなければ「抽出なし」と報告して次へ進む

### Step 7: /evolve
instinct をクラスタリングし、skill / command / agent への進化候補を分析する。
- CLI (`instinct-cli.py evolve`) が動作する場合はそれを使用する
- CLI がエラーの場合は手動分析で代替する（instinct 一覧を読んでクラスタリング）
- 進化候補がなければ分析結果のみ報告して次へ進む
- `--generate` は明示的に求められた場合のみ実行する

### Step 8: /learn-eval
セッションからスキルファイルとして保存すべきパターンを抽出・評価する。
- 品質ゲート（checklist + verdict）を通過したもののみ保存する
- 既存 instinct / memory と重複する場合は Absorb（追記）を優先する
- Drop 判定の場合は理由のみ報告して次へ進む

---

## Phase 4: 保存

### Step 9: /save-session
セッション状態を `~/.claude/sessions/YYYY-MM-DD-{id}-session.tmp` に保存する。
- 全フェーズの結果を反映した最終状態をキャプチャする
- 必ず最後に実行する（これ以降に新たな変更を加えない）

---

## 完了時の最終サマリー

全ステップ完了後、以下を表示する:

```
## wrap-up 完了サマリー
| Phase | ステップ | 結果 | 成果物 |
|-------|---------|------|--------|
| 1     | code-review | ✅/⏭️ | 指摘N件（修正済み） |
| 1     | codex       | ✅/⏭️ | 指摘N件（修正済み） |
| 2     | revise-claude-md | ✅/⏭️ | N件追記 / 追記なし |
| 2     | claude-md-improver | ✅/⏭️ | スコア: XX → YY |
| 2     | session-report | ✅ | {パス} |
| 3     | instinct    | ✅/⏭️ | N件作成 / 抽出なし |
| 3     | evolve      | ✅ | N候補 / 候補なし |
| 3     | learn-eval  | ✅/⏭️ | Save/Absorb/Drop |
| 4     | save-session | ✅ | {パス} |
```

## 注意事項

- 各ステップの出力は簡潔に（diff を見せない、パス報告のみ）
- ステップ間でユーザー確認を挟まない（自律実行）
- エラーが発生したステップはスキップして次へ進む（`[!]` マーク）
- コンテキスト節約のため、各ステップの詳細出力は最小限にする

## ツール使い分けルール（厳守）

**スキル（スラッシュコマンド）は `Skill` ツールで呼ぶ。`Agent` ツールの `subagent_type` に指定してはいけない。**

| 呼び出し対象 | 使うツール | 例 |
|-------------|-----------|-----|
| スラッシュコマンド・スキル | **Skill** ツール | `/revise-claude-md`, `/claude-md-improver`, `/save-session`, `/evolve`, `/learn-eval`, `/codex:review` |
| 実装・レビュー用エージェント | **Agent** ツール | `code-reviewer`, `planner`, `security-reviewer` |

Agent ツールにスキル名を渡すと「not found」エラーと共に全エージェント一覧（170+種）が出力され、コンテキストを大量消費する。
