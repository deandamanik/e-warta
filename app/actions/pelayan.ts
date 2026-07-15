'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * Mengambil semua baris pelayan_gereja (aktif dan nonaktif),
 * diurutkan berdasarkan nama_pelayan asc.
 * Jika `search` diisi, filter menggunakan ilike pada nama_pelayan.
 */
export async function listPelayan(search?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('pelayan_gereja')
    .select('*')
    .order('nama_pelayan', { ascending: true })

  if (search && search.trim() !== '') {
    query = query.ilike('nama_pelayan', `%${search.trim()}%`)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Gagal mengambil data pelayan: ${error.message}`)
  }

  return data ?? []
}

/**
 * Menambahkan baris baru ke pelayan_gereja.
 * nama_pelayan wajib diisi; gelar bersifat opsional.
 */
export async function createPelayan(formData: FormData) {
  const nama_pelayan = (formData.get('nama_pelayan') as string | null)?.trim()
  const gelar = (formData.get('gelar') as string | null)?.trim() || null

  if (!nama_pelayan) {
    throw new Error('Nama pelayan wajib diisi.')
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('pelayan_gereja')
    .insert({ nama_pelayan, gelar })

  if (error) {
    throw new Error(`Gagal menambahkan pelayan: ${error.message}`)
  }

  revalidatePath('/master-data/pelayan')
}

/**
 * Memperbarui nama_pelayan dan gelar pada baris yang ditentukan oleh id.
 */
export async function updatePelayan(id: string, formData: FormData) {
  const nama_pelayan = (formData.get('nama_pelayan') as string | null)?.trim()
  const gelar = (formData.get('gelar') as string | null)?.trim() || null

  if (!nama_pelayan) {
    throw new Error('Nama pelayan wajib diisi.')
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('pelayan_gereja')
    .update({ nama_pelayan, gelar, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    throw new Error(`Gagal memperbarui pelayan: ${error.message}`)
  }

  revalidatePath('/master-data/pelayan')
}

/**
 * Soft delete: hanya memperbarui is_active — TIDAK PERNAH melakukan DELETE SQL.
 * Prinsip integritas data historis: baris lama yang direferensikan Warta/Tingting
 * harus tetap ada di database agar riwayat tidak rusak.
 */
export async function toggleActivePelayan(id: string, newStatus: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pelayan_gereja')
    .update({ is_active: newStatus, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    throw new Error(`Gagal mengubah status pelayan: ${error.message}`)
  }

  revalidatePath('/master-data/pelayan')
}
