-- ============================================================
-- NEXOSITES PLATFORM — schema reference
-- This is already applied to the "Nexo Sites" Supabase project
-- (uimpfkisclriounbiaww). Kept here for reference / disaster
-- recovery — re-running it against a fresh project will recreate
-- everything from scratch.
-- ============================================================

create extension if not exists "pgcrypto";

-- ── PROFILES ──────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select coalesce((select role from public.profiles where id = auth.uid()) = 'admin', false);
$$;

create policy "profiles_select_own_or_admin" on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid() and role = 'customer');

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── ORDERS ────────────────────────────────────────────────
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  project_type text not null,
  business_size text,
  pages int not null default 1,
  features jsonb not null default '[]'::jsonb,
  timeline text not null default 'standard',
  maintenance_plan text not null default 'none',
  notes text,
  estimated_price numeric(10,2),
  final_price numeric(10,2),
  currency text not null default 'USD',
  status text not null default 'pending_review'
    check (status in ('pending_review','quoted','accepted','in_progress','revision','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "orders_select_own_or_admin" on public.orders for select
  using (customer_id = auth.uid() or public.is_admin());
create policy "orders_insert_own" on public.orders for insert
  with check (customer_id = auth.uid());
create policy "orders_update_own_pending_or_admin" on public.orders for update
  using (public.is_admin() or (customer_id = auth.uid() and status in ('pending_review','quoted')));

-- ── MESSAGES ──────────────────────────────────────────────
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  body text not null check (char_length(body) between 1 and 4000),
  read_by_customer boolean not null default false,
  read_by_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "messages_select_own_or_admin" on public.messages for select
  using (customer_id = auth.uid() or public.is_admin());
create policy "messages_insert_own_or_admin" on public.messages for insert
  with check (sender_id = auth.uid() and (customer_id = auth.uid() or public.is_admin()));
create policy "messages_update_read_flags" on public.messages for update
  using (customer_id = auth.uid() or public.is_admin());

create index idx_orders_customer on public.orders(customer_id);
create index idx_messages_customer on public.messages(customer_id, created_at);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger orders_touch before update on public.orders
  for each row execute procedure public.touch_updated_at();
create trigger profiles_touch before update on public.profiles
  for each row execute procedure public.touch_updated_at();

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.orders;

-- ── MAKE YOURSELF ADMIN (run once, after you sign up) ───────
-- update public.profiles set role = 'admin' where email = 'you@example.com';
