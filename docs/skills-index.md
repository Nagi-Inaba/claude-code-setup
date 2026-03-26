# Skills Index
> 全スキルの概要カタログ。Skill toolで呼び出す。

## スキルソース

| ソース | パス | スキル数 |
|-------|-----|---------|
| ECC Skills | `~/.claude/skills/` | 80個（+ learned/ 配下に10個の学習済みスキル） |
| OneDrive Skills | `~/OneDrive/claudecodeskills/` | 38個 |

> OneDriveスキルの一部（algorithmic-art, brand-guidelines, canvas-design等）はECCにも同名スキルが存在する。ECC版が優先される。

---

## 自動トリガー一覧

スキルは条件が揃うと自動発動する:

| スキル | 自動発動条件 |
|-------|------------|
| `anti-human-bottleneck` | 確認しようとした瞬間・承認待ちになりそうな時 |
| `claude-md-improver` | CLAUDE.md を作成/編集した後（必須）※プラグイン: `claude-md-management` |
| `deep-research` | 「調査」「リサーチ」「比較検討」「competitive analysis」キーワード |
| `security-review` | 認証・ユーザー入力・シークレット・APIエンドポイント実装時 |
| `security-scan` | `.claude/` ディレクトリのセキュリティ問題が懸念される時 |
| `tdd-workflow` | 新機能追加・バグ修正・リファクタリング時 |
| `verification-loop` | リリース前・PR前の包括的検証が必要な時 |
| `pdf` | `.pdf`ファイル操作・テキスト抽出・OCR要求時 |
| `docx` | Word文書・`.docx`・報告書・メモ・テンプレート作成時 |
| `pptx` | スライド・プレゼン・デッキ・`.pptx`操作時 |
| `pricing-strategy` | 価格設定・パッケージング・マネタイズ戦略の設計時 |
| `launch-strategy` | プロダクトローンチ・機能リリースの計画時 |
| `free-tool-strategy` | 無料ツール・Engineering-as-marketingの企画時 |
| `seo-fundamentals` | SEO基礎・技術SEO・E-E-A-T対応時 |
| `seo-content-planner` | コンテンツ戦略・トピッククラスター計画時 |
| `top-web-vulnerabilities` | Webアプリの脆弱性テスト・セキュリティ監査時 |
| `cold-email` | B2Bアウトバウンド・コールドメール作成時 |
| `email-sequence` | メールシーケンス・ライフサイクルメール設計時 |
| `lead-magnets` | リードマグネット・ゲーテッドコンテンツ設計時 |
| `kaizen` | コード品質改善・プロセス改善・リファクタリング時 |
| `xlsx` | `.xlsx`・スプレッドシート・Excel・CSV操作時 |
| `frontend-design` | Webコンポーネント・ランディングページ・React UI作成時 |
| `canvas-design` | ポスター・ビジュアルアート・デザイン作成時 |
| `algorithmic-art` | ジェネレイティブアート・p5.js・フローフィールド要求時 |
| `prd` | PRD作成・機能計画・スペック作成時（着手前必須） |
| `ralph` | PRDをprd.json形式に変換する時 |
| `vercel-deploy-claimable` | Vercelへのデプロイ要求時 |
| `mcp-builder` | MCPサーバー構築・外部API統合時 |
| `webapp-testing` | Playwright・ブラウザ自動化・UIテスト時 |
| `content-engine` | SNS投稿・スレッド・コンテンツカレンダー作成時 |
| `crosspost` | X/LinkedIn/Threads/Blueskyへのマルチプラットフォーム配信時 |
| `fal-ai-media` | AI画像・動画・音声生成時 |
| `env-doctor` | SessionStart 時に軽量5チェック自動実行。ECC 更新後・フック異常時 |
| `session-report` | 「作業記録」「セッションレポート」「やったことまとめ」「今日の作業まとめ」 |
| `ui-ux-pro-max` | UI/フロントエンド開発時のスタイル・カラー・フォント決定 |
| `vibe-design` | ワイヤーフレーム→プロトタイプ→仕様書→QA のデザインフロー |

---

## カテゴリ別スキル一覧

### 自律実行・システム管理

| スキル | ソース | 概要 |
|-------|-------|------|
| `anti-human-bottleneck` | OneDrive | AIが人間に確認を求めずに自律判断・実行。「聞くな、やれ」の原則。物理的に不可能な操作以外は自分で判断して進める |
| `shell` | OneDrive | `/shell <コマンド>` の後のテキストをそのままシェルコマンドとして即座に実行 |
| `update-cursor-settings` | OneDrive | Cursor/VSCodeのsettings.jsonを変更（テーマ・フォント・キーバインド等） |
| `strategic-compact` | ECC | 論理的な区切りで手動コンテキスト圧縮を提案し、任意の自動圧縮より文脈を保護 |
| `continuous-learning` | ECC | Claude Codeセッションから再利用可能なパターンを抽出してスキルとして保存 |
| `continuous-learning-v2` | ECC | v2.1: フック経由のセッション観察・Atomic Instinct作成・信頼スコア付き進化。プロジェクトスコープ汚染防止付き |
| `iterative-retrieval` | ECC | サブエージェントのコンテキスト問題を解決するための段階的コンテキスト取得パターン |
| `env-doctor` | custom | 環境ワークフロー診断。29チェック（6カテゴリ）でフック健全性・設定ドリフト・相互参照整合性を検証 |
| `session-report` | custom | プロジェクト作業記録を `.company/subsidiaries/` 配下に保存。git diff と会話履歴から自動構成。/save-session（Claude復帰用）とは別の人間向け作業ログ |

---

### 開発パターン（バックエンド・フロントエンド）

| スキル | ソース | 概要 |
|-------|-------|------|
| `backend-patterns` | ECC | Node.js/Express/Next.js APIルートのバックエンドアーキテクチャ・API設計・DB最適化 |
| `frontend-patterns` | ECC | React/Next.js の状態管理・パフォーマンス最適化・UIベストプラクティス |
| `coding-standards` | ECC | TypeScript/JavaScript/React/Node.js の汎用コーディング規約・ベストプラクティス |
| `python-patterns` | ECC | Pythonicイディオム・PEP 8・型ヒント・堅牢なPythonアプリ構築のベストプラクティス |
| `golang-patterns` | ECC | 慣用的なGoパターン・ベストプラクティス・堅牢なGoアプリ構築の規約 |
| `java-coding-standards` | ECC | Spring Bootサービス向けJavaコーディング規約（命名・不変性・Optional・Stream・例外・ジェネリクス） |
| `django-patterns` | ECC | DjangoアーキテクチャパターンとDRF REST API設計・ORM・キャッシュ・シグナル・ミドルウェア |
| `springboot-patterns` | ECC | Spring Boot REST API設計・レイヤードサービス・データアクセス・キャッシュ・非同期処理 |
| `jpa-patterns` | ECC | JPA/Hibernateエンティティ設計・リレーション・クエリ最適化・トランザクション・インデックス |
| `postgres-patterns` | ECC | PostgreSQLクエリ最適化・スキーマ設計・インデックス・セキュリティ（Supabaseベストプラクティス） |
| `clickhouse-io` | ECC | ClickHouseのパターン・クエリ最適化・アナリティクス・高パフォーマンス分析ワークロード |
| `vercel-react-best-practices` | OneDrive | Vercel Engineering製57のパフォーマンス最適化ルール。ウォーターフォール排除・バンドルサイズ最適化 |
| `vercel-composition-patterns` | OneDrive | スケーラブルなReactコンポジションパターン（コンパウンドコンポーネント・React 19 API対応） |
| `vercel-react-native-skills` | OneDrive | React Native/Expoのベストプラクティス（リスト最適化・アニメーション・ナビゲーション・Reanimated） |
| `dmux-workflows` | ECC | dmux（tmuxペインマネージャー）を使ったマルチエージェント並列ワークフローパターン |

---

### テスト・品質・検証

| スキル | ソース | 概要 |
|-------|-------|------|
| `tdd-workflow` | ECC | 新機能・バグ修正・リファクタリング向けTDD。80%以上のカバレッジ（ユニット・統合・E2E） |
| `webapp-testing` | ECC/OneDrive | Playwrightを使ったローカルWebアプリテスト（DOM検査・スクリーンショット・ブラウザログ） |
| `python-testing` | ECC | pytestによるPythonテスト戦略・TDD・フィクスチャ・モック・パラメータ化・カバレッジ |
| `golang-testing` | ECC | テーブル駆動テスト・サブテスト・ベンチマーク・ファジング・カバレッジ（慣用的Goパターン） |
| `django-tdd` | ECC | pytest-djangoによるDjangoテスト・factory_boy・モック・DRF APIテスト |
| `springboot-tdd` | ECC | JUnit 5/Mockito/MockMvc/Testcontainers/JaCoCoを使ったSpring Boot TDD |
| `django-verification` | ECC | Djangoプロジェクトの検証ループ（マイグレーション・リント・テスト・セキュリティスキャン・デプロイ準備） |
| `springboot-verification` | ECC | Spring Bootの検証ループ（ビルド・静的解析・テスト・セキュリティスキャン・差分レビュー） |
| `verification-loop` | ECC | Claude Codeセッションの包括的検証システム |
| `autoresearch` | custom | Karpathy式自律改善ループ。modify→verify→keep/discard を繰り返す。7サブコマンド(fix/debug/security/predict/scenario/ship/plan)付属 |
| `eval-harness` | ECC | eval駆動開発（EDD）原則を実装するClaude Codeセッション用フォーマル評価フレームワーク |

---

### セキュリティ

| スキル | ソース | 概要 |
|-------|-------|------|
| `security-review` | ECC | 認証・ユーザー入力・シークレット・APIエンドポイント・決済機能実装時の包括的セキュリティチェック |
| `security-scan` | ECC | AgentShieldによる`.claude/`ディレクトリのセキュリティ脆弱性・設定ミス・インジェクションリスクスキャン |
| `top-web-vulnerabilities` | Antigravity | Web脆弱性100種（15カテゴリ、OWASP Top 10対応）。攻撃者視点の脆弱性リファレンス |
| `django-security` | ECC | Django認証・認可・CSRF保護・SQLインジェクション防止・XSS防止・安全なデプロイ設定 |
| `springboot-security` | ECC | Spring Security認証/認可・バリデーション・CSRF・シークレット・ヘッダー・レートリミット |

---

### ドキュメント・ファイル操作

| スキル | ソース | 概要 |
|-------|-------|------|
| `pdf` | ECC/OneDrive | PDF結合・分割・回転・透かし・テキスト/テーブル抽出・フォーム記入・OCR・暗号化/復号 |
| `docx` | ECC/OneDrive | Word文書の作成・読取・編集。目次・ヘッダー/フッター・画像挿入・差し込み・変更履歴・テーブル |
| `pptx` | ECC/OneDrive | PowerPoint作成・編集・読取。テンプレート・スライドデザイン・カラーパレット・画像変換 |
| `xlsx` | ECC/OneDrive | Excelファイルの作成・編集・分析。数式・財務モデリング・色分け・データ可視化 |
| `doc-coauthoring` | ECC/OneDrive | コンテキスト収集→ブレスト→反復改善→読者テストの流れで構造化ドキュメントを共同執筆 |
| `article-writing` | ECC | ブログ記事・ガイド・チュートリアル・ニュースレター等の長文コンテンツをブランドボイスで執筆 |
| `investor-materials` | ECC | ピッチデッキ・ワンページャー・投資家メモ・財務モデル等の投資家向け資料作成 |
| `investor-outreach` | ECC | エンジェル・VC・戦略的投資家向けコールドメール・フォローアップ・投資家アップデートメール |

---

### AI・API・エージェント構築

| スキル | ソース | 概要 |
|-------|-------|------|
| `claude-api` | ECC/OneDrive | Claude API/Anthropic SDK（Messages API・ストリーミング・ツール使用・バッチ・Agent SDK）パターン |
| `mcp-builder` | ECC/OneDrive | Python(FastMCP)またはTypeScript(MCP SDK)でのMCPサーバー開発ガイド |
| `exa-search` | ECC | Exa MCP経由のニューラル検索（Web・コード・企業・人物調査） |
| `fal-ai-media` | ECC | fal.ai MCP経由の統合メディア生成（画像・動画・音声。Seedance/Kling/Veo 3/CSM-1B対応） |
| `videodb` | ECC | 動画・音声の取り込み・インデックス化・検索・編集・字幕・吹き替え・ライブアラート |
| `x-api` | ECC | X/Twitter API統合（ツイート投稿・スレッド・タイムライン・検索・分析。OAuth・レート制限対応） |

---

### スキル・ルール・エージェント管理

| スキル | ソース | 概要 |
|-------|-------|------|
| `skill-creator` | ECC/OneDrive | スキルの新規作成・編集・最適化・テスト・ベンチマーク・トリガー精度向上 |
| `create-skill` | OneDrive | Cursor向けAgent Skills（SKILL.md形式）の作成ガイド |
| `create-subagent` | OneDrive | カスタムサブエージェント作成（システムプロンプト定義・配置・ワークフロー設定） |
| `create-rule` | OneDrive | Cursor向け永続的AIガイダンスルール作成（YAMLフロントマター・ファイル固有ルール） |
| `migrate-to-skills` | OneDrive | Cursorの`.mdc`ルールやスラッシュコマンドをAgent Skills（SKILL.md）形式に一括変換 |

---

### リサーチ・学習

| スキル | ソース | 概要 |
|-------|-------|------|
| `deep-research` | ECC | firecrawl・exa MCP使用のマルチソース深掘り調査。出典付きレポートを生成 |
| `market-research` | ECC | 市場調査・競合分析・投資家デューデリジェンス・業界情報収集と意思決定サマリー |

---

### ビジネス・プロジェクト管理

| スキル | ソース | 概要 |
|-------|-------|------|
| `prd` | OneDrive | PRD（製品要件定義書）生成。要件ヒアリング→ユーザーストーリー→受入基準→構造化文書 |
| `ralph` | OneDrive | PRDマークダウンをprd.json形式に変換しRalph自律エージェントループで実行可能化 |
| `dev-workflow` | OneDrive | Webプロジェクトの要件定義・設計書・タスクチケット・実装トラッキング管理 |
| `internal-comms` | ECC/OneDrive | 社内コミュニケーション文書（3Pアップデート・ニュースレター・FAQ・インシデントレポート） |
| `company` | OneDrive | 仮想会社組織の構築・運営。秘書窓口→CEO判断→各部署への指示振り分け |
| `secretary` | OneDrive | パーソナル秘書 & ライフ・ワーク管理。オンボーディング→Markdownフォルダ階層の自動生成 |
| `idea-finder` | OneDrive | 収益性の高いアプリ/サービスアイデア発掘（対話式質問・トレンド分析・競合リサーチ） |
| `growth-advisor` | OneDrive | Supabase・Stripe・GA4・Search Console MCPでメトリクスを分析し収益成長戦略を提案 |
| `new-webapp` | OneDrive | インタラクティブなWebプロジェクトセットアップ（Next.js/React+Vite・Supabase・Stripe・認証選択） |
| `stripe-setup` | OneDrive | Stripe決済実装ガイド（サブスクリプション3段階・単発決済・Customer Portal・Webhook） |
| `pricing-strategy` | Antigravity | 価格設計（Van Westendorp・ティア設計・バリューメトリクス・フリーミアム戦略・値上げ戦略） |
| `launch-strategy` | Antigravity | SaaSローンチ戦略（ORBフレームワーク・5段階プロセス・Product Huntプレイブック） |
| `free-tool-strategy` | Antigravity | Engineering-as-marketing。無料ツールでリード獲得・SEO・ROI予測 |
| `lead-magnets` | Antigravity | リードマグネット設計・ゲーティング戦略・LP構成・プロモーション・KPI計測 |
| `cold-email` | Antigravity | B2Bコールドメール・パーソナライゼーション・フォローアップシーケンス |
| `email-sequence` | Antigravity | SaaSライフサイクルメール設計（オンボーディング・リテンション・ウィンバック・キャンペーン） |
| `kaizen` | Antigravity | 継続的改善・ポカヨケ・標準化・JIT（TypeScript例付き） |

---

### SEO

| スキル | ソース | 概要 |
|-------|-------|------|
| `seo-fundamentals` | Antigravity | E-E-A-T・Core Web Vitals・技術SEO基礎・コンテンツ品質シグナル・構造化データ |
| `seo-content-planner` | Antigravity | トピッククラスター計画・コンテンツカレンダー・検索意図マッピング |

---

### LP制作・ランディングページ

| スキル | ソース | 概要 |
|-------|-------|------|
| `lp-builder` | custom | toB LP生成（3md構造: design-system/lp-structure/content-template）。ui-ux-pro-max→vibe-design→ps-design-uiパイプライン連携 |

---

### 環境診断・改善

| スキル | ソース | 概要 |
|-------|-------|------|
| `cc-diagnosis` | custom | CC環境活用度を6軸100点でスコアリング。/env-doctor（健全性）・/harness-audit（設定品質）を補完する活用度レイヤー |

---

### デザイン・クリエイティブ

| スキル | ソース | 概要 |
|-------|-------|------|
| `frontend-design` | ECC/OneDrive | プロダクション品質のフロントエンドUI作成。AIっぽくない洗練されたデザインを生成 |
| `canvas-design` | ECC/OneDrive | PNG/PDFでの美しいビジュアルアート作成。デザイン哲学に基づいたミニマリストデザイン |
| `algorithmic-art` | ECC/OneDrive | p5.jsを使ったジェネレイティブアート（シード付きランダム性・インタラクティブパラメータ） |
| `brand-guidelines` | ECC/OneDrive | Anthropic公式ブランドカラーとタイポグラフィ（Poppins/Lora）の適用 |
| `theme-factory` | ECC/OneDrive | スライド・文書・レポート・ランディングページへのテーマ適用（10種プリセット or カスタム生成） |
| `web-design-guidelines` | OneDrive | WebインターフェースのUIレビュー（アクセシビリティ・UX・デザインベストプラクティス検証） |
| `slack-gif-creator` | ECC/OneDrive | Slack最適化アニメーションGIF作成（p5.js/PIL使用。shake/pulse/bounce/spin等） |
| `frontend-slides` | ECC | アニメーション豊富なHTMLプレゼンテーション作成・PPT→Web変換 |
| `web-artifacts-builder` | ECC/OneDrive | React 18+TypeScript+Vite/Parcelで複合HTMLアーティファクト構築（Tailwind・shadcn/ui） |

---

### コンテンツ・メディア

| スキル | ソース | 概要 |
|-------|-------|------|
| `content-engine` | ECC | X・LinkedIn・TikTok・YouTube・ニュースレター等のプラットフォームネイティブコンテンツ作成 |
| `crosspost` | ECC | X/LinkedIn/Threads/Blueskyへのマルチプラットフォームコンテンツ配信（プラットフォーム別最適化） |
| `video-editing` | ECC | FFmpeg/Remotion/ElevenLabs/fal.aiを使ったAI支援動画編集（カット・構成・音声・最終仕上げ） |

---

### DDD 実装支援（product-starter）

| スキル | ソース | 概要 |
|-------|-------|------|
| `ps-add-feature` | custom | DDD 4層に従って全レイヤーのファイルを一括生成（Next.js + Prisma + Supabase） |
| `ps-add-page` | custom | Next.js App Router ページ + Loader を生成（Server Component デフォルト） |
| `ps-db-table` | custom | Prisma スキーマ変更 + マイグレーション + Repository 生成 |
| `ps-add-api-integration` | custom | Gateway interface + 本番実装 + Stub 実装を3ファイルセットで生成 |
| `ps-design-ui` | custom | shadcn/ui + Tailwind でUI作成・修正（Server Component ファースト） |
| `ps-fix-error` | custom | エラー解析→DDD準拠修正→`pnpm verify` で検証 |

---

### デザイン・UI 意思決定

| スキル | ソース | 概要 |
|-------|-------|------|
| `ui-ux-pro-max` | ECC | 161業種別ルール・67UIスタイル・96パレット・57フォントペアリング・BM25検索エンジン |
| `vibe-design` | ECC | Sota Mikami式デザインプロトタイプワークフロー（ワイヤーフレーム→プロトタイプ→仕様書→QA） |

---

### デプロイ・インフラ

| スキル | ソース | 概要 |
|-------|-------|------|
| `vercel-deploy-claimable` | OneDrive | アプリをVercelにデプロイ。認証不要でプレビューURLとClaimableデプロイリンクを返す |

---

*最終更新: 2026-03-22 — ECC Skills 70個 + OneDrive Skills 38個（重複含む）*
