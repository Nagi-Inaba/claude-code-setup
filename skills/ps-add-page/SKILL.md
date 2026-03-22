---
description: "[product-starter] 新しいページを追加する。URL、表示内容、データソースを指定してページを作成する。Next.js App Router + DDD プロジェクト向け。"
---

# ページ追加スキル (product-starter)

ユーザーが「〇〇ページを作って」と指示したときに適用する。

## 生成するファイル

1. **ページ** (`src/app/{path}/page.tsx`)
   - Server Component として作成
   - loader 経由でデータを取得
   - `page.tsx` にロジックを書かない

2. **Loader** (`src/backend/presentation/loaders/{name}.loader.ts`)
   - composition から UseCase を取得してデータを返す
   - 必要に応じて複数データソースを `Promise.all` で並列取得

3. **必要に応じて UseCase / Repository 等も追加**
   - 既存の UseCase で対応できる場合は新規作成不要

## ルール

- デフォルトは Server Component。`'use client'` は必要な場合のみ
- データ取得は必ず loader 経由（page.tsx で直接 DB アクセスしない）
- UI は shadcn/ui + Tailwind CSS で構築
- フォームがある場合は Server Action（`backend/presentation/actions/`）を使用

## Gotchas

<!-- Claudeがこのスキル実行時によく間違えるパターンを蓄積する -->
<!-- 実行時に失敗したら具体例を追記すること -->
- （実運用で問題が発生したら追記）
