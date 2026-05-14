# 🚀 宇宙旅行シミュレーター

NASA の「今日の宇宙画像（APOD）」と Claude API を組み合わせて、
あなただけの宇宙旅行体験記を生成・保存できる Web アプリです。

技術スタック: **Next.js (App Router)** / **Tailwind CSS** / **Supabase** / **NASA APOD API** / **Claude API** / **Vercel**

---

## 🧠 ① PM：要件・設計

### 要件整理
- NASA APOD API から宇宙画像を取得して表示する
- 行き先を指定すると Claude API が宇宙旅行の体験記を生成する
- 気に入った体験記を Supabase に保存する
- ページ構成
  - `/` … トップページ（アプリ紹介）
  - `/explore` … 宇宙画像の取得 ＋ 体験記の生成・保存
  - `/mypage` … 保存した旅行の一覧・削除

### アーキテクチャ図（文章）
```
[ブラウザ]
   │
   ├─ GET  /                → app/page.tsx（Server Component）
   ├─ GET  /explore         → app/explore/page.tsx（Server Component）
   │         └─ 初期 APOD を lib/nasa.ts でサーバー取得
   │         └─ <ExperienceGenerator>（Client Component）
   │               ├─ GET  /api/apod?random=1  → NASA APOD（別画像）
   │               ├─ POST /api/generate       → Claude API（体験記生成）
   │               └─ saveTrip()（Server Action）→ Supabase へ INSERT
   │
   └─ GET  /mypage          → app/mypage/page.tsx（Server Component）
             └─ getTrips()（Server Action）→ Supabase から SELECT
             └─ deleteTrip()（Server Action / form action）→ Supabase から DELETE

[サーバー側のみ]
   NASA_API_KEY / CLAUDE_API_KEY はサーバー（API Routes・Server Actions）でのみ使用。
   クライアントには公開されない。
```

### 開発ステップ
1. プロジェクト雛形・設定ファイル作成
2. 外部 API ラッパー（NASA / Claude）と Supabase クライアント作成
3. API Routes（`/api/apod`, `/api/generate`）と Server Actions（trips）作成
4. ページ・UI コンポーネント作成
5. Supabase テーブル作成（`supabase/schema.sql`）
6. ローカル動作確認 → Vercel デプロイ

---

## 💻 ② フロントエンド

### ディレクトリ構成
```
.
├── app/
│   ├── layout.tsx            # 共通レイアウト（ナビ・フッター）
│   ├── globals.css           # Tailwind 読み込み
│   ├── page.tsx              # / トップページ
│   ├── explore/page.tsx      # /explore 探索ページ（Server Component）
│   ├── mypage/page.tsx       # /mypage 保存一覧（Server Component）
│   ├── actions/trips.ts      # Server Actions（保存・取得・削除）
│   └── api/
│       ├── apod/route.ts     # NASA APOD 取得 API
│       └── generate/route.ts # Claude 体験記生成 API
├── components/
│   ├── Nav.tsx               # ナビゲーションバー
│   ├── ApodCard.tsx          # 宇宙画像カード
│   └── ExperienceGenerator.tsx # 探索ページの操作 UI（Client Component）
├── lib/
│   ├── nasa.ts               # NASA APOD API ラッパー
│   ├── claude.ts             # Claude API ラッパー
│   └── supabase.ts           # Supabase クライアント
└── supabase/
    └── schema.sql            # テーブル定義 SQL
```

各ページ・コンポーネントのコードはこのリポジトリ内のファイルを参照してください。
UI は Tailwind CSS でダークな宇宙テーマに統一しています。

---

## 🔧 ③ バックエンド

- **`lib/nasa.ts`** … NASA APOD API を呼ぶ。`NASA_API_KEY` 未設定時は `DEMO_KEY` で動作。
- **`lib/claude.ts`** … `@anthropic-ai/sdk` で Claude（`claude-sonnet-4-6`）を呼び、体験記を生成。
- **`app/api/apod/route.ts`** … `GET /api/apod`（本日）/ `GET /api/apod?random=1`（ランダム）。
- **`app/api/generate/route.ts`** … `POST /api/generate`。`destination` 必須、入力バリデーションあり。
- **`app/actions/trips.ts`** … `getTrips` / `saveTrip` / `deleteTrip` の Server Actions。

### エラーハンドリング方針
- 外部 API 失敗時は HTTP ステータスと日本語メッセージを JSON で返す。
- API キー未設定は明示的に例外を投げ、画面に原因を表示する。
- クライアント側は `try/catch` で受け取り、赤いエラーバナーで表示する。

### セキュリティ（API キー管理）
- `NASA_API_KEY` と `CLAUDE_API_KEY` は **`NEXT_PUBLIC_` を付けない**ため、
  サーバー（API Routes / Server Actions）でのみ参照され、ブラウザに露出しません。
- `.env` / `.env*.local` は `.gitignore` 済み。リポジトリにキーをコミットしないこと。

---

## 🗄️ ④ データベース（Supabase）

### テーブル設計：`trips`
| カラム | 型 | 説明 |
| --- | --- | --- |
| `id` | `uuid` | 主キー（自動生成） |
| `created_at` | `timestamptz` | 作成日時（自動） |
| `destination` | `text` | 行き先（必須） |
| `apod_title` | `text` | 宇宙画像のタイトル |
| `apod_url` | `text` | 宇宙画像の URL |
| `apod_date` | `date` | 宇宙画像の日付 |
| `experience_text` | `text` | 生成された体験記（必須） |

### SQL
テーブル定義・インデックス・RLS ポリシーは [`supabase/schema.sql`](./supabase/schema.sql) にまとめてあります。
Supabase ダッシュボードの **SQL Editor** に貼り付けて実行してください。

> このサンプルはログイン機能がないため、`anon` キーでの読み書きを許可しています。
> 本番でユーザーごとにデータを分ける場合は Supabase Auth を導入し、`user_id` 列と
> `auth.uid() = user_id` ポリシーへ変更してください。

---

## 🚀 ⑤ DevOps

### ローカルでの起動手順
```bash
# 1. 依存関係をインストール
npm install

# 2. 環境変数ファイルを用意
cp .env.example .env.local
#    → .env.local を開いて各キーを設定

# 3. Supabase でテーブル作成
#    supabase/schema.sql の内容を Supabase の SQL Editor で実行

# 4. 開発サーバー起動
npm run dev
#    → http://localhost:3000
```

### 環境変数
| 変数名 | 用途 | 公開範囲 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL | クライアント可 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon キー | クライアント可 |
| `NASA_API_KEY` | NASA APOD API キー | **サーバーのみ** |
| `CLAUDE_API_KEY` | Claude API キー | **サーバーのみ** |

### Vercel デプロイ手順
1. このリポジトリを GitHub に push する。
2. [Vercel](https://vercel.com/) で「New Project」→ リポジトリをインポート。
3. Framework Preset は **Next.js**（自動検出）。
4. **Settings → Environment Variables** に上記4つの環境変数を登録する。
5. 「Deploy」を実行。以降は push のたびに自動デプロイされる。

### 本番運用時の注意点
- `DEMO_KEY` はレート制限が厳しいため、本番では必ず `NASA_API_KEY` を取得して設定する。
- Claude API は従量課金。`max_tokens` や呼び出し回数に注意する（必要ならレート制限を追加）。
- API キーは Vercel の環境変数で管理し、コードやログに出力しない。
- Supabase の RLS を本番要件（認証の有無）に合わせて見直す。
