'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { WartaDraftState } from '@/lib/types/warta-draft'

// ============================================================
// getWartaDraft
// Query warta by edisi_minggu_id, beserta seluruh tabel anak.
// Kembalikan WartaDraftState untuk mengisi state awal reducer.
// Juga ambil tanggal_ibadah dari edisi_minggu untuk header stepper.
// ============================================================
export async function getWartaDraft(edisiId: string): Promise<{
  draft: WartaDraftState
  tanggalIbadah: string | null
  wartaId: string | null
}> {
  const supabase = await createClient()

  // Ambil warta beserta edisi_minggu.tanggal_ibadah
  const { data: warta, error: wartaError } = await supabase
    .from('warta')
    .select(`
      *,
      edisi_minggu ( tanggal_ibadah )
    `)
    .eq('edisi_minggu_id', edisiId)
    .single()

  if (wartaError && wartaError.code !== 'PGRST116') {
    // PGRST116 = row not found (warta belum pernah diisi)
    throw new Error(`Gagal mengambil data warta: ${wartaError.message}`)
  }

  const wartaId = warta?.id ?? null
  const tanggalIbadah = (warta as { edisi_minggu?: { tanggal_ibadah?: string } } | null)?.edisi_minggu?.tanggal_ibadah ?? null

  // Jika warta belum ada, kembalikan state kosong
  if (!wartaId) {
    return {
      draft: buildEmptyDraft(),
      tanggalIbadah,
      wartaId: null,
    }
  }

  // Ambil seluruh tabel anak secara paralel
  const [dodingRes, kehadiranRes, partonggoanKhRes, partonggoanJdwRes] = await Promise.all([
    supabase
      .from('doding_items')
      .select('*')
      .eq('warta_id', wartaId)
      .order('urutan', { ascending: true }),
    supabase
      .from('kehadiran_items')
      .select('*')
      .eq('warta_id', wartaId)
      .order('urutan', { ascending: true }),
    supabase
      .from('partonggoan_kehadiran')
      .select('*')
      .eq('warta_id', wartaId)
      .order('urutan', { ascending: true }),
    supabase
      .from('partonggoan_jadwal')
      .select('*')
      .eq('warta_id', wartaId)
      .order('urutan', { ascending: true }),
  ])

  if (dodingRes.error) throw new Error(`Gagal mengambil doding_items: ${dodingRes.error.message}`)
  if (kehadiranRes.error) throw new Error(`Gagal mengambil kehadiran_items: ${kehadiranRes.error.message}`)
  if (partonggoanKhRes.error) throw new Error(`Gagal mengambil partonggoan_kehadiran: ${partonggoanKhRes.error.message}`)
  if (partonggoanJdwRes.error) throw new Error(`Gagal mengambil partonggoan_jadwal: ${partonggoanJdwRes.error.message}`)

  const draft: WartaDraftState = {
    currentStep: 1,
    // Step 1 — warta fields
    goranMinggu:              warta.goran_minggu ?? '',
    modelKebaktian:           warta.model_kebaktian ?? '',
    warnaLiturgi:             warta.warna_liturgi ?? '',
    ambilan:                  warta.ambilan ?? '',
    sibasaon:                 warta.sibasaon ?? '',
    parAmbilan1Id:            warta.par_ambilan_1_id ?? null,
    parAmbilan2Id:            warta.par_ambilan_2_id ?? null,
    sipangidangiPagiId:       warta.sipangidangi_pagi_id ?? null,
    sipangidangiSiangId:      warta.sipangidangi_siang_id ?? null,
    parOrganPagiId:           warta.par_organ_pagi_id ?? null,
    parOrganSiangId:          warta.par_organ_siang_id ?? null,
    parmasukPukul:            warta.parmasuk_pukul ?? [],
    nextModelKebaktian:       warta.next_model_kebaktian ?? '',
    nextParAmbilan1Id:        warta.next_par_ambilan_1_id ?? null,
    nextParAmbilan2Id:        warta.next_par_ambilan_2_id ?? null,
    nextSipangidangiPagiId:   warta.next_sipangidangi_pagi_id ?? null,
    nextSipangidangiSiangId:  warta.next_sipangidangi_siang_id ?? null,
    nextParOrganPagiId:       warta.next_par_organ_pagi_id ?? null,
    nextParOrganSiangId:      warta.next_par_organ_siang_id ?? null,
    nextParmasukPukul:        warta.next_parmasuk_pukul ?? [],
    dodingItems: (dodingRes.data ?? []).map((row) => ({
      localId:    row.id,
      nomorLagu:  row.nomor_lagu ?? '',
      notasiBait: row.notasi_bait ?? '',
    })),
    // Step 2
    kehadiranItems: (kehadiranRes.data ?? []).map((row) => ({
      localId:  row.id,
      tanggal:  row.tanggal ?? null,
      uraian:   row.uraian ?? '',
      lk:       row.lk ?? 0,
      pr:       row.pr ?? 0,
    })),
    // Step 3
    partonggoanKehadiran: (partonggoanKhRes.data ?? []).map((row) => ({
      localId:    row.id,
      sektor:     row.sektor as 'I' | 'II' | 'III' | 'IV' | 'V',
      keluargaId: row.keluarga_id ?? null,
      lk:         row.lk ?? 0,
      pr:         row.pr ?? 0,
    })),
    partonggoanJadwal: (partonggoanJdwRes.data ?? []).map((row) => ({
      localId:      row.id,
      sektor:       row.sektor as 'I' | 'II' | 'III' | 'IV' | 'V',
      keluargaId:   row.keluarga_id ?? null,
      parAmbilanId: row.par_ambilan_id ?? null,
      parAgendaId:  row.par_agenda_id ?? null,
    })),
    // Step 4
    pengumumanHtml: warta.pengumuman_html ?? '',
  }

  return { draft, tanggalIbadah, wartaId }
}

// ============================================================
// simpanWartaFinal
// Bangun payload JSONB lalu panggil supabase.rpc('fn_simpan_warta_final').
// TIDAK melakukan insert/update tabel anak secara terpisah dari Next.js.
// Satu panggilan RPC ini bersifat atomik di sisi Postgres.
// ============================================================
export async function simpanWartaFinal(edisiId: string, draft: WartaDraftState): Promise<void> {
  const supabase = await createClient()

  // Ambil warta_id berdasarkan edisi_minggu_id
  const { data: warta, error: findError } = await supabase
    .from('warta')
    .select('id')
    .eq('edisi_minggu_id', edisiId)
    .single()

  if (findError || !warta?.id) {
    throw new Error(`Warta untuk edisi ini tidak ditemukan: ${findError?.message ?? 'id kosong'}`)
  }

  const wartaId = warta.id

  // Bangun payload warta_fields (semua field skalar)
  const wartaFields = {
    goran_minggu:               draft.goranMinggu,
    model_kebaktian:            draft.modelKebaktian,
    warna_liturgi:              draft.warnaLiturgi,
    ambilan:                    draft.ambilan,
    sibasaon:                   draft.sibasaon,
    par_ambilan_1_id:           draft.parAmbilan1Id,
    par_ambilan_2_id:           draft.parAmbilan2Id,
    sipangidangi_pagi_id:       draft.sipangidangiPagiId,
    sipangidangi_siang_id:      draft.sipangidangiSiangId,
    par_organ_pagi_id:          draft.parOrganPagiId,
    par_organ_siang_id:         draft.parOrganSiangId,
    parmasuk_pukul:             draft.parmasukPukul,
    next_model_kebaktian:       draft.nextModelKebaktian,
    next_par_ambilan_1_id:      draft.nextParAmbilan1Id,
    next_par_ambilan_2_id:      draft.nextParAmbilan2Id,
    next_sipangidangi_pagi_id:  draft.nextSipangidangiPagiId,
    next_sipangidangi_siang_id: draft.nextSipangidangiSiangId,
    next_par_organ_pagi_id:     draft.nextParOrganPagiId,
    next_par_organ_siang_id:    draft.nextParOrganSiangId,
    next_parmasuk_pukul:        draft.nextParmasukPukul,
    pengumuman_html:            draft.pengumumanHtml,
  }

  // Payload tabel-tabel anak (urutan diturunkan dari posisi array)
  const dodingItems = draft.dodingItems.map((item, i) => ({
    nomor_lagu:  item.nomorLagu,
    notasi_bait: item.notasiBait,
    urutan:      i,
  }))

  const kehadiranItems = draft.kehadiranItems.map((item, i) => ({
    tanggal: item.tanggal,
    uraian:  item.uraian,
    lk:      item.lk,
    pr:      item.pr,
    urutan:  i,
  }))

  const partonggoanKehadiran = draft.partonggoanKehadiran.map((item, i) => ({
    sektor:      item.sektor,
    keluarga_id: item.keluargaId,
    lk:          item.lk,
    pr:          item.pr,
    urutan:      i,
  }))

  const partonggoanJadwal = draft.partonggoanJadwal.map((item, i) => ({
    sektor:         item.sektor,
    keluarga_id:    item.keluargaId,
    par_ambilan_id: item.parAmbilanId,
    par_agenda_id:  item.parAgendaId,
    urutan:         i,
  }))

  // Panggil RPC atomik — rollback otomatis jika ada error di Postgres
  const { error } = await supabase.rpc('fn_simpan_warta_final', {
    p_warta_id:               wartaId,
    p_warta_fields:           wartaFields,
    p_doding_items:           dodingItems,
    p_kehadiran_items:        kehadiranItems,
    p_partonggoan_kehadiran:  partonggoanKehadiran,
    p_partonggoan_jadwal:     partonggoanJadwal,
  })

  if (error) {
    throw new Error(`Gagal menyimpan warta: ${error.message}`)
  }

  // localStorage dibersihkan di sisi client setelah action ini berhasil
  // (dilakukan oleh komponen WartaStepperShell setelah promise resolved)

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

// ============================================================
// Helper: state kosong untuk edisi yang belum pernah diisi
// ============================================================
function buildEmptyDraft(): WartaDraftState {
  return {
    currentStep:              1,
    goranMinggu:              '',
    modelKebaktian:           '',
    warnaLiturgi:             '',
    ambilan:                  '',
    sibasaon:                 '',
    parAmbilan1Id:            null,
    parAmbilan2Id:            null,
    sipangidangiPagiId:       null,
    sipangidangiSiangId:      null,
    parOrganPagiId:           null,
    parOrganSiangId:          null,
    parmasukPukul:            [],
    nextModelKebaktian:       '',
    nextParAmbilan1Id:        null,
    nextParAmbilan2Id:        null,
    nextSipangidangiPagiId:   null,
    nextSipangidangiSiangId:  null,
    nextParOrganPagiId:       null,
    nextParOrganSiangId:      null,
    nextParmasukPukul:        [],
    dodingItems:              [],
    kehadiranItems:           [],
    partonggoanKehadiran:     [],
    partonggoanJadwal:        [],
    pengumumanHtml:           '',
  }
}
