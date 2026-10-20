-- Slicks Barber Studio — custom booking API schema
-- Run this in your Supabase SQL editor (Project → SQL Editor → New query).
-- No anonymous access is granted: only the server (service role) reads/writes bookings.

create table if not exists public.bookings (
  id            bigint generated always as identity primary key,
  reference     text not null unique,
  service_id    text,
  service_name  text,
  barber_id     text,
  barber_name   text,
  booking_date  date,
  booking_time  text,
  client_name   text not null,
  contact       text not null,
  notes         text,
  status        text not null default 'pending',
  created_at    timestamptz not null default now()
);

alter table public.bookings enable row level security;

-- Service role bypasses RLS; these policies keep the door shut for anon/users.
create policy "bookings service insert"
  on public.bookings for insert
  to service_role
  with check (true);

create policy "bookings service select"
  on public.bookings for select
  to service_role
  using (true);

create index if not exists bookings_date_idx on public.bookings (booking_date);
create index if not exists bookings_status_idx on public.bookings (status);