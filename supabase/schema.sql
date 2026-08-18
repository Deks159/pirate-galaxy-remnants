-- Pirate Galaxy Remnant Log - Supabase
-- Ejecuta este archivo completo en Supabase > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.remnant_records (
  id uuid primary key default gen_random_uuid(),
  remnant_type text not null check (remnant_type in ('XC','SC')),
  class_name text not null,
  blueprint text not null,
  technology text not null check (technology in ('Normal','Rápida','Duradera','Potente')),
  evidence_path text,
  created_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index if not exists remnant_records_created_at_idx on public.remnant_records (created_at desc);
create index if not exists remnant_records_type_idx on public.remnant_records (remnant_type);
create index if not exists remnant_records_class_idx on public.remnant_records (class_name);
create index if not exists remnant_records_blueprint_idx on public.remnant_records (blueprint);
create index if not exists remnant_records_technology_idx on public.remnant_records (technology);

alter table public.remnant_records enable row level security;

drop policy if exists "authenticated_read_all_remnants" on public.remnant_records;
create policy "authenticated_read_all_remnants" on public.remnant_records for select to authenticated using (true);

drop policy if exists "authenticated_insert_remnants" on public.remnant_records;
create policy "authenticated_insert_remnants" on public.remnant_records for insert to authenticated with check (created_by = auth.uid());

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('remnant-evidence','remnant-evidence',false,8388608,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "users_upload_own_evidence" on storage.objects;
create policy "users_upload_own_evidence" on storage.objects for insert to authenticated
with check (bucket_id='remnant-evidence' and (storage.foldername(name))[1]=auth.uid()::text);

drop policy if exists "authenticated_read_evidence" on storage.objects;
create policy "authenticated_read_evidence" on storage.objects for select to authenticated
using (bucket_id='remnant-evidence');

drop policy if exists "users_delete_own_evidence" on storage.objects;
create policy "users_delete_own_evidence" on storage.objects for delete to authenticated
using (bucket_id='remnant-evidence' and (storage.foldername(name))[1]=auth.uid()::text);
