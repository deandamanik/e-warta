'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { WartaDraftState, KehadiranItemDraft } from '@/lib/types/warta-draft'
import { subDays, format } from 'date-fns'
import { id } from 'date-fns/locale'

interface Step2KehadiranProps {
  state: WartaDraftState
  dispatch: React.Dispatch<any>
}

const DEFAULT_PRESETS = [
  'Sikolah Minggu',
  'Remaja',
  'Kebaktian Pagi',
  'Kebaktian Siang',
  'PA Seksi Inang Jemaat'
]

export default function Step2Kehadiran({ state, dispatch }: Step2KehadiranProps) {
  let teksMingguLalu = "Kehadiran Jemaat (Minggu Lalu)"
  
  if (state.tanggalIbadah) {
    try {
      const tglMinggu = new Date(state.tanggalIbadah)
      if (!isNaN(tglMinggu.getTime())) {
        const tglMingguLalu = subDays(tglMinggu, 7)
        teksMingguLalu = `Kehadiran Jemaat — Minggu Lalu (${format(tglMingguLalu, 'd MMMM yyyy', { locale: id })})`
      }
    } catch (e) {
      // fallback
    }
  }

  // Populasi otomatis saat pertama kali dibuka jika masih kosong
  useEffect(() => {
    if ((state.kehadiranItems || []).length === 0) {
      const newItems: KehadiranItemDraft[] = DEFAULT_PRESETS.map((uraian) => ({
        localId: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
        tanggal: '',
        uraian,
        lk: 0,
        pr: 0,
      }))
      dispatch({ type: 'SET_FIELD', field: 'kehadiranItems', value: newItems })
    }
  }, [(state.kehadiranItems || []).length, dispatch])

  const handleAdd = () => {
    const newItem: KehadiranItemDraft = {
      localId: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      tanggal: '',
      uraian: '',
      lk: 0,
      pr: 0,
    }
    dispatch({ type: 'ADD_KEHADIRAN_ITEM', item: newItem })
  }

  const handleUpdate = (index: number, field: keyof KehadiranItemDraft, value: any) => {
    let parsedValue = value
    
    if (field === 'lk' || field === 'pr') {
      if (value === '') {
        parsedValue = ''
      } else {
        parsedValue = parseInt(value, 10)
        if (isNaN(parsedValue)) parsedValue = 0
      }
    }

    const item = { ...(state.kehadiranItems || [])[index], [field]: parsedValue }
    dispatch({ type: 'UPDATE_KEHADIRAN_ITEM', index, item })
  }

  const handleRemove = (index: number) => {
    dispatch({ type: 'REMOVE_KEHADIRAN_ITEM', index })
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <motion.div 
        className="border-2 border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col w-full"
      >
        <div className="bg-slate-100 border-b-2 border-slate-300 px-6 py-4 flex items-center">
          <Users className="w-6 h-6 mr-3 text-slate-700" />
          <h3 className="text-xl font-bold text-slate-800">{teksMingguLalu}</h3>
        </div>
        
        <div className="p-6">
          <div className="w-full overflow-x-auto pb-4">
            <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y-2 border-slate-300">
                <th className="py-3 px-4 text-left font-bold text-slate-700 w-1/5">Tanggal</th>
                <th className="py-3 px-4 text-left font-bold text-slate-700 w-1/3">Uraian</th>
                <th className="py-3 px-4 text-center font-bold text-slate-700 w-32">Lk</th>
                <th className="py-3 px-4 text-center font-bold text-slate-700 w-32">Pr</th>
                <th className="py-3 px-4 text-center font-bold text-slate-700 w-32">Jlh Hadir</th>
                <th className="py-3 px-4 text-center font-bold text-slate-700 w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(state.kehadiranItems || []).map((item, index) => {
                const jlhHadir = (Number(item.lk) || 0) + (Number(item.pr) || 0)
                
                return (
                  <tr key={item.localId} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <Input
                        type="date"
                        value={item.tanggal || ''}
                        onChange={(e) => handleUpdate(index, 'tanggal', e.target.value)}
                        className="w-full h-12 text-sm border-2 border-slate-400 font-medium"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        type="text"
                        placeholder="Contoh: Kebaktian Pagi"
                        value={item.uraian}
                        onChange={(e) => handleUpdate(index, 'uraian', e.target.value)}
                        className="w-full h-12 text-sm border-2 border-slate-400 font-medium"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        type="number"
                        min={0}
                        value={item.lk !== null && item.lk !== undefined ? item.lk : ''}
                        onChange={(e) => handleUpdate(index, 'lk', e.target.value)}
                        className="w-full h-12 text-sm border-2 border-slate-400 font-bold text-center"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        type="number"
                        min={0}
                        value={item.pr !== null && item.pr !== undefined ? item.pr : ''}
                        onChange={(e) => handleUpdate(index, 'pr', e.target.value)}
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
                        onClick={() => handleRemove(index)}
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
              onClick={handleAdd}
              className="border-2 border-slate-300 text-slate-800 font-bold h-12 px-6 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Baris Kehadiran
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
