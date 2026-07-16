-- ====================================================================
-- PERLUASAN TABEL warta — field detail Step 1 & Step 4
-- ====================================================================
alter table warta
  add column model_kebaktian text,
  add column warna_liturgi text,
  add column ambilan text,
  add column sibasaon text,
  add column par_ambilan_1_id uuid references pelayan_gereja(id),
  add column par_ambilan_2_id uuid references pelayan_gereja(id),
  add column sipangidangi_pagi_id uuid references pelayan_gereja(id),
  add column sipangidangi_siang_id uuid references pelayan_gereja(id),
  add column par_organ_pagi_id uuid references pelayan_gereja(id),
  add column par_organ_siang_id uuid references pelayan_gereja(id),
  add column parmasuk_pukul text[],                 -- bisa lebih dari satu jam sesi
  -- Ringkasan Minggu Depan (struktur field identik, prefix next_)
  add column next_model_kebaktian text,
  add column next_par_ambilan_1_id uuid references pelayan_gereja(id),
  add column next_par_ambilan_2_id uuid references pelayan_gereja(id),
  add column next_sipangidangi_pagi_id uuid references pelayan_gereja(id),
  add column next_sipangidangi_siang_id uuid references pelayan_gereja(id),
  add column next_par_organ_pagi_id uuid references pelayan_gereja(id),
  add column next_par_organ_siang_id uuid references pelayan_gereja(id),
  add column next_parmasuk_pukul text[],
  -- Step 4: Pengumuman (Rich Text Editor output)
  add column pengumuman_html text;

-- ====================================================================
-- TABEL ANAK: Nomor Doding (Step 1, baris dinamis)
-- ====================================================================
create table doding_items (
  id uuid primary key default gen_random_uuid(),
  warta_id uuid not null references warta(id) on delete cascade,
  nomor_lagu text not null,
  notasi_bait text,              -- contoh: "1 - 2", "1 + 3", "1 - 3"
  urutan int not null default 0
);

-- ====================================================================
-- TABEL ANAK: Kehadiran Kebaktian & PA (Step 2, baris dinamis)
-- ====================================================================
create table kehadiran_items (
  id uuid primary key default gen_random_uuid(),
  warta_id uuid not null references warta(id) on delete cascade,
  tanggal date,
  uraian text not null,          -- preset: Sikolah Minggu, Remaja, Kebaktian Pagi, Kebaktian Siang, PA Seksi Inang Jemaat
  lk int default 0,
  pr int default 0,
  urutan int not null default 0
  -- Jlh Hadir TIDAK disimpan sebagai kolom — dihitung on-the-fly (lk + pr) baik di client maupun saat query/print
);

-- ====================================================================
-- TABEL ANAK: Kehadiran Partonggoan Minggu Berjalan (Step 3, sub-blok 1)
-- ====================================================================
create table partonggoan_kehadiran (
  id uuid primary key default gen_random_uuid(),
  warta_id uuid not null references warta(id) on delete cascade,
  sektor text not null check (sektor in ('I','II','III','IV','V')),
  keluarga_id uuid references jemaat_keluarga(id),   -- Ianan/Rumah, boleh null jika belum ditentukan
  lk int default 0,
  pr int default 0,
  urutan int not null default 0
);

-- ====================================================================
-- TABEL ANAK: Jadwal Ianan & Sipartugas Minggu Depan (Step 3, sub-blok 2)
-- ====================================================================
create table partonggoan_jadwal (
  id uuid primary key default gen_random_uuid(),
  warta_id uuid not null references warta(id) on delete cascade,
  sektor text not null check (sektor in ('I','II','III','IV','V')),
  keluarga_id uuid references jemaat_keluarga(id),
  par_ambilan_id uuid references pelayan_gereja(id),
  par_agenda_id uuid references pelayan_gereja(id),
  urutan int not null default 0
);

-- ====================================================================
-- RLS untuk tabel anak baru
-- ====================================================================
alter table doding_items enable row level security;
alter table kehadiran_items enable row level security;
alter table partonggoan_kehadiran enable row level security;
alter table partonggoan_jadwal enable row level security;

create policy "admin_full_access_doding" on doding_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_full_access_kehadiran" on kehadiran_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_full_access_partonggoan_kehadiran" on partonggoan_kehadiran for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_full_access_partonggoan_jadwal" on partonggoan_jadwal for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
