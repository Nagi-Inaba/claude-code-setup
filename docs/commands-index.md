# Commands Index
> 全スラッシュコマンドの概要カタログ。タスクルーティング時の参照用。

## クイック参照テーブル

| コマンド | カテゴリ | 用途サマリー | 関連エージェント |
|---------|---------|------------|--------------|
| /plan | 計画・設計 | 実装計画作成、ユーザー承認待ち | planner |
| /tdd | テスト | TDDワークフロー強制、80%カバレッジ確保 | tdd-guide |
| /code-review | コードレビュー | セキュリティ・品質の包括的レビュー | code-reviewer |
| /build-fix | ビルド修正 | ビルドエラーを段階的に修正 | build-error-resolver |
| /save-session | セッション管理 | セッション状態を日付付きファイルに保存 | — |
| /resume-session | セッション管理 | 保存済みセッションを読み込んで作業再開 | — |
| /orchestrate | マルチエージェント | 複数エージェントの逐次ワークフロー実行 | 複数 |
| /quality-gate | 品質管理 | フォーマット・Lint・型チェックパイプライン | — |
| /verify | 品質管理 | ビルド・型・Lint・テスト・Gitの総合検証 | — |
| /e2e | テスト | Playwrightでのエンドツーエンドテスト | e2e-runner |
| /test-coverage | テスト | カバレッジ分析・不足テスト自動生成 | — |
| /go-build | ビルド修正 | Goビルドエラーの段階的修正 | go-build-resolver |
| /go-review | コードレビュー | Goコードの慣用パターン・同時実行安全性レビュー | go-reviewer |
| /go-test | テスト | GoのTDDワークフロー（テーブル駆動テスト）| tdd-guide |
| /gradle-build | ビルド修正 | Android/KMPのGradleビルドエラー修正 | — |
| /kotlin-build | ビルド修正 | KotlinビルドエラーとDetekt違反の修正 | kotlin-build-resolver |
| /kotlin-review | コードレビュー | KotlinのNull安全・Coroutine・セキュリティレビュー | kotlin-reviewer |
| /kotlin-test | テスト | KotlinのTDDワークフロー（Kotest + Kover） | tdd-guide |
| /python-review | コードレビュー | PythonのPEP8・型ヒント・セキュリティレビュー | python-reviewer |
| /refactor-clean | リファクタリング | デッドコードの安全な特定と削除 | refactor-cleaner |
| /update-codemaps | 保守 | コードベース構造のアーキテクチャドキュメント生成 | — |
| /update-docs | 保守 | ソースコードからドキュメントを自動同期 | doc-updater |
| /revise-claude-md | 学習・進化 | セッション学習をCLAUDE.mdに反映 | — |
| /learn | 学習・進化 | セッションから再利用可能なパターンを抽出 | — |
| /learn-eval | 学習・進化 | パターン抽出・品質評価・保存場所決定 | — |
| /skill-create | 学習・進化 | gitヒストリからコーディングパターンを抽出しスキル生成 | — |
| /eval | 学習・進化 | Eval駆動開発ワークフローの管理 | — |
| /evolve | 学習・進化 | インスティンクト分析・上位構造への進化 | — |
| /instinct-status | 学習・進化 | プロジェクト・グローバルのインスティンクト一覧表示 | — |
| /instinct-export | 学習・進化 | インスティンクトをファイルにエクスポート | — |
| /instinct-import | 学習・進化 | ファイル・URLからインスティンクトをインポート | — |
| /promote | 学習・進化 | プロジェクトスコープのインスティンクトをグローバルに昇格 | — |
| /projects | プロジェクト管理 | プロジェクト一覧とインスティンクト統計の表示 | — |
| /multi-workflow | マルチモデル協調 | 6フェーズマルチモデル協調開発ワークフロー | Codex/Gemini |
| /multi-plan | マルチモデル協調 | Codex+Geminiによるデュアルモデル計画立案 | Codex/Gemini |
| /multi-execute | マルチモデル協調 | マルチモデル協調実行・プロトタイプ洗練 | Codex/Gemini |
| /multi-backend | マルチモデル協調 | バックエンド特化型マルチモデルワークフロー | Codex |
| /multi-frontend | マルチモデル協調 | フロントエンド特化型マルチモデルワークフロー | Gemini |
| /model-route | ユーティリティ | タスクに最適なモデルティアの推薦 | — |
| /prompt-optimize | ユーティリティ | ECCを最大活用するプロンプト最適化分析 | — |
| /checkpoint | セッション管理 | ワークフローのチェックポイント作成・検証 | — |
| /sessions | セッション管理 | セッション履歴の一覧・読込・エイリアス管理 | — |
| /harness-audit | ユーティリティ | エージェントハーネス設定の監査・スコアカード | — |
| /env-doctor | ユーティリティ | 環境ワークフロー診断（29チェック・6カテゴリ） | env-doctor |
| /retro | 振り返り | Git定量メトリクスベースのエンジニアリング振り返り | — |
| /office-hours | 企画 | YC式アイデア壁打ち・デザインドキュメント生成 | — |
| /qa | テスト | Webアプリ体系的QAテスト＋バグ修正ループ | — |
| /codex | セカンドオピニオン | OpenAI Codex CLIでレビュー・チャレンジ・相談 | — |
| /autoresearch | 自律改善 | Karpathy式自律改善ループ（+7サブコマンド） | — |
| /loop-start | ループ操作 | 自律ループパターンの開始（安全デフォルト付き） | — |
| /loop-status | ループ操作 | アクティブループの状態・進捗・失敗シグナルの確認 | — |
| /aside | ユーティリティ | 作業中断なしでサイドクエスチョンに即答 | — |
| /wrap-up | セッション管理 | セッション終了ルーティン一括実行（レビュー→記録→学習→保存） | — |
| /setup-pm | ユーティリティ | パッケージマネージャの設定（npm/pnpm/yarn/bun） | — |
| /pm2 | ユーティリティ | PM2サービスコマンドの自動生成 | — |
| /claw | ユーティリティ | NanoClaw v2 対話型AIエージェントREPL起動 | — |
| /ps-init | DDD実装(ps) | プロジェクト初期セットアップ（ツールインストール→DB構築→dev server起動） | — |
| /ps-plan | DDD実装(ps) | DDD準拠の設計ドキュメント作成（`docs/tasks/` に保存） | — |
| /ps-pr | DDD実装(ps) | フィーチャーブランチ作成→品質チェック→PR作成 | — |

---

## カテゴリ別詳細

### 計画・設計

#### /plan [task-description]
- **用途**: 実装計画の作成。要件の明確化、リスク特定、段階的ステップ分解を行い、**コード変更前にユーザー承認を必ず得る**
- **関連エージェント**: planner
- **使用タイミング**: 新機能開始前、アーキテクチャ変更、複数ファイルに影響する改修
- **重要**: コード実装前に必ず確認を得る（WAIT for user CONFIRM）

---

### コードレビュー

#### /code-review
- **用途**: `git diff HEAD` で変更ファイルを取得し、セキュリティ（CRITICAL）・コード品質（HIGH）・ベストプラクティス（MEDIUM）の3段階でレビューレポート生成
- **チェック内容**: ハードコードされた認証情報、SQLインジェクション、XSS、関数50行超、ファイル800行超、ネスト4段超、エラーハンドリング不足など

#### /go-review
- **用途**: Goコードの包括的レビュー。慣用パターン、同時実行安全性、エラーハンドリング、セキュリティを確認
- **関連エージェント**: go-reviewer
- **実行内容**: `go vet`、`staticcheck`、`golangci-lint`の静的解析 + セキュリティスキャン + Goroutine安全性

#### /kotlin-review
- **用途**: KotlinコードのNull安全性、Coroutine安全性、セキュリティの包括的レビュー
- **関連エージェント**: kotlin-reviewer
- **実行内容**: `./gradlew build`、`detekt`、`ktlintCheck` + 修正セキュリティスキャン

#### /python-review
- **用途**: PythonコードのPEP8適合性、型ヒント、セキュリティ、Pythonicイディオムの包括的レビュー
- **関連エージェント**: python-reviewer
- **実行内容**: `ruff`、`mypy`、`pylint`、`black --check` + セキュリティスキャン

---

### テスト

#### /tdd [feature-description]
- **用途**: TDDワークフロー強制。インターフェース定義 → テスト先行作成（RED）→ 最小実装（GREEN）→ リファクタ → 80%カバレッジ確認
- **関連エージェント**: tdd-guide
- **使用タイミング**: 新機能実装時、バグ修正時（再現テスト先行）、重要ビジネスロジックの構築

#### /e2e [flow-description]
- **用途**: Playwrightを使用したE2Eテストの生成・実行。スクリーンショット・動画・トレースのキャプチャ、フレイキーテストの隔離
- **関連エージェント**: e2e-runner
- **使用タイミング**: 重要ユーザーフロー（ログイン、決済）のテスト、本番デプロイ前の検証

#### /test-coverage
- **用途**: テストカバレッジ分析、80%未満のファイル特定、不足テストの自動生成
- **対応**: Jest、Vitest、pytest、Cargo、JaCoCo、Go test（プロジェクトタイプを自動検出）

#### /go-test
- **用途**: GoのTDDワークフロー。テーブル駆動テスト先行作成、`go test -cover`で80%カバレッジ確認
- **関連エージェント**: tdd-guide

#### /kotlin-test
- **用途**: KotlinのTDDワークフロー。Kotest + MockKでテスト先行作成、Koverで80%カバレッジ確認
- **関連エージェント**: tdd-guide

---

### ビルド・エラー修正

#### /build-fix
- **用途**: ビルドエラーをファイルごとにグループ化し、依存関係順に1件ずつ段階的に修正
- **関連エージェント**: build-error-resolver
- **対応**: npm/pnpm、TypeScript、Cargo、Maven、Gradle、Go、Python

#### /go-build
- **用途**: Goビルドエラーの段階的修正。`go build`、`go vet`、`staticcheck`を実行し最小変更で修正
- **関連エージェント**: go-build-resolver
- **使用タイミング**: `go build ./...` 失敗時、モジュール依存関係の破損時

#### /gradle-build
- **用途**: Android/KMPプロジェクトのGradleビルドエラーを段階的修正
- **対応**: KMP（`compileKotlinMetadata`）、Android（`compileDebugKotlin`）、Detekt

#### /kotlin-build
- **用途**: KotlinビルドエラーとDetekt違反の段階的修正
- **関連エージェント**: kotlin-build-resolver
- **実行内容**: `./gradlew build`、`detekt`、`ktlintCheck`

---

### マルチモデル協調

#### /multi-workflow [task-description]
- **用途**: Research → Ideation → Plan → Execute → Optimize → Reviewの6フェーズ協調ワークフロー
- **モデル役割**: Codex（バックエンド権威）、Gemini（フロントエンド専門）、Claude（オーケストレーション）

#### /multi-plan [task-description]
- **用途**: Codex + Geminiの並列分析による実装計画立案。プロダクションコードは変更しない
- **注意**: 計画のみ。実装前にユーザーが "Y" を返信してから `/multi-execute` を実行

#### /multi-execute [task-description]
- **用途**: 計画を元にCodex/Geminiからプロトタイプ取得 → Claudeがリファクタしてプロダクション品質に仕上げる
- **前提条件**: `/multi-plan` の出力にユーザーが "Y" 返信済み

#### /multi-backend [task-description]
- **用途**: バックエンド特化型マルチモデル協調（APIデザイン、アルゴリズム、DB最適化）
- **モデル役割**: Codex（バックエンド権威）、Gemini（参考のみ）、Claude（実行）

#### /multi-frontend [task-description]
- **用途**: フロントエンド特化型マルチモデル協調（コンポーネント設計、レスポンシブレイアウト、アニメーション）
- **モデル役割**: Gemini（フロントエンド権威）、Codex（参考のみ）、Claude（実行）

---

### リファクタリング・保守

#### /refactor-clean
- **用途**: デッドコードを安全に特定・削除。各削除後にテスト検証を実施
- **関連エージェント**: refactor-cleaner
- **対応ツール**: knip、depcheck、ts-prune（JS/TS）、vulture（Python）、deadcode（Go）

#### /update-codemaps
- **用途**: コードベース構造を解析しトークン効率的なアーキテクチャドキュメントを生成・更新
- **生成ファイル**: architecture.md、backend.md、frontend.md、data.md、dependencies.md

#### /update-docs
- **用途**: ソースファイル（package.json、.env.example、openapi.yaml等）からドキュメントを自動同期
- **関連エージェント**: doc-updater

---

### セッション管理

#### /save-session
- **用途**: 現在のセッション状態（構築内容・決定事項・残作業）を日付付きファイルに保存
- **保存先**: `~/.claude/sessions/`
- **使用タイミング**: 作業終了前、コンテキスト上限到達前、複雑な問題解決後

#### /resume-session [date|filepath]
- **用途**: 保存済みセッションファイルを読み込んで前回の作業コンテキストを完全復元
- **使用例**: `/resume-session`（最新）、`/resume-session 2024-01-15`（日付指定）

#### /sessions [list|load|alias|info]
- **用途**: セッション履歴の一覧表示、読込、エイリアス管理、スワーム向けオペレーターコンテキスト取得

#### /wrap-up [--full]
- **用途**: セッション終了時の学習・記録を最適順序で一括実行。Phase 2（記録）→ Phase 3（学習）→ Phase 4（保存）。`--full` で Phase 1（レビュー）も含む
- **ステップ**: /code-review → /codex → /revise-claude-md → /claude-md-improver → /session-report → instinct抽出 → /evolve → /learn-eval → /save-session
- **進捗トラッカー**: 各ステップに `[x]`/`[~]`/`[!]` マーク付き進捗チェックリストを表示
- **使用タイミング**: セッション終了前、コンテキスト上限到達前

#### /checkpoint [create|verify|list] [name]
- **用途**: ワークフローチェックポイントの作成・検証。`/verify quick` 実行後にgitコミット/スタッシュを記録

---

### 学習・進化

#### /learn
- **用途**: セッションからエラー解決パターン、デバッグテクニック、ワークアラウンドを抽出してスキルファイル化

#### /learn-eval
- **用途**: `/learn` の拡張版。品質ゲート付きで保存場所（Global vs Project）を判断してからスキルを保存

#### /skill-create [--commits N] [--output dir] [--instincts]
- **用途**: gitヒストリを解析してチームのコーディングパターンからSKILL.mdファイルを自動生成

#### /revise-claude-md
- **用途**: セッションの学びをCLAUDE.mdに反映。チーム共有（`CLAUDE.md`）とローカル専用（`.claude.local.md`）を使い分け

#### /eval [define|check|report|list] [feature-name]
- **用途**: Eval駆動開発ワークフロー管理。機能Evalの定義・チェック・レポート生成

#### /evolve [--generate]
- **用途**: インスティンクトを分析してクラスタリングし、Command・Skill・Agentへ上位構造化

#### /instinct-status
- **用途**: 現プロジェクト + グローバルのインスティンクト一覧をドメイン別・信頼度付きで表示

#### /instinct-export [--domain D] [--min-confidence N] [--output file]
- **用途**: インスティンクトを共有可能なYAMLファイルにエクスポート

#### /instinct-import [file-or-url] [--dry-run] [--force] [--scope project|global]
- **用途**: ローカルファイルまたはHTTP URLからインスティンクトをインポート

#### /promote [instinct-id] [--dry-run] [--force]
- **用途**: プロジェクトスコープのインスティンクトをグローバルスコープに昇格

---

### ユーティリティ

#### /model-route [task-description] [--budget low|med|high]
- **用途**: タスクの複雑さとコストに基づき最適モデルティアを推薦
- **ルーティング**: haiku（機械的変更）→ sonnet（実装・リファクタ）→ opus（設計・曖昧要件）

#### /prompt-optimize [prompt-text]
- **用途**: 入力プロンプトをECC最大活用のため6フェーズ分析・最適化（実行はしない、最適化済みプロンプトを出力）
- **フェーズ**: プロジェクト検出→意図分類→スコープ評価→ECCコンポーネントマッチング→不足コンテキスト検出→ワークフロー・モデル推薦

#### /harness-audit [scope] [--format text|json]
- **用途**: リポジトリのエージェントハーネス設定を7カテゴリで監査・スコアカード出力（最高70点）
- **評価項目**: ツールカバレッジ、コンテキスト効率、品質ゲート、メモリ永続性、Evalカバレッジ、セキュリティガードレール、コスト効率

#### /env-doctor [scope] [--fix] [--update-baseline]
- **用途**: ~/.claude/ 環境の運用健全性を29チェック（6カテゴリ）で診断。Hook Health・Cross-References・Config Drift・State Files・Workflow Integrity・Regression
- **関連エージェント**: env-doctor
- **スコープ**: `all`（デフォルト）、`hooks`、`crossref`、`config`、`state`、`workflow`、`regression`
- **補完関係**: `/harness-audit`（設定品質スコア）と併用で完全カバレッジ

#### /retro [--period session|day|week]
- **用途**: Git定量メトリクス（コミット数・変更行数・ファイル数・言語分布）ベースのエンジニアリング振り返り
- **使用タイミング**: セッション終了時・日次/週次の振り返り

#### /office-hours [topic]
- **用途**: YC式アイデア壁打ち・要件リフレーミング・デザインドキュメント生成。/plan や /prd の前段階で使用
- **使用タイミング**: 「アイデアがある」「これ作る価値ある？」「ブレスト」

#### /qa [quick|standard|exhaustive]
- **用途**: Webアプリの体系的QAテスト＋バグ修正ループ。3段階の深度で実施
- **使用タイミング**: フィーチャー実装完了後、「QAして」「テストして」「バグ探して」

#### /codex [review|challenge|consult]
- **用途**: OpenAI Codex CLIで独立したセカンドオピニオンを取得。3モード対応
- **制約**: o3モデルはChatGPTアカウントで非対応。read-only sandbox で npm/tsc 実行不可

#### /autoresearch [goal]
- **用途**: Karpathy式自律改善ループ。修正→検証→保持/破棄→繰り返し。計測可能な指標があるタスクに適用
- **サブコマンド**: plan、fix、debug、security、predict、scenario、ship

#### /aside [question]
- **用途**: 作業コンテキストを維持したまま、タスク中断なしでサイドクエスチョンに即答

#### /setup-pm
- **用途**: パッケージマネージャ（npm/pnpm/yarn/bun）の検出・設定。環境変数・プロジェクト・グローバルの3レベルで管理

#### /pm2 [arguments]
- **用途**: プロジェクトを自動解析してPM2サービスコマンドを生成（Vite、Next.js、Express、FastAPI、Goなど対応）

#### /claw
- **用途**: NanoClaw v2の起動。モデルルーティング・スキルホットロード・分岐・コンパクション・エクスポート・メトリクス付き対話型AIエージェントREPL

---

### 品質管理

#### /verify
- **用途**: ビルド→型チェック→Lint→テスト→console.log監査→Git状態の順で総合検証を実行

#### /quality-gate [path|.] [--fix] [--strict]
- **用途**: 言語・ツーリングを自動検出し、フォーマッタ・Lint・型チェックを実行して修正リストを生成
- **オプション**: `--fix`（自動修正許可）、`--strict`（警告でも失敗扱い）

---

### ループ操作

#### /loop-start [pattern] [--mode safe|fast]
- **用途**: 安全デフォルト付きの自律ループパターンを開始
- **パターン**: `sequential`、`continuous-pr`、`rfc-dag`、`infinite`
- **モード**: `safe`（デフォルト、厳格な品質ゲート）、`fast`（速度優先、ゲート縮小）

#### /loop-status [--watch]
- **用途**: アクティブループの現在フェーズ・最終チェックポイント・失敗シグナル・推奨介入（続行/一時停止/停止）を表示

---

### プロジェクト管理

#### /projects
- **用途**: continuous-learning-v2のプロジェクトレジストリ一覧とプロジェクトごとのインスティンクト・観察数統計を表示

---

### DDD実装（product-starter）

#### /ps-init
- **用途**: プロジェクト初期セットアップ。Homebrew→Node→pnpm→Docker→Supabase→DB構築→dev server起動までを一気通貫で実行
- **使用タイミング**: 新規DDD(Next.js+Prisma+Supabase)プロジェクト立ち上げ時

#### /ps-plan [設計内容の説明]
- **用途**: DDD準拠の設計ドキュメント作成。ドメインモデル・ユースケース・レイヤー構成を `docs/tasks/` に保存
- **使用タイミング**: 機能実装前の設計フェーズ

#### /ps-pr [追加の指示]
- **用途**: フィーチャーブランチ作成→`pnpm verify`による品質チェック→`gh pr create`でPR作成
- **使用タイミング**: 機能実装完了後のPR提出

---

## 関連リソース

- **エージェント**: `~/.claude/agents/` — planner, architect, tdd-guide, code-reviewer, security-reviewer, env-doctor, frontend-engineer, backend-engineer 等24種
- **スキル**: `~/.claude/skills/` — deep-research, env-doctor, security, coding-standards 等70種 + learned/ 10種
- **ルール**: `~/.claude/rules/` — TypeScript, Python, Go, Kotlin, Swift, PHP 共通ルール
