-- ====================================================================
-- CREATE OR REPLACE FUNCTION fn_simpan_warta_final
-- Fungsi atomik: upsert warta + delete-then-insert seluruh tabel anak.
-- Dipanggil dari app/actions/warta.ts via supabase.rpc().
-- ====================================================================
create or replace function fn_simpan_warta_final(
  p_warta_id              uuid,
  p_warta_fields          jsonb,
  p_doding_items          jsonb,
  p_kehadiran_items       jsonb,
  p_partonggoan_kehadiran jsonb,
  p_partonggoan_jadwal    jsonb
)
returns void
language plpgsql
security definer
as $$
begin

  -- 1. Upsert field detail ke tabel warta
  update warta set
    goran_minggu                = (p_warta_fields->>'goran_minggu'),
    model_kebaktian             = (p_warta_fields->>'model_kebaktian'),
    warna_liturgi               = (p_warta_fields->>'warna_liturgi'),
    ambilan                     = (p_warta_fields->>'ambilan'),
    sibasaon                    = (p_warta_fields->>'sibasaon'),
    par_ambilan_1_id            = (p_warta_fields->>'par_ambilan_1_id')::uuid,
    par_ambilan_2_id            = (p_warta_fields->>'par_ambilan_2_id')::uuid,
    sipangidangi_pagi_id        = (p_warta_fields->>'sipangidangi_pagi_id')::uuid,
    sipangidangi_siang_id       = (p_warta_fields->>'sipangidangi_siang_id')::uuid,
    par_organ_pagi_id           = (p_warta_fields->>'par_organ_pagi_id')::uuid,
    par_organ_siang_id          = (p_warta_fields->>'par_organ_siang_id')::uuid,
    parmasuk_pukul              = (select array_agg(v) from jsonb_array_elements_text(p_warta_fields->'parmasuk_pukul') as v),
    next_model_kebaktian        = (p_warta_fields->>'next_model_kebaktian'),
    next_par_ambilan_1_id       = (p_warta_fields->>'next_par_ambilan_1_id')::uuid,
    next_par_ambilan_2_id       = (p_warta_fields->>'next_par_ambilan_2_id')::uuid,
    next_sipangidangi_pagi_id   = (p_warta_fields->>'next_sipangidangi_pagi_id')::uuid,
    next_sipangidangi_siang_id  = (p_warta_fields->>'next_sipangidangi_siang_id')::uuid,
    next_par_organ_pagi_id      = (p_warta_fields->>'next_par_organ_pagi_id')::uuid,
    next_par_organ_siang_id     = (p_warta_fields->>'next_par_organ_siang_id')::uuid,
    next_parmasuk_pukul         = (select array_agg(v) from jsonb_array_elements_text(p_warta_fields->'next_parmasuk_pukul') as v),
    pengumuman_html             = (p_warta_fields->>'pengumuman_html'),
    updated_at                  = now()
  where id = p_warta_id;

  -- 2. doding_items: delete-then-insert
  delete from doding_items where warta_id = p_warta_id;
  insert into doding_items (warta_id, nomor_lagu, notasi_bait, urutan)
  select
    p_warta_id,
    (item->>'nomor_lagu'),
    (item->>'notasi_bait'),
    (item->>'urutan')::int
  from jsonb_array_elements(p_doding_items) as item;

  -- 3. kehadiran_items: delete-then-insert
  delete from kehadiran_items where warta_id = p_warta_id;
  insert into kehadiran_items (warta_id, tanggal, uraian, lk, pr, urutan)
  select
    p_warta_id,
    (item->>'tanggal')::date,
    (item->>'uraian'),
    coalesce((item->>'lk')::int, 0),
    coalesce((item->>'pr')::int, 0),
    (item->>'urutan')::int
  from jsonb_array_elements(p_kehadiran_items) as item;

  -- 4. partonggoan_kehadiran: delete-then-insert
  delete from partonggoan_kehadiran where warta_id = p_warta_id;
  insert into partonggoan_kehadiran (warta_id, sektor, keluarga_id, lk, pr, urutan)
  select
    p_warta_id,
    (item->>'sektor'),
    (item->>'keluarga_id')::uuid,
    coalesce((item->>'lk')::int, 0),
    coalesce((item->>'pr')::int, 0),
    (item->>'urutan')::int
  from jsonb_array_elements(p_partonggoan_kehadiran) as item;

  -- 5. partonggoan_jadwal: delete-then-insert
  delete from partonggoan_jadwal where warta_id = p_warta_id;
  insert into partonggoan_jadwal (warta_id, sektor, keluarga_id, par_ambilan_id, par_agenda_id, urutan)
  select
    p_warta_id,
    (item->>'sektor'),
    (item->>'keluarga_id')::uuid,
    (item->>'par_ambilan_id')::uuid,
    (item->>'par_agenda_id')::uuid,
    (item->>'urutan')::int
  from jsonb_array_elements(p_partonggoan_jadwal) as item;

end;
$$;
