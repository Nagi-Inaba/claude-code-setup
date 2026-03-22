# Agent Organization Structure
> エージェント間の階層・ハンドオフルール・エスカレーションパス。

## 組織階層

```
                       [Orchestrator]
                      (Claude Code 本体)
                            |
           +----------------+----------------+
           |                |                |
    [Planning Layer]  [Execution Layer]  [Quality Layer]
    planner            tdd-guide          code-reviewer
    architect          build-error-       security-reviewer
                         resolver         python-reviewer
                       go-build-resolver  go-reviewer
                       kotlin-build-      kotlin-reviewer
                         resolver         database-reviewer
                       refactor-cleaner   e2e-runner
                       doc-updater
           |
    [Operations Layer]
    loop-operator
    harness-optimizer
    chief-of-staff
    env-doctor
```
> 全19エージェント。詳細は `agents-index.md` 参照。

---

## 標準ワークフロー

### 新機能実装（HIGH/EPIC）
```
planner
  └─ 実装計画作成・承認待ち
  └─ tdd-guide
       └─ テスト作成（RED）→ 実装（GREEN）→ リファクタ
       └─ code-reviewer（並列）
            └─ security-reviewer（並列）
                 └─ 変更ディレクトリの CLAUDE.md 更新
                      └─ claude-md-improver で評価・改善
                           └─ 完了
```

### バグ修正
```
tdd-guide
  └─ 再現テスト作成 → 修正 → パス確認
  └─ code-reviewer
       └─ 変更ディレクトリの CLAUDE.md 更新 → claude-md-improver
            └─ 完了
```

### ビルドエラー回復
```
(任意エージェント) -[ビルド失敗]→ build-error-resolver -[修正完了]→ 元のエージェントに復帰
```

### セキュリティエスカレーション
```
(任意エージェント) -[セキュリティ懸念]→ security-reviewer -[CRITICAL]→ 即時停止・修正
```

### CLAUDE.md 更新ワークフロー
```
CLAUDE.md 編集
  └─ claude-md-improver スキル実行（必須）
       └─ 評価スコア確認
       └─ 改善点があれば修正
       └─ 再評価（必要に応じて）
       └─ 完了
```

---

## ハンドオフドキュメント形式

エージェント間の引き継ぎには以下のフォーマットを使用:

```markdown
## HANDOFF: [送信エージェント] → [受信エージェント]
### Context
何をしたか・なぜこのエージェントに引き継ぐか

### Findings
発見事項・決定事項・変更内容

### Files Modified
- path/to/file.ts — 変更内容の説明
- ...

### Open Questions
未解決の問題・判断が必要な事項

### Recommendations
受信エージェントへの推奨アクション
```

---

## 並列実行パターン

独立したタスクは並列で実行する:

```
品質ゲート（並列実行）:
  ├─ code-reviewer: コード品質チェック
  ├─ security-reviewer: セキュリティチェック
  └─ database-reviewer: DB部分チェック（該当時）
       └─ 結果をマージして完了判定
```

```
マルチモデル計画（並列実行）:
  ├─ /multi-plan: Codex + Gemini で設計案生成
  └─ planner: Claude Opus で実装計画精緻化
```

---

## エスカレーションルール

| 条件 | アクション |
|-----|-----------|
| 同じエラーが2回連続 | loop-operator にエスカレーション |
| セキュリティ CRITICAL 発見 | 即時停止 → security-reviewer |
| アーキテクチャ判断が必要 | architect にエスカレーション |
| 複雑度が HIGH 以上に変化 | planner で再計画 |
| コンテキスト限界が近い | /save-session 実行 |
| 確認を求めたくなった | anti-human-bottleneck スキル実行 |

---

## モデル選択の原則

| モデル | エージェント | 使用場面 |
|-------|-----------|---------|
| opus | planner, architect, chief-of-staff | 深い推論・設計判断・曖昧な要件 |
| sonnet | その他全エージェント | 実装・レビュー・テスト・ビルド修正 |
| haiku | doc-updater | 機械的なドキュメント更新 |

---

## 自律実行の6原則

1. **確認禁止**: anti-human-bottleneck ルールに従い自律判断する
2. **リソース優先**: 既存スキル・エージェント・コマンドがあれば必ず使用する
3. **段階的実行**: フェーズごとに検証し、問題があれば早期にエスカレーション
4. **コンテキスト保全**: 大規模タスクでは /save-session でコンテキストを保存する
5. **CLAUDE.md更新**: ファイル・設定・コードを変更したら、変更ディレクトリの CLAUDE.md を必ず最新状態に更新する
6. **CLAUDE.md改善**: CLAUDE.md変更後は必ず claude-md-improver で評価・改善する
