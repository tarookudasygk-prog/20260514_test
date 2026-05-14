-- 宇宙旅行シミュレーター：trips テーブル
-- Supabase ダッシュボードの「SQL Editor」にこのファイルの内容を貼り付けて実行してください。

create table if not exists public.trips (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  destination     text not null,
  apod_title      text,
  apod_url        text,
  apod_date       date,
  experience_text text not null
);

-- 新しい順の取得を速くするためのインデックス
create index if not exists trips_created_at_idx
  on public.trips (created_at desc);

-- 行レベルセキュリティ（RLS）を有効化
alter table public.trips enable row level security;

-- 注意：このサンプルアプリにはログイン機能がないため、
-- anon（匿名）キーでの読み書き・削除を許可しています。
-- 本番でユーザーごとにデータを分けたい場合は Supabase Auth を導入し、
-- user_id 列を追加して「auth.uid() = user_id」のポリシーに置き換えてください。
drop policy if exists "anon can read trips"   on public.trips;
drop policy if exists "anon can insert trips" on public.trips;
drop policy if exists "anon can delete trips" on public.trips;

create policy "anon can read trips"
  on public.trips for select
  to anon
  using (true);

create policy "anon can insert trips"
  on public.trips for insert
  to anon
  with check (true);

create policy "anon can delete trips"
  on public.trips for delete
  to anon
  using (true);
