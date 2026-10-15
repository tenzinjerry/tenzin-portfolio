-- Run ONCE in Supabase SQL Editor. Review before execution.
-- Public visitors can read website text; only registered portfolio_admins can edit.
create table if not exists public.portfolio_site_content (
 key text primary key,
 value text not null default '',
 updated_at timestamptz not null default now()
);
alter table public.portfolio_site_content enable row level security;
grant select on public.portfolio_site_content to anon, authenticated;
grant insert, update on public.portfolio_site_content to authenticated;
create policy "Public can read site content" on public.portfolio_site_content
 for select to anon, authenticated using (true);
create policy "Owner can insert site content" on public.portfolio_site_content
 for insert to authenticated with check (exists (
 select 1 from public.portfolio_admins a where a.user_id = (select auth.uid())
 ));
create policy "Owner can update site content" on public.portfolio_site_content
 for update to authenticated using (exists (
 select 1 from public.portfolio_admins a where a.user_id = (select auth.uid())
 )) with check (exists (
 select 1 from public.portfolio_admins a where a.user_id = (select auth.uid())
 ));
