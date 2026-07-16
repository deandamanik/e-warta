'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Home, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SEKTOR_LIST, Sektor } from '@/lib/constants'
import { listJemaatAktif } from '@/app/actions/jemaat'
import { WartaDraftState, PartonggoanKehadiranDraft, PartonggoanJadwalDraft } from '@/lib/types/warta-draft'
import PelayanSelect from './pelayan-select'

interface JemaatItem {
  id: string
  nama_keluarga: string
  sektor: Sektor
}

interface Step3PartonggoanProps {
  state: WartaDraftState
  dispatch: React.Dispatch<any>
}

export default function Step3Partonggoan({ state, dispatch }: Step3PartonggoanProps) {
  const [families, setFamilies] = useState<JemaatItem[]>([])

  useEffect(() => {
    let mounted = true
    async function fetchFamilies() {
      try {
        const data = await listJemaatAktif()
        if (mounted) {
          setFamilies(data as JemaatItem[])
        }
      } catch (err) {
        console.error('Gagal memuat daftar jemaat:', err)
      }
    }
    fetchFamilies()
    return () => { mounted = false }
  }, [])

  // ==============================
  // HANDLERS FOR KEHADIRAN (MINGGU BERJALAN)
  // ==============================
  const handleAddKehadiran = () => {
    const newItem: PartonggoanKehadiranDraft = {
      localId: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      sektor: 'I',
      keluargaId: null,
      lk: 0,
      pr: 0
    }
    dispatch({ type: 'ADD_PARTONGGOAN_KEHADIRAN', item: newItem })
  }

  const handleUpdateKehadiran = (index: number, field: keyof PartonggoanKehadiranDraft, value: any) => {
    const item = { ...(state.partonggoanKehadiran || [])[index] }
    if (field === 'sektor') {
      item.sektor = value
      item.keluargaId = null // WAJIB reset Ianan/Rumah ke kosong
    } else if (field === 'keluargaId') {
      item.keluargaId = value === 'NONE' ? null : value
    } else if (field === 'lk' || field === 'pr') {
      const num = parseInt(value, 10)
      item[field] = isNaN(num) ? 0 : num
    } else {
      (item as any)[field] = value
    }
    dispatch({ type: 'UPDATE_PARTONGGOAN_KEHADIRAN', index, item })
  }

  const handleRemoveKehadiran = (index: number) => {
    dispatch({ type: 'REMOVE_PARTONGGOAN_KEHADIRAN', index })
  }

  // ==============================
  // HANDLERS FOR JADWAL (MINGGU DEPAN)
  // ==============================
  const handleAddJadwal = () => {
    const newItem: PartonggoanJadwalDraft = {
      localId: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      sektor: 'I',
      keluargaId: null,
      parAmbilanId: null,
      parAgendaId: null
    }
    dispatch({ type: 'ADD_PARTONGGOAN_JADWAL', item: newItem })
  }

  const handleUpdateJadwal = (index: number, field: keyof PartonggoanJadwalDraft, value: any) => {
    const item = { ...(state.partonggoanJadwal || [])[index] }
    if (field === 'sektor') {
      item.sektor = value
      item.keluargaId = null // reset
    } else if (field === 'keluargaId') {
      item.keluargaId = value === 'NONE' ? null : value
    } else {
      (item as any)[field] = value
    }
    dispatch({ type: 'UPDATE_PARTONGGOAN_JADWAL', index, item })
  }

  const handleRemoveJadwal = (index: number) => {
    dispatch({ type: 'REMOVE_PARTONGGOAN_JADWAL', index })
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* SUB-BLOK 1: KEHADIRAN PARTONGGOAN */}
      <motion.div 
        className="border-2 border-slate-300 rounded-xl overflow-x-auto bg-white shadow-sm flex flex-col w-full"
      >
        <div className="bg-slate-100 border-b-2 border-slate-300 px-6 py-4 flex items-center min-w-[800px]">
          <Home className="w-6 h-6 mr-3 text-slate-700" />
          <h3 className="text-xl font-bold text-slate-800">Kehadiran Partonggoan — Minggu Berjalan</h3>
        </div>
        
        <div className="p-6">
          <div className="w-full overflow-x-auto pb-4">
            <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y-2 border-slate-300">
                <th className="py-3 px-4 text-left font-bold text-slate-700 w-32">Sektor</th>
                <th className="py-3 px-4 text-left font-bold text-slate-700 w-1/3">Ianan/Rumah</th>
                <th className="py-3 px-4 text-center font-bold text-slate-700 w-32">Lk</th>
                <th className="py-3 px-4 text-center font-bold text-slate-700 w-32">Pr</th>
                <th className="py-3 px-4 text-center font-bold text-slate-700 w-32">Jlh Hadir</th>
                <th className="py-3 px-4 text-center font-bold text-slate-700 w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(state.partonggoanKehadiran || []).length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500 italic text-base">
                    Belum ada data kehadiran partonggoan.
                  </td>
                </tr>
              )}
              {(state.partonggoanKehadiran || []).map((item, index) => {
                const availableFamilies = families.filter(f => f.sektor === item.sektor)
                const jlhHadir = (Number(item.lk) || 0) + (Number(item.pr) || 0)
                
                const selectedFamily = availableFamilies.find(f => f.id === item.keluargaId)
                let displayKeluarga: string | undefined = undefined
                if (item.keluargaId && item.keluargaId !== 'NONE') {
                  displayKeluarga = selectedFamily ? selectedFamily.nama_keluarga : (families.length === 0 ? 'Memuat...' : item.keluargaId)
                }
                
                return (
                  <tr key={item.localId} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <Select value={item.sektor} onValueChange={(val) => handleUpdateKehadiran(index, 'sektor', val)}>
                        <SelectTrigger className="w-full !h-12 border-2 border-slate-400 font-bold text-sm bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent ref={(ref) => { if (ref) ref.style.position = 'absolute'; }} align="start" side="bottom" sideOffset={4} className="max-h-[300px] overflow-y-auto">
                          {SEKTOR_LIST.map(s => (
                            <SelectItem key={s} value={s} className="text-sm font-bold py-2">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4">
                      <Select value={item.keluargaId || 'NONE'} onValueChange={(val) => handleUpdateKehadiran(index, 'keluargaId', val)}>
                        <SelectTrigger className="w-full !h-12 border-2 border-slate-400 font-medium text-sm bg-white">
                          <SelectValue placeholder="— Pilih Keluarga —">
                            {displayKeluarga}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent ref={(ref) => { if (ref) ref.style.position = 'absolute'; }} align="start" side="bottom" sideOffset={4} className="max-h-[300px] overflow-y-auto">
                          <SelectItem value="NONE" className="text-sm font-medium italic py-2">— Pilih Keluarga —</SelectItem>
                          {availableFamilies.map(f => (
                            <SelectItem key={f.id} value={f.id} className="text-sm font-medium py-2">
                              {f.nama_keluarga}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        type="number"
                        min={0}
                        value={item.lk === 0 ? '' : item.lk}
                        onChange={(e) => handleUpdateKehadiran(index, 'lk', e.target.value)}
                        className="w-full h-12 text-sm border-2 border-slate-400 font-bold text-center"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        type="number"
                        min={0}
                        value={item.pr === 0 ? '' : item.pr}
                        onChange={(e) => handleUpdateKehadiran(index, 'pr', e.target.value)}
                        className="w-full h-12 text-sm border-2 border-slate-400 font-bold text-center"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full h-12 flex items-center justify-center bg-slate-200 border-2 border-slate-300 rounded-md text-xl font-extrabold text-slate-900">
                        {jlhHadir}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemoveKehadiran(index)}
                        title="Hapus baris ini"
                        className="flex items-center justify-center h-12 w-full rounded-md border-2 border-red-300 bg-red-100 text-red-700 hover:bg-red-200 hover:border-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            </table>
          </div>

          <div className="pt-6">
            <Button
              variant="outline"
              onClick={handleAddKehadiran}
              className="border-2 border-slate-300 text-slate-800 font-bold h-12 px-6 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Baris Kehadiran
            </Button>
          </div>
        </div>
      </motion.div>

      <Separator className="border-2 border-slate-200" />

      {/* SUB-BLOK 2: JADWAL IANAN & SIPARTUGAS */}
      <motion.div 
        className="border-2 border-slate-300 rounded-xl overflow-x-auto bg-white shadow-sm flex flex-col w-full"
      >
        <div className="bg-slate-100 border-b-2 border-slate-300 px-6 py-4 flex items-center min-w-[800px]">
          <Calendar className="w-6 h-6 mr-3 text-slate-700" />
          <h3 className="text-xl font-bold text-slate-800">Jadwal Ianan & Sipartugas — Minggu Depan</h3>
        </div>
        
        <div className="p-6">
          <div className="w-full overflow-x-auto pb-4">
            <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y-2 border-slate-300">
                <th className="py-3 px-4 text-left font-bold text-slate-700 w-32">Sektor</th>
                <th className="py-3 px-4 text-left font-bold text-slate-700 w-1/4">Ianan/Rumah</th>
                <th className="py-3 px-4 text-left font-bold text-slate-700 w-1/4">Par-Ambilan</th>
                <th className="py-3 px-4 text-left font-bold text-slate-700 w-1/4">Par-Agenda</th>
                <th className="py-3 px-4 text-center font-bold text-slate-700 w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(state.partonggoanJadwal || []).length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 italic text-base">
                    Belum ada data jadwal partonggoan minggu depan.
                  </td>
                </tr>
              )}
              {(state.partonggoanJadwal || []).map((item, index) => {
                const availableFamilies = families.filter(f => f.sektor === item.sektor)
                
                const selectedFamily = availableFamilies.find(f => f.id === item.keluargaId)
                let displayKeluarga: string | undefined = undefined
                if (item.keluargaId && item.keluargaId !== 'NONE') {
                  displayKeluarga = selectedFamily ? selectedFamily.nama_keluarga : (families.length === 0 ? 'Memuat...' : item.keluargaId)
                }
                
                return (
                  <tr key={item.localId} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <Select value={item.sektor} onValueChange={(val) => handleUpdateJadwal(index, 'sektor', val)}>
                        <SelectTrigger className="w-full !h-12 border-2 border-slate-400 font-bold text-sm bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent ref={(ref) => { if (ref) ref.style.position = 'absolute'; }} align="start" side="bottom" sideOffset={4} className="max-h-[300px] overflow-y-auto">
                          {SEKTOR_LIST.map(s => (
                            <SelectItem key={s} value={s} className="text-sm font-bold py-2">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4">
                      <Select value={item.keluargaId || 'NONE'} onValueChange={(val) => handleUpdateJadwal(index, 'keluargaId', val)}>
                        <SelectTrigger className="w-full !h-12 border-2 border-slate-400 font-medium text-sm bg-white">
                          <SelectValue placeholder="— Pilih Keluarga —">
                            {displayKeluarga}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent ref={(ref) => { if (ref) ref.style.position = 'absolute'; }} align="start" side="bottom" sideOffset={4} className="max-h-[300px] overflow-y-auto">
                          <SelectItem value="NONE" className="text-sm font-medium italic py-2">— Pilih Keluarga —</SelectItem>
                          {availableFamilies.map(f => (
                            <SelectItem key={f.id} value={f.id} className="text-sm font-medium py-2">
                              {f.nama_keluarga}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="-mt-2 w-full">
                        <PelayanSelect
                          label=""
                          value={item.parAmbilanId}
                          onChange={(val) => handleUpdateJadwal(index, 'parAmbilanId', val)}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="-mt-2 w-full">
                        <PelayanSelect
                          label=""
                          value={item.parAgendaId}
                          onChange={(val) => handleUpdateJadwal(index, 'parAgendaId', val)}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemoveJadwal(index)}
                        title="Hapus baris ini"
                        className="flex items-center justify-center h-12 w-full rounded-md border-2 border-red-300 bg-red-100 text-red-700 hover:bg-red-200 hover:border-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            </table>
          </div>

          <div className="pt-6">
            <Button
              variant="outline"
              onClick={handleAddJadwal}
              className="border-2 border-slate-300 text-slate-800 font-bold h-12 px-6 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Baris Jadwal
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
