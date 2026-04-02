---
name: screenshot-guide-pdf
description: Create step-by-step guide PDFs with embedded screenshots and Japanese explanatory text using reportlab. Use when the user wants to make a tutorial, how-to guide, or manual PDF from screenshots.
---

# Screenshot Guide PDF

スクリーンショット付きの手順書PDFを reportlab で生成するスキル。

## 前提条件

```bash
pip install reportlab pillow
```

## ワークフロー

1. **画像確認**: 対象ディレクトリのスクリーンショットを Read ツールで確認し、手順の流れを把握
2. **構成設計**: ユーザーと各ステップの見出し・説明文を決定
3. **スクリプト生成**: 下記テンプレートをベースに Python スクリプトを作成
4. **実行・検証**: スクリプトを実行し、pypdf でページ数・テキスト抽出して検証

## テンプレート構造

生成する Python スクリプトは以下の構成を使う。

### 基本セットアップ

```python
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image

# --- フォント登録（Windows 日本語） ---
FONT_PATH = "C:/Windows/Fonts/meiryo.ttc"
FONT_BOLD_PATH = "C:/Windows/Fonts/meiryob.ttc"
pdfmetrics.registerFont(TTFont("Meiryo", FONT_PATH, subfontIndex=0))
pdfmetrics.registerFont(TTFont("MeiryoBold", FONT_BOLD_PATH, subfontIndex=0))

PAGE_W, PAGE_H = A4
MARGIN = 20 * mm
CONTENT_W = PAGE_W - 2 * MARGIN
```

### カラーパレット（テーマに合わせて変更可）

```python
COLOR_TITLE   = HexColor("#1a73e8")  # メインカラー
COLOR_HEADING = HexColor("#202124")
COLOR_BODY    = HexColor("#3c4043")
COLOR_STEP_BG = HexColor("#e8f0fe")  # ステップボックス背景
COLOR_NOTE_BG = HexColor("#fef7e0")  # 注意ボックス背景
COLOR_NOTE_BORDER = HexColor("#f9ab00")
```

### 再利用可能なヘルパー関数

```python
def draw_step_badge(c, x, y, step_num):
    """ステップ番号の丸バッジ"""
    r = 14
    c.setFillColor(COLOR_TITLE)
    c.circle(x + r, y - r, r, fill=1, stroke=0)
    c.setFillColor(HexColor("#ffffff"))
    c.setFont("MeiryoBold", 14)
    c.drawCentredString(x + r, y - r - 5, str(step_num))

def draw_note_box(c, x, y, width, lines):
    """左アクセント付き注意ボックス。描画した高さを返す"""
    line_h = 18
    padding = 10
    box_h = len(lines) * line_h + padding * 2
    c.setFillColor(COLOR_NOTE_BG)
    c.roundRect(x, y - box_h, width, box_h, 6, fill=1, stroke=0)
    c.setFillColor(COLOR_NOTE_BORDER)
    c.rect(x, y - box_h, 4, box_h, fill=1, stroke=0)
    c.setFillColor(COLOR_BODY)
    c.setFont("Meiryo", 10)
    for i, line in enumerate(lines):
        c.drawString(x + 14, y - padding - 13 - i * line_h, line)
    return box_h

def draw_image_centered(c, img_path, y_top, max_w, max_h):
    """画像を中央揃えで配置。描画した高さを返す"""
    img = Image.open(img_path)
    iw, ih = img.size
    scale = min(max_w / iw, max_h / ih)
    draw_w, draw_h = iw * scale, ih * scale
    x = MARGIN + (CONTENT_W - draw_w) / 2
    c.drawImage(ImageReader(img_path), x, y_top - draw_h, draw_w, draw_h,
                preserveAspectRatio=True, mask="auto")
    c.setStrokeColor(HexColor("#dadce0"))
    c.setLineWidth(0.5)
    c.rect(x, y_top - draw_h, draw_w, draw_h, fill=0, stroke=1)
    return draw_h

def draw_step_box(c, x, y, width, lines):
    """手順リストの背景ボックス。描画した高さを返す"""
    line_h = 22
    padding = 10
    box_h = len(lines) * line_h + padding * 2
    c.setFillColor(COLOR_STEP_BG)
    c.roundRect(x, y - box_h, width, box_h, 8, fill=1, stroke=0)
    c.setFillColor(COLOR_BODY)
    c.setFont("Meiryo", 10.5)
    for i, line in enumerate(lines):
        c.drawString(x + 14, y - padding - 6 - i * line_h, line)
    return box_h
```

### ページ構成パターン

```python
def build_pdf():
    c = canvas.Canvas(OUTPUT_PDF, pagesize=A4)
    c.setTitle("ドキュメントタイトル")
    y = PAGE_H - MARGIN

    # --- タイトル ---
    c.setFillColor(COLOR_TITLE)
    c.setFont("MeiryoBold", 22)
    c.drawString(MARGIN, y - 24, "タイトルテキスト")
    y -= 40

    # --- サブタイトル ---
    c.setFillColor(COLOR_BODY)
    c.setFont("Meiryo", 11)
    c.drawString(MARGIN, y - 12, "概要の説明テキスト")
    y -= 36

    # --- 区切り線 ---
    c.setStrokeColor(HexColor("#dadce0"))
    c.setLineWidth(1)
    c.line(MARGIN, y, PAGE_W - MARGIN, y)
    y -= 24

    # --- Step N ---
    draw_step_badge(c, MARGIN, y, N)
    c.setFillColor(COLOR_HEADING)
    c.setFont("MeiryoBold", 15)
    c.drawString(MARGIN + 36, y - 18, "ステップ見出し")
    y -= 44

    c.setFillColor(COLOR_BODY)
    c.setFont("Meiryo", 11)
    c.drawString(MARGIN + 8, y - 4, "説明テキスト")
    y -= 28

    img_h = draw_image_centered(c, IMG_PATH, y, CONTENT_W, 220)
    y -= img_h + 20

    # --- 改ページ ---
    c.showPage()
    y = PAGE_H - MARGIN

    c.save()
```

## レイアウト設計のコツ

- **y座標管理**: 各要素の描画後に `y -= 要素の高さ + 余白` で位置を更新。`y < MARGIN + 100` 付近で改ページ
- **画像の max_h**: 横長スクリーンショットは 150-200、縦長は 250-350 程度
- **1ページ1-2ステップ**: 詰め込みすぎず読みやすく
- **テキスト行送り**: 本文 18pt、ボックス内 22pt が目安

## テーマカラー例

| 用途 | Gmail | Slack | 汎用 |
|------|-------|-------|------|
| TITLE | `#1a73e8` | `#611f69` | `#2563eb` |
| STEP_BG | `#e8f0fe` | `#f4ede4` | `#eff6ff` |
| NOTE_BORDER | `#f9ab00` | `#e8912d` | `#f59e0b` |

## 検証手順

生成後は pypdf で最低限の確認を行う:

```python
from pypdf import PdfReader
r = PdfReader("output.pdf")
print(f"Pages: {len(r.pages)}")
for i, p in enumerate(r.pages):
    print(f"Page {i+1}: {len(p.extract_text())} chars")
```
