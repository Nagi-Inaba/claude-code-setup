# Agent Organization Structure
> エージェント間の階層・ハンドオフルール・エスカレーションパス。

## 組織階層（5レイヤー・24エージェント）

```
                          [Orchestrator]
                         (Claude Code 本体)
                               |
    +----------+----------+----------+----------+----------+
    |          |          |          |          |          |
 [Planning] [Design] [Implement] [Quality]  [Operations]
 planner    ui-       frontend-   code-rev   loop-operator
 architect  designer  engineer    sec-rev    harness-opt
                      backend-    py-rev     chief-of-staff
                      engineer    go-rev     env-doctor
                      infra-      kt-rev
                      engineer    db-rev
                      mobile-     e2e-runner
                      engineer    build-err-res
                      tdd-guide   go-build-res
                      refact-     kt-build-res
                      cleaner
                      doc-updater
```
> 全24エージェント。詳細は `agents-index.md` 参照。

---

## 標準ワークフロー

### 新機能実装（HIGH/EPIC）
```
planner → architect（設計判断）
  → ui-designer（UIプロトタイプ・コンポーネント仕様）
  → backend-engineer + frontend-engineer（並列実装）
       backend: domain → application → infrastructure → presentation
       frontend: components → pages → routing → styling
  → infra-engineer（デプロイ設定・CI/CD・必要に応じて）
  → tdd-guide（テスト作成・カバレッジ確認）
  → code-reviewer + security-reviewer（並列品質ゲート）
  → e2e-runner（E2Eテスト）
  → CLAUDE.md 更新 → claude-md-improver
  → 完了
```

### モバイルアプリ機能追加
```
planner → architect（設計判断）
  → ui-designer（モバイルUI仕様）
  → mobile-engineer（RN/Swift/Kotlin 実装）
  → kotlin-reviewer / code-reviewer（プラットフォーム別レビュー）
  → security-reviewer（アプリセキュリティ）
  → 完了
```

### バグ修正
```
tdd-guide
  └─ 再現テスト作成 → 修正 → パス確認
  └─ code-reviewer
       └─ CLAUDE.md 更新 → claude-md-improver → 完了
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
       └─ 評価・改善 → 完了
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

### Open Questions
未解決の問題・判断が必要な事項

### Recommendations
受信エージェントへの推奨アクション
```

---

## 並列実行パターン

```
品質ゲート（並列実行）:
  ├─ code-reviewer: コード品質チェック
  ├─ security-reviewer: セキュリティチェック
  └─ database-reviewer: DB部分チェック（該当時）
       └─ 結果をマージして完了判定
```

```
実装（並列実行）:
  ├─ frontend-engineer: UI・ページ・コンポーネント
  └─ backend-engineer: ドメインモデル・ユースケース・API
       └─ 両方完了後に品質ゲートへ
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
| UI/UX判断が必要 | ui-designer にエスカレーション |
| DDD層境界が不明確 | backend-engineer に確認 |
| デプロイ・環境問題 | infra-engineer にエスカレーション |
| コンテキスト限界が近い | /save-session 実行 |
| 確認を求めたくなった | anti-human-bottleneck スキル実行 |

---

## モデル選択の原則

| モデル | エージェント | 使用場面 |
|-------|-----------|---------|
| opus | planner, architect, chief-of-staff, frontend-engineer, backend-engineer, mobile-engineer, ui-designer | 設計判断・複数レイヤー横断・DDD層境界・アーキテクチャ構築 |
| sonnet | code-reviewer, security-reviewer, tdd-guide, e2e-runner, build-error-resolver, go-build-resolver, kotlin-build-resolver, python-reviewer, go-reviewer, kotlin-reviewer, database-reviewer, refactor-cleaner, infra-engineer, loop-operator, harness-optimizer, env-doctor | 定型実装・パターン適用・レビュー・ビルド修正 |
| haiku | doc-updater | 機械的なドキュメント更新 |

---

## 自律実行の6原則

1. **確認禁止**: anti-human-bottleneck ルールに従い自律判断する
2. **リソース優先**: 既存スキル・エージェント・コマンドがあれば必ず使用する
3. **段階的実行**: フェーズごとに検証し、問題があれば早期にエスカレーション
4. **コンテキスト保全**: 大規模タスクでは /save-session でコンテキストを保存する
5. **CLAUDE.md更新**: ファイル・設定・コードを変更したら、変更ディレクトリの CLAUDE.md を必ず最新状態に更新する
6. **CLAUDE.md改善**: CLAUDE.md変更後は必ず claude-md-improver で評価・改善する
