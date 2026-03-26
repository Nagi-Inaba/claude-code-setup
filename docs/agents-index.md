# Agents Index
> 全25エージェントの概要カタログ。タスクルーティング時の参照用。

## クイック参照テーブル

| エージェント名 | カテゴリ | モデル | 主な用途 | 自動発動タイミング |
|--------------|---------|-------|---------|----------------|
| planner | 計画・設計 | opus | 複雑な機能・リファクタの実装計画作成 | 機能実装・アーキテクチャ変更・複雑なリファクタ要求時 |
| architect | 計画・設計 | opus | システム設計・スケーラビリティ・技術的意思決定 | 新機能計画・大規模システム変更・アーキテクチャ判断時 |
| code-reviewer | コードレビュー | sonnet | 品質・セキュリティ・保守性の汎用コードレビュー | コード作成・変更後に必ず使用 |
| python-reviewer | コードレビュー | sonnet | Python専用コードレビュー（PEP8・型ヒント・セキュリティ） | Pythonコード変更後 |
| go-reviewer | コードレビュー | sonnet | Go専用コードレビュー（慣用的Go・並行性・エラー処理） | Goコード変更後 |
| kotlin-reviewer | コードレビュー | sonnet | Kotlin/Android/KMPコードレビュー（Coroutine・Compose） | Kotlinコード変更後 |
| database-reviewer | コードレビュー | sonnet | PostgreSQL最適化・スキーマ設計・RLS・パフォーマンス | SQL作成・マイグレーション・スキーマ設計時 |
| tdd-guide | テスト | sonnet | TDD（テスト先行開発）の実施ガイド・80%+カバレッジ確保 | 新機能実装・バグ修正・リファクタ時 |
| e2e-runner | テスト | sonnet | E2Eテストの作成・実行・メンテナンス | クリティカルなユーザーフロー確認時 |
| build-error-resolver | ビルド・エラー修正 | sonnet | TypeScript/汎用ビルドエラー・型エラーの最小差分修正 | ビルド失敗・型エラー発生時 |
| go-build-resolver | ビルド・エラー修正 | sonnet | Goビルドエラー・go vetエラーの最小差分修正 | Goビルド失敗時 |
| kotlin-build-resolver | ビルド・エラー修正 | sonnet | Kotlin/Gradleビルドエラー・依存関係問題の修正 | Kotlinビルド失敗時 |
| security-reviewer | セキュリティ | sonnet | OWASP Top 10・秘密情報検出・脆弱性修正 | 認証・API・ユーザー入力処理コード作成後 |
| refactor-cleaner | 保守・運用 | sonnet | デッドコード検出・重複削除・未使用依存関係の整理 | コードクリーンアップ・保守作業時 |
| doc-updater | 保守・運用 | haiku | コードマップ・READMEなどドキュメントの自動更新 | 新機能追加・API変更・アーキテクチャ変更後 |
| harness-optimizer | 保守・運用 | sonnet | エージェントハーネス設定の信頼性・コスト・スループット改善 | ハーネス監査・設定最適化時 |
| loop-operator | 保守・運用 | sonnet | 自律エージェントループの監視・停止条件管理・安全な介入 | 自律ループ実行・ループ停止時 |
| env-doctor | 保守・運用 | sonnet | 環境ワークフロー診断（フック・設定・参照整合性・状態ファイル） | ECC更新後・フック異常時・定期ヘルスチェック |
| chief-of-staff | コミュニケーション | opus | Email/Slack/LINE/Messengerの4段階トリアージと返信下書き | マルチチャンネルコミュニケーション管理時 |
| frontend-engineer | 実装 | sonnet | Next.js App Router + React 19 + Tailwind CSS フロントエンド実装 | フロントエンド機能・ページ・コンポーネント実装時 |
| backend-engineer | 実装 | sonnet | DDD 4層 + Next.js Server Actions + Prisma バックエンド実装 | バックエンドロジック・データモデル・API統合時 |
| infra-engineer | 実装 | sonnet | Vercel + Supabase + GitHub Actions + Docker インフラ構築 | CI/CD・デプロイ・環境構築・監視設定時 |
| mobile-engineer | 実装 | sonnet | React Native/Expo + Swift/SwiftUI + Kotlin/Compose モバイル実装 | iOS/Androidアプリ設計・実装・ビルド・テスト時 |
| ui-designer | デザイン | sonnet | デザインシステム構築・UIプロトタイプ・アクセシビリティ | UI設計・プロトタイプ・デザインシステム・WCAG準拠時 |

---

## カテゴリ別詳細

### 計画・設計

#### planner
- **モデル**: opus
- **ツール**: Read, Grep, Glob
- **用途**: 複雑な機能実装・大規模リファクタリングのための包括的な実装計画書作成。フェーズ分割・リスク分析・テスト戦略まで網羅する。
- **呼び出し**: `Agent tool, subagent_type: "planner"`
- **自動発動**: 機能実装要求・アーキテクチャ変更・複雑なリファクタ要求があった場合に積極的に使用
- **出力**: フェーズ別ステップ・ファイルパス・依存関係・リスク・成功基準を含む実装計画書

#### architect
- **モデル**: opus
- **ツール**: Read, Grep, Glob
- **用途**: システム設計・技術的トレードオフ評価・スケーラビリティ計画・コードベース全体の一貫性確保
- **呼び出し**: `Agent tool, subagent_type: "architect"`
- **自動発動**: 新機能計画時・大規模システム変更時・アーキテクチャ判断が必要な場合
- **出力**: ADR（アーキテクチャ決定記録）・設計提案・トレードオフ分析・スケーラビリティ計画

---

### コードレビュー

#### code-reviewer
- **モデル**: sonnet
- **ツール**: Read, Grep, Glob, Bash
- **用途**: セキュリティ・コード品質・React/Next.js・Node.jsバックエンドパターンを網羅した汎用コードレビュー
- **呼び出し**: `Agent tool, subagent_type: "code-reviewer"`
- **自動発動**: コード作成・変更後に必ず使用。全コード変更に適用。
- **判定基準**: CRITICAL/HIGH問題なし→承認、HIGH問題あり→警告、CRITICAL問題あり→ブロック

#### python-reviewer
- **モデル**: sonnet
- **ツール**: Read, Grep, Glob, Bash
- **用途**: Python専用レビュー。PEP8準拠・型ヒント・セキュリティ（SQLインジェクション・eval乱用）・慣用Pythonパターン
- **呼び出し**: `Agent tool, subagent_type: "python-reviewer"`
- **自動発動**: Pythonプロジェクトのコード変更後。Pythonプロジェクトでは必須。
- **診断ツール**: mypy, ruff, black, bandit, pytest --cov

#### go-reviewer
- **モデル**: sonnet
- **ツール**: Read, Grep, Glob, Bash
- **用途**: Go専用レビュー。慣用的Go・並行性パターン（goroutineリーク・mutex誤用）・エラーハンドリング・パフォーマンス
- **呼び出し**: `Agent tool, subagent_type: "go-reviewer"`
- **自動発動**: Goプロジェクトのコード変更後。Goプロジェクトでは必須。
- **診断ツール**: go vet, staticcheck, golangci-lint, go build -race, govulncheck

#### kotlin-reviewer
- **モデル**: sonnet
- **ツール**: Read, Grep, Glob, Bash
- **用途**: Kotlin/Android/KMP専用レビュー。Coroutine安全性・Flowアンチパターン・Composeパフォーマンス・クリーンアーキテクチャ
- **呼び出し**: `Agent tool, subagent_type: "kotlin-reviewer"`
- **自動発動**: Kotlin/Androidプロジェクトのコード変更後
- **特記**: CRITICALセキュリティ問題発見時は即座にsecurity-reviewerへエスカレート

#### database-reviewer
- **モデル**: sonnet
- **ツール**: Read, Write, Edit, Bash, Grep, Glob
- **用途**: PostgreSQL専用。クエリ最適化・スキーマ設計・RLS（行レベルセキュリティ）・接続管理・デッドロック防止
- **呼び出し**: `Agent tool, subagent_type: "database-reviewer"`
- **自動発動**: SQL作成・マイグレーション作成・スキーマ設計・DBパフォーマンス問題発生時
- **特記**: Supabaseベストプラクティスを組み込み済み

---

### テスト

#### tdd-guide
- **モデル**: sonnet
- **ツール**: Read, Write, Edit, Bash, Grep
- **用途**: TDD（テスト先行開発）の実施。Red-Green-Refactorサイクルの徹底・80%+カバレッジ確保・エッジケース検出
- **呼び出し**: `Agent tool, subagent_type: "tdd-guide"`
- **自動発動**: 新機能実装・バグ修正・リファクタリング時に積極的に使用
- **v1.8追加**: Eval駆動TDD（capability/regressionのevalをテスト前に定義）

#### e2e-runner
- **モデル**: sonnet
- **ツール**: Read, Write, Edit, Bash, Grep, Glob
- **用途**: E2Eテストの作成・実行・メンテナンス。Agent Browser（優先）またはPlaywrightを使用。フレーキーテスト管理・アーティファクト管理
- **呼び出し**: `Agent tool, subagent_type: "e2e-runner"`
- **自動発動**: クリティカルなユーザーフロー確認時・CI/CDパイプライン統合時
- **成功基準**: クリティカルジャーニー100%通過・全体95%+通過率・フレーキー率5%未満

---

### ビルド・エラー修正

#### build-error-resolver
- **モデル**: sonnet
- **ツール**: Read, Write, Edit, Bash, Grep, Glob
- **用途**: TypeScript/汎用ビルドエラー修正。型エラー・モジュール解決・設定エラーを最小差分で修正。アーキテクチャ変更は行わない。
- **呼び出し**: `Agent tool, subagent_type: "build-error-resolver"`
- **自動発動**: ビルド失敗・TypeScript型エラー発生時
- **制約**: 最小差分のみ。リファクタ・アーキテクチャ変更・新機能追加は一切行わない。

#### go-build-resolver
- **モデル**: sonnet
- **ツール**: Read, Write, Edit, Bash, Grep, Glob
- **用途**: Goビルドエラー・go vetエラー・linterエラー・モジュール依存関係問題の最小差分修正
- **呼び出し**: `Agent tool, subagent_type: "go-build-resolver"`
- **自動発動**: Goビルド失敗時
- **診断手順**: go build → go vet → staticcheck → golangci-lint → go mod verify の順

#### kotlin-build-resolver
- **モデル**: sonnet
- **ツール**: Read, Write, Edit, Bash, Grep, Glob
- **用途**: Kotlin/Gradleビルドエラー・依存関係競合・detekt/ktlint違反の最小差分修正
- **呼び出し**: `Agent tool, subagent_type: "kotlin-build-resolver"`
- **自動発動**: Kotlin/Gradleビルド失敗時
- **診断手順**: ./gradlew build → detekt → ktlintCheck → dependencies の順

---

### セキュリティ

#### security-reviewer
- **モデル**: sonnet
- **ツール**: Read, Write, Edit, Bash, Grep, Glob
- **用途**: OWASP Top 10チェック・秘密情報ハードコード検出・入力バリデーション・認証/認可・依存関係脆弱性
- **呼び出し**: `Agent tool, subagent_type: "security-reviewer"`
- **自動発動**: 認証コード・APIエンドポイント・ユーザー入力処理・DBクエリ・ファイルアップロード・決済コード作成後
- **緊急時**: CRITICALな脆弱性発見時は即座にプロジェクトオーナーへ報告・修正・シークレットローテーション

---

### 保守・運用

#### refactor-cleaner
- **モデル**: sonnet
- **ツール**: Read, Write, Edit, Bash, Grep, Glob
- **用途**: デッドコード検出・重複コード削除・未使用npm依存関係の整理。knip/depcheck/ts-pruneで検出し安全に削除。
- **呼び出し**: `Agent tool, subagent_type: "refactor-cleaner"`
- **自動発動**: コードクリーンアップ・保守作業時
- **制約**: アクティブな機能開発中・本番デプロイ直前・テストカバレッジが不十分な場合は使用禁止

#### doc-updater
- **モデル**: haiku
- **ツール**: Read, Write, Edit, Bash, Grep, Glob
- **用途**: コードマップ生成・README/ガイド更新・AST解析・依存関係マッピング。`docs/CODEMAPS/`以下に出力。
- **呼び出し**: `Agent tool, subagent_type: "doc-updater"`
- **自動発動**: 新機能追加・APIルート変更・依存関係追加削除・アーキテクチャ変更後
- **特記**: haiku使用でコスト効率最大化

#### harness-optimizer
- **モデル**: sonnet
- **ツール**: Read, Grep, Glob, Bash, Edit
- **用途**: エージェントハーネス設定（hooks・evals・routing・context・safety）の信頼性・コスト・スループット改善
- **呼び出し**: `Agent tool, subagent_type: "harness-optimizer"`
- **自動発動**: ハーネス監査（/harness-audit）実行時・設定最適化が必要な場合
- **制約**: 小さく可逆な変更のみ。Claude Code・Cursor・OpenCode・Codexとのクロスプラットフォーム互換性を維持。

#### loop-operator
- **モデル**: sonnet
- **ツール**: Read, Grep, Glob, Bash, Edit
- **用途**: 自律エージェントループの安全な実行管理。進捗チェックポイント追跡・ストール検出・リトライストーム防止・スコープ縮小による回復
- **呼び出し**: `Agent tool, subagent_type: "loop-operator"`
- **自動発動**: 自律ループ実行時・ループが停止・繰り返し失敗している場合
- **エスカレーション条件**: 2連続チェックポイントで進捗なし・同一スタックトレースの繰り返し失敗・コスト超過・マージコンフリクト

---

### 実装

#### frontend-engineer
- **モデル**: sonnet
- **ツール**: Read, Write, Edit, Bash, Grep, Glob
- **用途**: Next.js App Router + React 19 + Tailwind CSS によるフロントエンド実装。UIコンポーネント・ページ・状態管理・レスポンシブデザイン
- **呼び出し**: `Agent tool, subagent_type: "frontend-engineer"`
- **自動発動**: フロントエンド機能・ページ・コンポーネントの実装時

#### backend-engineer
- **モデル**: sonnet
- **ツール**: Read, Write, Edit, Bash, Grep, Glob
- **用途**: DDD 4層アーキテクチャ + Next.js Server Actions + Prisma によるバックエンド実装。ドメインモデル・ユースケース・リポジトリ・Gateway
- **呼び出し**: `Agent tool, subagent_type: "backend-engineer"`
- **自動発動**: バックエンドロジック・データモデル・API統合の実装時

#### infra-engineer
- **モデル**: sonnet
- **ツール**: Read, Write, Edit, Bash, Grep, Glob
- **用途**: Vercel + Supabase + GitHub Actions + Docker によるインフラ構築。CI/CDパイプライン・デプロイ設定・環境構築・監視
- **呼び出し**: `Agent tool, subagent_type: "infra-engineer"`
- **自動発動**: デプロイ設定・CI/CD構築・環境管理・インフラトラブルシュート時

#### mobile-engineer
- **モデル**: sonnet
- **ツール**: Read, Write, Edit, Bash, Grep, Glob
- **用途**: React Native/Expo + Swift/SwiftUI + Kotlin/Compose によるモバイルアプリ実装。iOS/Android設計・実装・ビルド・テスト
- **呼び出し**: `Agent tool, subagent_type: "mobile-engineer"`
- **自動発動**: モバイルアプリ機能実装・ビルド設定・プラットフォーム固有問題対応時

---

### デザイン

#### ui-designer
- **モデル**: sonnet
- **ツール**: Read, Write, Edit, Bash, Grep, Glob
- **用途**: デザインシステム構築・UIプロトタイプ・アクセシビリティ。業種別最適デザイン・コンポーネント仕様策定・WCAG準拠
- **呼び出し**: `Agent tool, subagent_type: "ui-designer"`
- **自動発動**: UIコンポーネント設計・プロトタイプ作成・デザインシステム構築・アクセシビリティ準拠時

---

### 保守・運用（続き）

#### env-doctor
- **モデル**: sonnet
- **ツール**: Read, Grep, Glob, Bash
- **用途**: ~/.claude/ 環境の運用健全性検証。フック発火確認・設定ドリフト検知・相互参照整合性チェック・状態ファイル検証・ワークフローシミュレーション
- **呼び出し**: `Agent tool, subagent_type: "env-doctor"` または `/env-doctor`
- **自動発動**: SessionStart で軽量5チェックが自動実行。ECC 更新後・フック異常時に積極使用
- **制約**: デフォルト Read-only。`--fix` 指定時のみ安全な自動修復（ロッククリア・カウンターリセット）を実行
- **補完関係**: `/harness-audit`（設定品質）と補完。env-doctor は運用健全性を検証。

#### chief-of-staff
- **モデル**: opus
- **ツール**: Read, Grep, Glob, Bash, Edit, Write
- **用途**: Email/Slack/LINE/Messengerの統合トリアージ。4段階分類（skip/info_only/meeting_info/action_required）で処理し、返信下書きを生成。
- **呼び出し**: `Agent tool, subagent_type: "chief-of-staff"`
- **自動発動**: マルチチャンネルコミュニケーション管理時・`/mail`・`/slack`・`/today`コマンド実行時
- **4段階分類**:
  - `skip`: noreply・bot・自動通知 → 自動アーカイブ
  - `info_only`: CC・グループチャット → 1行サマリー
  - `meeting_info`: Zoom/Teams URLや日程含む → カレンダー照合
  - `action_required`: 直接の質問・依頼 → 返信下書き生成
- **送信後処理**: カレンダー更新・relationships.md記録・Todo更新・git commit を自動実行（PostToolUseフックで強制）

---

## モデル選択サマリー

- **opus** (3エージェント): planner, architect, chief-of-staff
  - 複雑な推論・深い分析・長期計画が必要なタスク
  - 複雑な推論・深い分析・長期計画が必要なタスク
  - コスト: 最高。複雑な判断が必要な場合のみ使用。

- **sonnet** (20エージェント): code-reviewer, python-reviewer, go-reviewer, kotlin-reviewer, database-reviewer, tdd-guide, e2e-runner, build-error-resolver, go-build-resolver, kotlin-build-resolver, security-reviewer, refactor-cleaner, harness-optimizer, loop-operator, env-doctor, frontend-engineer, backend-engineer, infra-engineer, mobile-engineer, ui-designer
  - メインの開発作業・コードレビュー・テスト・ビルド修正・実装・デザイン
  - コスト: 中。日常的な開発タスクの標準モデル。

- **haiku** (1エージェント): doc-updater
  - 軽量・頻繁に呼び出されるタスク（ドキュメント生成・コードマップ更新）
  - コスト: 最低。反復的・決定論的なタスクに最適。
