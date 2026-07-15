-- ====================================================================
-- MASTER DATA: PELAYAN GEREJA
-- ====================================================================
create table pelayan_gereja (
  id uuid primary key default gen_random_uuid(),
  nama_pelayan text not null,
  gelar text,                          -- contoh: 'Pdt.', 'St.', 'C.St.', 'Sy.'
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column pelayan_gereja.is_active is 'Soft delete flag. false = tidak muncul di dropdown form baru, tapi tetap dirujuk oleh entri Warta lama demi integritas data historis.';

-- ====================================================================
-- MASTER DATA: JEMAAT & KELUARGA
-- ====================================================================
create table jemaat_keluarga (
  id uuid primary key default gen_random_uuid(),
  nama_keluarga text not null,         -- contoh: "Kel. Ir. Berlindo Saragih"
  sektor text not null check (sektor in ('I', 'II', 'III', 'IV', 'V')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column jemaat_keluarga.is_active is 'Soft delete flag. Sama seperti pelayan_gereja — mencegah rusaknya riwayat Partonggoan/Tingting lama saat keluarga pindah sektor atau keluar keanggotaan.';

-- Index bantu pencarian & filter sektor
create index idx_pelayan_nama on pelayan_gereja using gin (to_tsvector('simple', nama_pelayan));
create index idx_jemaat_nama on jemaat_keluarga using gin (to_tsvector('simple', nama_keluarga));
create index idx_jemaat_sektor on jemaat_keluarga (sektor);

-- ====================================================================
-- RLS — konsisten dengan File 1 (BR-01, NFR-05)
-- ====================================================================
alter table pelayan_gereja enable row level security;
alter table jemaat_keluarga enable row level security;

create policy "admin_full_access_pelayan" on pelayan_gereja
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin_full_access_jemaat" on jemaat_keluarga
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
