# ツール拡張・統合情報

## デザインスキルパイプライン（2026-03-19 確立）

UI/フロントエンド開発時は以下の3層を順に使う:
1. `ui-ux-pro-max` — 業種別の最適スタイル・カラー・フォント決定（意思決定層）
2. `vibe-design` — ワイヤーフレーム→プロトタイプ→仕様書→QA（プロトタイプ層）
3. `ps-design-ui` — shadcn/ui + Tailwind で本番実装（実装層）

## gstack MERGE（2026-03-19 適用済み）

以下のエージェントに gstack のフレームワークを統合済み:
- `code-reviewer`: Scope Drift Detection + Fix-First Heuristic + LLM Trust Boundary
- `planner`: 4モードScope管理 + Failure Mode Analysis
- `build-error-resolver`: Iron Law（根本原因必須）+ 3-Strike Rule（3回失敗で方針転換）
- `doc-updater`: Cross-doc Consistency Check + CHANGELOG Protection
- `e2e-runner`: Bug→Fix→Regression Loop + Health Score

## 新コマンド・スキル（2026-03-19 追加）

| 種別 | 名前 | 用途 |
|------|------|------|
| コマンド | `/retro` | Git定量メトリクスベースの振り返り（/revise-claude-md の定量版） |
| コマンド | `/office-hours` | YC式アイデア壁打ち・デザインドキュメント生成（/prd の前段階） |
| コマンド | `/qa` | Web QA テスト + バグ修正ループ（Quick/Standard/Exhaustive 3段階） |
| コマンド | `/codex` | OpenAI Codex CLI セカンドオピニオン（Review/Challenge/Consult） |
| コマンド | `/autoresearch` | Karpathy式自律改善ループ（+7サブコマンド） |
| スキル | `ui-ux-pro-max` | 161業種別ルール・67UIスタイル・BM25検索エンジン |
| スキル | `vibe-design` | デザインプロトタイプワークフロー（Sota Mikami） |
| ルール | `ban-patterns.md` | コード/UI/ドキュメント/ファイル操作の禁止パターン |

## Claude Code 新機能（2026-03-21 収集）

| 機能 | 発表者 | 内容 |
|------|--------|------|
| **Claude Code Channels** | @trq212 | Telegram/Discord MCP でスマホから CC セッションを操作 |
| **Dispatch (Cowork)** | @felixrieseberg | PC 上の永続 CC セッションをスマホから操作（ファイルはローカル） |
| **Projects in Cowork** | @felixrieseberg / @claudeai | タスク・コンテキストをプロジェクト単位で管理、共有フォルダ＆接続設定 |
| **/btw コマンド** | @ErikSchluntz | Claude 作業中に割り込まずサイドクエスチョンを送れる（`/aside` の公式版） |
| **CC ショートカット** | @_catwu | `!` bash inline / `ctrl+s` draft stash / `ctrl+g` $EDITOR でプロンプト編集 |
| **カスタム環境** | @_catwu | claude.ai/code、Desktop、Mobile からリモート実行時のカスタム環境サポート |
| **API改善** | @alexalbert__ | 長大コンテキスト追加料金廃止・beta ヘッダー不要・600画像/req |

## Codex CLI セカンドオピニオン（2026-03-19 確立）

- `o3` モデルは ChatGPT アカウントで非対応 — デフォルトモデル or API キー設定が必要
- Codex は read-only sandbox で `npm`/`tsc`/`lint` 実行がブロックされる — ソースレビューのみ
- Claude 検証（設計準拠性）と Codex（セキュリティ/エッジケース）は相補的 — 一致率 69-78%（2026-03-20 包括レビューで計測）
- コード修正後は `/codex` Challenge モードでセカンドオピニオン取得を推奨（DoS表面・エッジケース検出に有効）
- Codex の Critical 指摘は高信頼 — フェイルオープン、非アトミック操作、暗号化漏れなど
