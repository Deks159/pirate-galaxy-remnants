-- Pirate Galaxy Remnant Log - estado reproducible actual
-- Proyecto: Deks159's Project
-- Este archivo refleja el esquema base + administración + campos dinámicos.

create extension if not exists pgcrypto;

create table if not exists public.remnant_records (
  id uuid primary key default gen_random_uuid(),
  remnant_type text not null check (remnant_type in ('XC','SC')),
  class_name text not null,
  blueprint text not null,
  technology text not null check (technology in ('Normal','Rápida','Duradera','Potente')),
  evidence_path text,
  created_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  extra_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz,
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists remnant_records_created_at_idx on public.remnant_records (created_at desc);
create index if not exists remnant_records_type_idx on public.remnant_records (remnant_type);
create index if not exists remnant_records_class_idx on public.remnant_records (class_name);
create index if not exists remnant_records_blueprint_idx on public.remnant_records (blueprint);
create index if not exists remnant_records_technology_idx on public.remnant_records (technology);
create index if not exists remnant_records_created_by_idx on public.remnant_records (created_by);
create index if not exists remnant_records_updated_by_idx on public.remnant_records (updated_by);

alter table public.remnant_records enable row level security;

revoke all on table public.remnant_records from anon;
grant select, insert, update, delete on table public.remnant_records to authenticated;

drop policy if exists authenticated_read_all_remnants on public.remnant_records;
create policy authenticated_read_all_remnants
on public.remnant_records for select
to authenticated
using (true);

drop policy if exists authenticated_insert_remnants on public.remnant_records;
create policy authenticated_insert_remnants
on public.remnant_records for insert
to authenticated
with check ((select auth.uid()) = created_by);

drop policy if exists super_admin_update_remnants on public.remnant_records;
create policy super_admin_update_remnants
on public.remnant_records for update
to authenticated
using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin', false))
with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin', false));

drop policy if exists super_admin_delete_remnants on public.remnant_records;
create policy super_admin_delete_remnants
on public.remnant_records for delete
to authenticated
using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin', false));

create table if not exists public.form_fields (
  id uuid primary key default gen_random_uuid(),
  field_key text not null unique check (field_key ~ '^[a-z][a-z0-9_]*$'),
  label text not null,
  field_type text not null default 'text'
    check (field_type in ('text','number','select','textarea','checkbox')),
  required boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 100,
  options jsonb not null default '[]'::jsonb check (jsonb_typeof(options) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.form_fields enable row level security;
revoke all on table public.form_fields from anon;
grant select, insert, update, delete on table public.form_fields to authenticated;

drop policy if exists authenticated_read_active_form_fields on public.form_fields;
create policy authenticated_read_active_form_fields
on public.form_fields for select
to authenticated
using (
  active = true
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin', false)
);

drop policy if exists super_admin_insert_form_fields on public.form_fields;
create policy super_admin_insert_form_fields
on public.form_fields for insert
to authenticated
with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin', false));

drop policy if exists super_admin_update_form_fields on public.form_fields;
create policy super_admin_update_form_fields
on public.form_fields for update
to authenticated
using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin', false))
with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin', false));

drop policy if exists super_admin_delete_form_fields on public.form_fields;
create policy super_admin_delete_form_fields
on public.form_fields for delete
to authenticated
using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin', false));

insert into public.form_fields
  (field_key, label, field_type, required, active, sort_order, options)
values
  ('pilot_name', 'Nombre de piloto', 'text', false, true, 10, '[]'::jsonb)
on conflict (field_key) do update
set label = excluded.label,
    active = true,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'remnant-evidence',
  'remnant-evidence',
  false,
  8388608,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists users_upload_own_evidence on storage.objects;
create policy users_upload_own_evidence
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'remnant-evidence'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists authenticated_read_evidence on storage.objects;
create policy authenticated_read_evidence
on storage.objects for select
to authenticated
using (bucket_id = 'remnant-evidence');

drop policy if exists users_delete_own_evidence on storage.objects;
create policy users_delete_own_evidence
on storage.objects for delete
to authenticated
using (
  bucket_id = 'remnant-evidence'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists super_admin_delete_any_evidence on storage.objects;
create policy super_admin_delete_any_evidence
on storage.objects for delete
to authenticated
using (
  bucket_id = 'remnant-evidence'
  and coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin', false)
);
