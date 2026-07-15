'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { SEKTOR_LIST, Sektor } from '@/lib/constants'

/**
 * Mengambil semua baris jemaat_keluarga (aktif dan nonaktif),
 * diurutkan berdasarkan nama_keluarga asc.
 * Filter tambahan berdasarkan search (ilike) dan sektorFilter jika diberikan.
 */
export async function listJemaat(search?: string, sektorFilter?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('jemaat_keluarga')
    .select('*')
    .order('nama_keluarga', { ascending: true })

  if (search && search.trim() !== '') {
    query = query.ilike('nama_keluarga', `%${search.trim()}%`)
  }
  
  if (sektorFilter && SEKTOR_LIST.includes(sektorFilter as Sektor)) {
    query = query.eq('sektor', sektorFilter)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Gagal mengambil data jemaat: ${error.message}`)
  }

  return data ?? []
}

/**
 * Menambahkan baris baru ke jemaat_keluarga.
 * nama_keluarga dan sektor wajib diisi, dan sektor harus ada di SEKTOR_LIST.
 */
export async function createJemaat(formData: FormData) {
  const nama_keluarga = (formData.get('nama_keluarga') as string | null)?.trim()
  const sektor = formData.get('sektor') as string | null

  if (!nama_keluarga) {
    throw new Error('Nama keluarga wajib diisi.')
  }
  
  if (!sektor || !SEKTOR_LIST.includes(sektor as Sektor)) {
    throw new Error('Sektor wajib diisi dan harus berupa sektor yang valid.')
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('jemaat_keluarga')
    .insert({ nama_keluarga, sektor })

  if (error) {
    throw new Error(`Gagal menambahkan jemaat: ${error.message}`)
  }

  revalidatePath('/master-data/jemaat')
}

/**
 * Memperbarui nama_keluarga dan sektor pada baris yang ditentukan oleh id.
 */
export async function updateJemaat(id: string, formData: FormData) {
  const nama_keluarga = (formData.get('nama_keluarga') as string | null)?.trim()
  const sektor = formData.get('sektor') as string | null

  if (!nama_keluarga) {
    throw new Error('Nama keluarga wajib diisi.')
  }
  
  if (!sektor || !SEKTOR_LIST.includes(sektor as Sektor)) {
    throw new Error('Sektor wajib diisi dan harus berupa sektor yang valid.')
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('jemaat_keluarga')
    .update({ nama_keluarga, sektor, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    throw new Error(`Gagal memperbarui jemaat: ${error.message}`)
  }

  revalidatePath('/master-data/jemaat')
}

/**
 * Soft delete: hanya memperbarui is_active — TIDAK PERNAH melakukan DELETE SQL.
 * Prinsip integritas data historis: baris lama yang direferensikan Warta/Tingting
 * harus tetap ada di database agar riwayat tidak rusak.
 */
export async function toggleActiveJemaat(id: string, newStatus: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('jemaat_keluarga')
    .update({ is_active: newStatus, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    throw new Error(`Gagal mengubah status jemaat: ${error.message}`)
  }

  revalidatePath('/master-data/jemaat')
}
