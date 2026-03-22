# Task Routing Guide
> タスクを受け取ったら、このデシジョンツリーに従い最適なリソースを自律選択する。

## ⚡ 自動発動ルール（最優先）

以下の条件は**コマンド不要・即時発動**:

| 条件 | アクション |
|-----|-----------|
| 確認・承認を求めようとした | `anti-human-bottleneck` スキルを即実行 |
| **ファイル・設定・コードを変更した** | **変更ディレクトリの CLAUDE.md を更新する** |
| **CLAUDE.mdを作成・編集した** | **`claude-md-improver` スキルを必ず実行** |
| コード変更後 | 言語別 reviewer エージェントを起動 |
| ビルド失敗 | 言語別 build-resolver エージェントを起動 |
| セキュリティキーワード検出 | `security-reviewer` エージェントを起動 |
| **実装フェーズに入った** | **ps-系スキルで実装する（Step 3.5 参照）** |

---

## Step 1: タスク種別の判定

| 種別 | シグナル |
|-----|---------|
| `NEW_FEATURE` | 新機能・追加・実装・作って・作成して |
| `BUG_FIX` | バグ・修正・動かない・エラーが出る |
| `REFACTOR` | リファクタ・整理・改善・デッドコード |
| `REVIEW` | レビュー・チェック・確認 |
| `BUILD_ERROR` | ビルドエラー・コンパイルエラー・型エラー |
| `TEST` | テスト・カバレッジ・TDD |
| `SECURITY` | セキュリティ・脆弱性・認証・APIキー |
| `ARCHITECTURE` | 設計・アーキテクチャ・スケーラビリティ |
| `DOCUMENTATION` | ドキュメント・README・コードマップ・CLAUDE.md |
| `RESEARCH` | 調査・リサーチ・比較・検討 |
| `COMMUNICATION` | メール・Slack・LINE・返信 |
| `PROJECT_MGMT` | PRD・要件定義・タスク管理・ロードマップ |
| `DESIGN` | デザイン・UI・スライド・ポスター |
| `DOCUMENT_OPS` | Word・PDF・Excel・PowerPoint |
| `MULTI_MODEL` | マルチモデル・並列計画・Codex連携 |

---

## Step 2: 複雑度の判定

| 複雑度 | 基準 | 推奨モデル |
|-------|-----|----------|
| `TRIVIAL` | 単一ファイル、明確な変更 | sonnet |
| `LOW` | 2-3ファイル、パターン適用 | sonnet |
| `MEDIUM` | 複数ファイル、設計判断あり | sonnet |
| `HIGH` | アーキテクチャ変更・多段階 | opus |
| `EPIC` | 複数フェーズ・要件定義必要 | opus + multi-model |

---

## Step 3: リソース選択マトリクス

| 種別 × 複雑度 | Primary | Secondary | コマンド |
|-------------|---------|-----------|---------|
| `NEW_FEATURE` + HIGH/EPIC | planner → **ps-系スキル** → tdd-guide | code-reviewer, security-reviewer | `/orchestrate feature` → Step 3.5 |
| `NEW_FEATURE` + LOW/MEDIUM | **ps-系スキル** → tdd-guide | code-reviewer | Step 3.5 → `/tdd` |
| `BUG_FIX` + any | tdd-guide | code-reviewer | `/tdd` |
| `REFACTOR` + any | refactor-cleaner | code-reviewer | `/refactor-clean` |
| `REVIEW` + any | code-reviewer | security-reviewer | `/code-review` |
| `BUILD_ERROR` + TS/汎用 | build-error-resolver | — | `/build-fix` |
| `BUILD_ERROR` + Go | go-build-resolver | — | `/go-build` |
| `BUILD_ERROR` + Kotlin | kotlin-build-resolver | — | `/kotlin-build` |
| `TEST` + any | tdd-guide | e2e-runner | `/tdd`, `/e2e` |
| `SECURITY` + any | security-reviewer | code-reviewer | `/code-review` |
| `ARCHITECTURE` + any | architect | planner | `/plan` |
| `DOCUMENTATION` + any | doc-updater | — | `/update-docs` |
| `RESEARCH` + any | — (deep-research skill) | — | deep-research スキル |
| `COMMUNICATION` + any | chief-of-staff | — | 直接起動 |
| `PROJECT_MGMT` + any | — (skill) | — | `/prd` → `/ralph` |
| `DESIGN` + any | — (skill) | — | frontend-design / canvas-design スキル |
| `DOCUMENT_OPS` + any | — (skill) | — | docx / pdf / xlsx / pptx スキル |
| `MULTI_MODEL` + HIGH/EPIC | planner (並列) | codex, gemini | `/multi-plan`, `/multi-workflow` |

---

## Step 3.5: 実装フェーズ — product-starter スキル適用

**全プロジェクト共通で適用する。** 計画・PRD フェーズが完了し、実装に入った時点で以下のスキルを使用する。

### 自動判定（補強条件）
以下のいずれかを検出した場合、ps-系スキルの適用を**特に強く推奨**:
- `src/backend/domain/` ディレクトリが存在する
- `prisma/schema.prisma` が存在する
- `.dependency-cruiser.js` が存在する
- プロジェクト CLAUDE.md に `product-starter` または `DDD` の記載がある

### 実装タスク → スキル対応表

| ユーザーの指示 | 使用スキル |
|-------------|-----------|
| 「〇〇な機能を作って」「〇〇機能を追加して」 | `ps-add-feature` |
| 「〇〇ページを作って」「〇〇画面を追加して」 | `ps-add-page` |
| 「〇〇テーブルを追加して」「〇〇カラムを追加して」 | `ps-db-table` |
| 「〇〇APIと連携して」「〇〇サービスを使いたい」 | `ps-add-api-integration` |
| 「〇〇な画面を作って」「デザインを変えて」 | `ps-design-ui` |
| 「このエラーを直して」+ エラーメッセージ | `ps-fix-error` |

### 実装後のフロー
```
ps-系スキルで実装
  → pnpm verify（ps-fix-error で修正）
  → code-reviewer エージェント（ECC 品質ゲート）
  → security-reviewer エージェント
  → /ps-pr でPR作成
```

---

## Step 4: 言語固有ルーティング

| 言語 | Reviewer | Build Resolver | テストコマンド |
|-----|---------|----------------|-------------|
| Python | python-reviewer | build-error-resolver | `/tdd` (pytest) |
| Go | go-reviewer | go-build-resolver | `/go-test` |
| Kotlin/Android | kotlin-reviewer | kotlin-build-resolver | `/kotlin-test` |
| TypeScript/JS | code-reviewer | build-error-resolver | `/tdd` (jest/vitest) |
| SQL/DB | database-reviewer | — | — |

---

## Step 5: CLAUDE.md 専用ルーティング

**CLAUDE.mdに関わる全アクションに適用:**

```
CLAUDE.md 作成・編集
  └─ (変更を保存)
  └─ claude-md-improver スキルを実行（必須・自動）
      └─ 評価スコアと改善提案を確認
      └─ 改善が必要な場合は修正してから次の作業へ進む
```

このルールは以下全てに適用:
- `~/.claude/CLAUDE.md`（ルート）
- `~/.claude/docs/CLAUDE.md`
- `~/.claude/agents/CLAUDE.md`
- `~/.claude/commands/CLAUDE.md`
- `~/.claude/skills/CLAUDE.md`
- `~/.claude/rules/*/CLAUDE.md`
- 全プロジェクト配下の `CLAUDE.md`

---

## Step 6: フォールバックルール

ルーティングが「該当なし」の場合:
1. `/plan` でタスクを分解・整理する
2. planner エージェントにエスカレーションする
3. 複雑度が HIGH 以上に変化した場合は再ルーティング

---

## インデックス参照

- エージェント詳細 → `agents-index.md`
- コマンド詳細 → `commands-index.md`
- スキル詳細 → `skills-index.md`
- 組織構造・ハンドオフ → `org-structure.md`
