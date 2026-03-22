# docs/ — 自律型エージェント組織インデックス

このディレクトリには自律型エージェント組織の参照ドキュメントが含まれる。

## ファイル一覧

| ファイル | 用途 |
|---------|-----|
| `agents-index.md` | 全24エージェントの詳細カタログ |
| `commands-index.md` | 全スラッシュコマンドの詳細カタログ |
| `skills-index.md` | 全スキルのトリガー条件・詳細カタログ |
| `routing-guide.md` | タスク種別判定 → リソース選択のデシジョンツリー |
| `org-structure.md` | エージェント階層・ハンドオフルール・エスカレーションパス |
| `ecc-resources.md` | ECC v1.8.0 リソース詳細（CLAUDE.md からインポート） |
| `product-starter.md` | product-starter DDD実装支援ツール詳細（CLAUDE.md からインポート） |
| `tools-extensions.md` | デザインパイプライン・gstack・新コマンド・Codex詳細（CLAUDE.md からインポート） |

## 参照タイミング

- タスク受信時 → `routing-guide.md`
- エージェント選択時 → `agents-index.md`
- コマンド選択時 → `commands-index.md`
- スキル選択時 → `skills-index.md`
- エージェント間連携時 → `org-structure.md`
