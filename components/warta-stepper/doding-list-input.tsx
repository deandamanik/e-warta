'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DodingItemDraft } from '@/lib/types/warta-draft'

interface DodingListInputProps {
  items: DodingItemDraft[]
  dispatch: React.Dispatch<any>
}

export default function DodingListInput({ items, dispatch }: DodingListInputProps) {
  const handleAdd = () => {
    const newItem: DodingItemDraft = {
      localId: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      nomorLagu: '',
      notasiBait: '',
    }
    dispatch({ type: 'ADD_DODING_ITEM', item: newItem })
  }

  const handleUpdate = (index: number, field: keyof DodingItemDraft, value: string) => {
    const item = { ...(items || [])[index], [field]: value }
    dispatch({ type: 'UPDATE_DODING_ITEM', index, item })
  }

  const handleRemove = (index: number) => {
    const isProsesi = index === 0
    const isGalangan = index === (items || []).length - 1

    if (isProsesi || isGalangan) {
      // Jangan hapus elemen dari array, cukup kosongkan nilainya
      const clearedItem = { ...(items || [])[index], nomorLagu: '', notasiBait: '' }
      dispatch({ type: 'UPDATE_DODING_ITEM', index, item: clearedItem })
      return
    }

    dispatch({ type: 'REMOVE_DODING_ITEM', index })
  }

  return (
    <div className="flex flex-col gap-4">
      {(items || []).length === 0 && (
        <p className="text-slate-500 italic text-base">Belum ada lagu ditambahkan.</p>
      )}

      {(items || []).map((item, index) => {
        const isProsesi = index === 0
        const isGalangan = index === (items || []).length - 1

        return (
          <div key={item.localId} className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              {/* LABEL DINAMIS (BR-03) */}
              <span className="text-lg text-slate-700 whitespace-nowrap min-w-[140px]">
                {isProsesi ? (
                  <><b>Prosesi:</b> Hal No.</>
                ) : isGalangan ? (
                  <><b>Galangan:</b> Hal No.</>
                ) : (
                  <><span className="inline-block w-6 text-right pr-1">{index}.</span> Hal No.</>
                )}
              </span>
              
              <Input
                placeholder="Contoh: 15"
                value={item.nomorLagu}
                onChange={(e) => handleUpdate(index, 'nomorLagu', e.target.value)}
                className="h-12 text-sm border-2 border-slate-400 font-medium"
              />
            </div>

            <div className="flex items-center gap-4 flex-1">
              <Input
                placeholder="Notasi Bait (Contoh: 1 - 2)"
                value={item.notasiBait}
                onChange={(e) => handleUpdate(index, 'notasiBait', e.target.value)}
                className="h-12 text-sm border-2 border-slate-400 font-medium"
              />
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRemove(index)}
                title={isProsesi || isGalangan ? "Kosongkan isian" : "Hapus baris doding"}
                className="flex items-center justify-center h-12 w-[100px] flex-shrink-0 rounded-md border-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-red-300 bg-red-100 text-red-700 hover:bg-red-200 hover:border-red-500"
              >
                <Trash2 className="w-4 h-4 mr-2 shrink-0" />
                <span className="text-sm">Hapus</span>
              </motion.button>
            </div>
          </div>
        )
      })}

      <div className="pt-2">
        <Button
          variant="outline"
          onClick={handleAdd}
          className="border-2 border-slate-300 text-slate-800 font-bold h-12 px-6 text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Baris Doding
        </Button>
      </div>
    </div>
  )
}
