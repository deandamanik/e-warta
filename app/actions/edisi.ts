'use server'

import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { getNextSunday } from '@/lib/utils/get-next-sunday'

// ─── Helper: format Date ke string YYYY-MM-DD (konsisten, tidak bergantung timezone lokal mesin) ───
function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

// ─── createEdisiBaru ─────────────────────────────────────────────────────────────────────────────
// FR-03 / Bagian 5.2 FSD: selalu arahkan ke Minggu BERIKUTNYA yang belum ada datanya.
// Loop maju 7 hari per iterasi; batas maksimal 52 iterasi (±1 tahun) untuk mencegah infinite loop.

export async function createEdisiBaru() {
  const supabase = await createClient()

  // Hitung tanggal kandidat mulai dari Minggu terdekat berikutnya
  let candidate = getNextSunday()
  const MAX_ITERATIONS = 52

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const dateStr = toISODateString(candidate)

    // Cek apakah tanggal ini sudah ada di edisi_minggu
    const { data: existing, error: checkError } = await supabase
      .from('edisi_minggu')
      .select('id')
      .eq('tanggal_ibadah', dateStr)
      .maybeSingle()

    if (checkError) {
      throw new Error(`Gagal memeriksa tanggal ibadah: ${checkError.message}`)
    }

    if (!existing) {
      // Tanggal belum terpakai — lanjutkan insert
      break
    }

    // Tanggal sudah ada, maju 7 hari
    candidate.setDate(candidate.getDate() + 7)

    if (i === MAX_ITERATIONS - 1) {
      throw new Error('Tidak dapat menemukan tanggal Minggu yang tersedia dalam 52 minggu ke depan.')
    }
  }

  const dateStr = toISODateString(candidate)

  // 1. Insert ke edisi_minggu
  const { data: edisi, error: edisiError } = await supabase
    .from('edisi_minggu')
    .insert({ tanggal_ibadah: dateStr })
    .select('id')
    .single()

  if (edisiError || !edisi) {
    throw new Error(`Gagal membuat edisi minggu: ${edisiError?.message}`)
  }

  const edisiId = edisi.id

  // 2. Insert baris kosong ke warta (hanya edisi_minggu_id)
  const { error: wartaError } = await supabase
    .from('warta')
    .insert({ edisi_minggu_id: edisiId })

  if (wartaError) {
    throw new Error(`Gagal membuat warta: ${wartaError.message}`)
  }

  // 3. Insert baris kosong ke tingting (is_lengkap: false)
  const { error: tingtingError } = await supabase
    .from('tingting')
    .insert({ edisi_minggu_id: edisiId, is_lengkap: false })

  if (tingtingError) {
    throw new Error(`Gagal membuat tingting: ${tingtingError.message}`)
  }

  // 4. Redirect ke halaman edit stepper
  redirect(`/warta/${edisiId}/edit`)
}

// ─── listEdisi ───────────────────────────────────────────────────────────────────────────────────
// Ambil daftar edisi_minggu dengan data join warta (goran_minggu) dan tingting (is_lengkap),
// diurutkan tanggal terbaru di atas, dengan paginasi bernomor (FR-02, BR-06).

export async function listEdisi(page: number, pageSize: number = 10) {
  const supabase = await createClient()

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, count, error } = await supabase
    .from('edisi_minggu')
    .select(
      `
      id,
      tanggal_ibadah,
      created_at,
      updated_at,
      warta (
        goran_minggu
      ),
      tingting (
        is_lengkap
      )
    `,
      { count: 'exact' }
    )
    .order('tanggal_ibadah', { ascending: false })
    .range(from, to)

  if (error) {
    throw new Error(`Gagal mengambil daftar edisi: ${error.message}`)
  }

  return {
    data: data ?? [],
    totalCount: count ?? 0,
  }
}

// ─── deleteEdisi ─────────────────────────────────────────────────────────────────────────────────
// Hapus permanen edisi_minggu berdasarkan ID.
// Cascade otomatis di database akan menghapus warta dan tingting terkait (on delete cascade).
// Penghapusan ini bersifat permanen tanpa mekanisme undo (FSD 6.1, BR-05).

export async function deleteEdisi(edisiId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('edisi_minggu')
    .delete()
    .eq('id', edisiId)

  if (error) {
    throw new Error(`Gagal menghapus edisi: ${error.message}`)
  }
}
