'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, CalendarFold, Music, Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import PelayanSelect from './pelayan-select'
import DodingListInput from './doding-list-input'
import { WartaDraftState } from '@/lib/types/warta-draft'

interface Step1JadwalPelayanProps {
  state: WartaDraftState
  dispatch: React.Dispatch<any>
}

export default function Step1JadwalPelayan({ state, dispatch }: Step1JadwalPelayanProps) {
  const handleChange = (field: keyof WartaDraftState, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value })
  }

  const handleAddJam = (field: 'parmasukPukul' | 'nextParmasukPukul') => {
    dispatch({ type: 'SET_FIELD', field, value: [...(state[field] || []), ''] })
  }

  const handleUpdateJam = (field: 'parmasukPukul' | 'nextParmasukPukul', index: number, val: string) => {
    const newArr = [...(state[field] || [])]
    newArr[index] = val
    dispatch({ type: 'SET_FIELD', field, value: newArr })
  }

  const handleRemoveJam = (field: 'parmasukPukul' | 'nextParmasukPukul', index: number) => {
    const newArr = (state[field] || []).filter((_, i) => i !== index)
    dispatch({ type: 'SET_FIELD', field, value: newArr })
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* BLOK A - Minggu Berjalan */}
        <motion.div 
          className="border-2 border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col w-full"
        >
          <div className="bg-slate-100 border-b-2 border-slate-300 px-6 py-4 flex items-center">
            <CalendarDays className="w-6 h-6 mr-3 text-slate-700" />
            <h3 className="text-xl font-bold text-slate-800">Ibadah Minggu Berjalan</h3>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-lg font-bold text-slate-800">Goran Minggu *</Label>
              <Input 
                value={state.goranMinggu || ""} 
                onChange={(e) => handleChange('goranMinggu', e.target.value)} 
                className="h-12 text-lg border-2 border-slate-400" 
                placeholder="Contoh: Quasimodogeniti"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label className="text-lg font-bold text-slate-800">Model Kebaktian</Label>
              <Input 
                value={state.modelKebaktian || ""} 
                onChange={(e) => handleChange('modelKebaktian', e.target.value)} 
                className="h-12 text-lg border-2 border-slate-400" 
                placeholder="Contoh: Umum / Paduan Suara"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label className="text-lg font-bold text-slate-800">Warna Liturgi</Label>
              <Input 
                value={state.warnaLiturgi || ""} 
                onChange={(e) => handleChange('warnaLiturgi', e.target.value)} 
                className="h-12 text-lg border-2 border-slate-400" 
                placeholder="Contoh: Putih"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label className="text-lg font-bold text-slate-800">Ambilan</Label>
              <Input 
                value={state.ambilan || ""} 
                onChange={(e) => handleChange('ambilan', e.target.value)} 
                className="h-12 text-lg border-2 border-slate-400" 
                placeholder="Ayat Ambilan"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label className="text-lg font-bold text-slate-800">Sibasaon</Label>
              <Input 
                value={state.sibasaon || ""} 
                onChange={(e) => handleChange('sibasaon', e.target.value)} 
                className="h-12 text-lg border-2 border-slate-400" 
                placeholder="Ayat Sibasaon"
              />
            </div>

            <div className="h-px bg-slate-200 w-full my-2"></div>

            <PelayanSelect 
              label="Par-Ambilan 1" 
              value={state.parAmbilan1Id} 
              onChange={(v) => handleChange('parAmbilan1Id', v)} 
            />
            <PelayanSelect 
              label="Par-Ambilan 2" 
              value={state.parAmbilan2Id} 
              onChange={(v) => handleChange('parAmbilan2Id', v)} 
            />
            <PelayanSelect 
              label="Sipangidangi Pagi" 
              value={state.sipangidangiPagiId} 
              onChange={(v) => handleChange('sipangidangiPagiId', v)} 
            />
            <PelayanSelect 
              label="Sipangidangi Siang" 
              value={state.sipangidangiSiangId} 
              onChange={(v) => handleChange('sipangidangiSiangId', v)} 
            />
            <PelayanSelect 
              label="Par-Organ Pagi" 
              value={state.parOrganPagiId} 
              onChange={(v) => handleChange('parOrganPagiId', v)} 
            />
            <PelayanSelect 
              label="Par-Organ Siang" 
              value={state.parOrganSiangId} 
              onChange={(v) => handleChange('parOrganSiangId', v)} 
            />

            <div className="flex flex-col gap-2 border-t-2 border-slate-200 pt-5 mt-2">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-lg font-bold text-slate-800">Jam Masuk (Parmasuk Pukul)</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddJam('parmasukPukul')}
                  className="border-2 border-slate-300 text-slate-700 font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah
                </Button>
              </div>
              {(state.parmasukPukul || []).length === 0 && (
                <p className="text-slate-500 italic text-base">Belum ada jam ibadah ditambahkan.</p>
              )}
              {(state.parmasukPukul || []).map((jam, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Input 
                    type="time" 
                    value={jam || ""} 
                    onChange={(e) => handleUpdateJam('parmasukPukul', idx, e.target.value)}
                    className="h-12 text-lg border-2 border-slate-400 flex-1"
                  />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-12 w-12 border-2 border-red-300 hover:border-red-600 shrink-0 bg-red-100 hover:bg-red-200 text-red-700"
                    onClick={() => handleRemoveJam('parmasukPukul', idx)}
                    title="Hapus Jam"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* BLOK B - Minggu Depan */}
        <motion.div 
          className="border-2 border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col w-full h-fit"
        >
          <div className="bg-slate-100 border-b-2 border-slate-300 px-6 py-4 flex items-center">
            <CalendarFold className="w-6 h-6 mr-3 text-slate-700" />
            <h3 className="text-xl font-bold text-slate-800">Ringkasan Minggu Depan</h3>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-lg font-bold text-slate-800">Model Kebaktian</Label>
              <Input 
                value={state.nextModelKebaktian || ""} 
                onChange={(e) => handleChange('nextModelKebaktian', e.target.value)} 
                className="h-12 text-lg border-2 border-slate-400" 
                placeholder="Contoh: Umum / Paduan Suara"
              />
            </div>
            
            <div className="h-px bg-slate-200 w-full my-2"></div>

            <PelayanSelect 
              label="Par-Ambilan 1" 
              value={state.nextParAmbilan1Id} 
              onChange={(v) => handleChange('nextParAmbilan1Id', v)} 
            />
            <PelayanSelect 
              label="Par-Ambilan 2" 
              value={state.nextParAmbilan2Id} 
              onChange={(v) => handleChange('nextParAmbilan2Id', v)} 
            />
            <PelayanSelect 
              label="Sipangidangi Pagi" 
              value={state.nextSipangidangiPagiId} 
              onChange={(v) => handleChange('nextSipangidangiPagiId', v)} 
            />
            <PelayanSelect 
              label="Sipangidangi Siang" 
              value={state.nextSipangidangiSiangId} 
              onChange={(v) => handleChange('nextSipangidangiSiangId', v)} 
            />
            <PelayanSelect 
              label="Par-Organ Pagi" 
              value={state.nextParOrganPagiId} 
              onChange={(v) => handleChange('nextParOrganPagiId', v)} 
            />
            <PelayanSelect 
              label="Par-Organ Siang" 
              value={state.nextParOrganSiangId} 
              onChange={(v) => handleChange('nextParOrganSiangId', v)} 
            />

            <div className="flex flex-col gap-2 border-t-2 border-slate-200 pt-5 mt-2">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-lg font-bold text-slate-800">Jam Masuk (Parmasuk Pukul)</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddJam('nextParmasukPukul')}
                  className="border-2 border-slate-300 text-slate-700 font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah
                </Button>
              </div>
              {(state.nextParmasukPukul || []).length === 0 && (
                <p className="text-slate-500 italic text-base">Belum ada jam ibadah ditambahkan.</p>
              )}
              {(state.nextParmasukPukul || []).map((jam, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Input 
                    type="time" 
                    value={jam || ""} 
                    onChange={(e) => handleUpdateJam('nextParmasukPukul', idx, e.target.value)}
                    className="h-12 text-lg border-2 border-slate-400 flex-1"
                  />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-12 w-12 border-2 border-red-300 hover:border-red-600 shrink-0 bg-red-100 hover:bg-red-200 text-red-700"
                    onClick={() => handleRemoveJam('nextParmasukPukul', idx)}
                    title="Hapus Jam"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* BLOK C - Nomor Doding */}
      <motion.div 
        className="border-2 border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col w-full"
      >
        <div className="bg-slate-100 border-b-2 border-slate-300 px-6 py-4 flex items-center">
          <Music className="w-6 h-6 mr-3 text-slate-700" />
          <h3 className="text-xl font-bold text-slate-800">Nomor Doding</h3>
        </div>
        <div className="p-6">
          <DodingListInput items={state.dodingItems} dispatch={dispatch} />
        </div>
      </motion.div>
    </div>
  )
}
