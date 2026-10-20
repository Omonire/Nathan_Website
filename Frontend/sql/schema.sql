-- Slicks Barber Studio — isolated booking database schema
-- Run inside the dedicated "slicks_booking" database as its owner.
-- This intentionally exists in its own database so no existing database is touched.

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

create index if not exists bookings_date_idx   on public.bookings (booking_date);
create index if not exists bookings_status_idx on public.bookings (status);

-- Optional starter view of today's requests for quick checks:
create or replace view public.todays_bookings as
  select id, reference, client_name, service_name, barber_name, booking_time, contact, status, created_at
  from public.bookings
  where booking_date = current_date
  order by booking_time;