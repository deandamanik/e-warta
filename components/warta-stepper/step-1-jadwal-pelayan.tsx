'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, CalendarFold, Music, Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PelayanSelect from './pelayan-select'
import DodingListInput from './doding-list-input'
import { WartaDraftState } from '@/lib/types/warta-draft'

const MODEL_KEBAKTIAN_OPTIONS = [
  "Tata Ibadah & A",
  "Tata Ibadah & B",
  "Tata Ibadah & C",
  "Tata Ibadah & D",
  "Tata Ibadah & E"
]

const WARNA_LITURGI_OPTIONS = [
  "Hatirongga",
  "Silopak",
  "Siratah",
  "Sigerger",
  "Sibirong"
]

interface Step1JadwalPelayanProps {
  state: WartaDraftState
  dispatch: React.Dispatch<any>
}

const formatTanggalIndo = (dateStr?: string | null, addDaysCount = 0) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    d.setDate(d.getDate() + addDaysCount);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) {
    return '';
  }
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch w-full">
        {/* BLOK A - Minggu Berjalan */}
        <motion.div 
          className="border-2 border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col w-full h-full"
        >
          <div className="bg-slate-100 border-b-2 border-slate-300 px-6 py-4 flex items-center">
            <CalendarDays className="w-6 h-6 mr-3 text-slate-700" />
            <h3 className="text-xl font-bold text-slate-800">
              Ibadah Minggu Berjalan {formatTanggalIndo(state.tanggalIbadah) ? `(${formatTanggalIndo(state.tanggalIbadah)})` : ''}
            </h3>
          </div>
          <div className="p-6 flex flex-col gap-5 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-bold text-slate-800">Goran Minggu *</Label>
                <Input 
                  value={state.goranMinggu || ""} 
                  onChange={(e) => handleChange('goranMinggu', e.target.value)} 
                  className="h-12 text-sm font-medium border-2 border-slate-400" 
                  placeholder="Contoh: Quasimodogeniti"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-bold text-slate-800">Tema Minggu</Label>
                <Input 
                  value={state.tema_minggu || ""} 
                  onChange={(e) => handleChange('tema_minggu', e.target.value)} 
                  className="h-12 text-sm font-medium border-2 border-slate-400" 
                  placeholder="Contoh: Marsiurupan"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-bold text-slate-800">Model Kebaktian</Label>
                <Select 
                  value={state.modelKebaktian || undefined} 
                  onValueChange={(val) => handleChange('modelKebaktian', val)}
                >
                  <SelectTrigger className="w-full !h-12 text-sm border-2 border-slate-400 font-medium bg-white">
                    <SelectValue placeholder="— Pilih Model Kebaktian —" />
                  </SelectTrigger>
                  <SelectContent ref={(ref) => { if (ref) ref.style.position = 'absolute'; }} align="start" side="bottom" sideOffset={4} className="max-h-[300px] overflow-y-auto">
                    {MODEL_KEBAKTIAN_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option} className="text-sm font-medium py-2">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-bold text-slate-800">Warna Liturgi</Label>
                <Select 
                  value={state.warnaLiturgi || undefined} 
                  onValueChange={(val) => handleChange('warnaLiturgi', val)}
                >
                  <SelectTrigger className="w-full !h-12 text-sm border-2 border-slate-400 font-medium bg-white">
                    <SelectValue placeholder="— Pilih Warna Liturgi —" />
                  </SelectTrigger>
                  <SelectContent ref={(ref) => { if (ref) ref.style.position = 'absolute'; }} align="start" side="bottom" sideOffset={4} className="max-h-[300px] overflow-y-auto">
                    {WARNA_LITURGI_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option} className="text-sm font-medium py-2">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-bold text-slate-800">Ambilan</Label>
                <Input 
                  value={state.ambilan || ""} 
                  onChange={(e) => handleChange('ambilan', e.target.value)} 
                  className="h-12 text-sm font-medium border-2 border-slate-400" 
                  placeholder="Ayat Ambilan"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-bold text-slate-800">Sibasaon</Label>
                <Input 
                  value={state.sibasaon || ""} 
                  onChange={(e) => handleChange('sibasaon', e.target.value)} 
                  className="h-12 text-sm font-medium border-2 border-slate-400" 
                  placeholder="Ayat Sibasaon"
                />
              </div>
            </div>

            <div className="h-px bg-slate-200 w-full my-2"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PelayanSelect 
                label="Par-Ambilan 1" 
                value={state.parAmbilan1Id} 
                onChange={(v) => handleChange('parAmbilan1Id', v)} 
                roleFilter="par-ambilan"
              />
              <PelayanSelect 
                label="Par-Ambilan 2" 
                value={state.parAmbilan2Id} 
                onChange={(v) => handleChange('parAmbilan2Id', v)} 
                roleFilter="par-ambilan"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PelayanSelect 
                label="Sipangidangi Pagi" 
                value={state.sipangidangiPagiId} 
                onChange={(v) => handleChange('sipangidangiPagiId', v)} 
                roleFilter="sipangidangi"
              />
              <PelayanSelect 
                label="Sipangidangi Siang" 
                value={state.sipangidangiSiangId} 
                onChange={(v) => handleChange('sipangidangiSiangId', v)} 
                roleFilter="sipangidangi"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PelayanSelect 
                label="Par-Organ Pagi" 
                value={state.parOrganPagiId} 
                onChange={(v) => handleChange('parOrganPagiId', v)} 
                roleFilter="par-organ"
              />
              <PelayanSelect 
                label="Par-Organ Siang" 
                value={state.parOrganSiangId} 
                onChange={(v) => handleChange('parOrganSiangId', v)} 
                roleFilter="par-organ"
              />
            </div>
          </div>
        </motion.div>

        {/* BLOK B - Minggu Depan */}
        <motion.div 
          className="border-2 border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col w-full h-full"
        >
          <div className="bg-slate-100 border-b-2 border-slate-300 px-6 py-4 flex items-center">
            <CalendarFold className="w-6 h-6 mr-3 text-slate-700" />
            <h3 className="text-xl font-bold text-slate-800">
              Ringkasan Minggu Depan {formatTanggalIndo(state.tanggalIbadah, 7) ? `(${formatTanggalIndo(state.tanggalIbadah, 7)})` : ''}
            </h3>
          </div>
          <div className="p-6 flex flex-col gap-5 flex-1">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-bold text-slate-800">Model Kebaktian</Label>
              <Select 
                value={state.nextModelKebaktian || undefined} 
                onValueChange={(val) => handleChange('nextModelKebaktian', val)}
              >
                <SelectTrigger className="w-full !h-12 text-sm border-2 border-slate-400 font-medium bg-white">
                  <SelectValue placeholder="— Pilih Model Kebaktian —" />
                </SelectTrigger>
                <SelectContent ref={(ref) => { if (ref) ref.style.position = 'absolute'; }} align="start" side="bottom" sideOffset={4} className="max-h-[300px] overflow-y-auto">
                  {MODEL_KEBAKTIAN_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option} className="text-sm font-medium py-2">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="h-px bg-slate-200 w-full my-2"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PelayanSelect 
                label="Par-Ambilan 1" 
                value={state.nextParAmbilan1Id} 
                onChange={(v) => handleChange('nextParAmbilan1Id', v)} 
                roleFilter="par-ambilan"
              />
              <PelayanSelect 
                label="Par-Ambilan 2" 
                value={state.nextParAmbilan2Id} 
                onChange={(v) => handleChange('nextParAmbilan2Id', v)} 
                roleFilter="par-ambilan"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PelayanSelect 
                label="Sipangidangi Pagi" 
                value={state.nextSipangidangiPagiId} 
                onChange={(v) => handleChange('nextSipangidangiPagiId', v)} 
                roleFilter="sipangidangi"
              />
              <PelayanSelect 
                label="Sipangidangi Siang" 
                value={state.nextSipangidangiSiangId} 
                onChange={(v) => handleChange('nextSipangidangiSiangId', v)} 
                roleFilter="sipangidangi"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PelayanSelect 
                label="Par-Organ Pagi" 
                value={state.nextParOrganPagiId} 
                onChange={(v) => handleChange('nextParOrganPagiId', v)} 
                roleFilter="par-organ"
              />
              <PelayanSelect 
                label="Par-Organ Siang" 
                value={state.nextParOrganSiangId} 
                onChange={(v) => handleChange('nextParOrganSiangId', v)} 
                roleFilter="par-organ"
              />
            </div>

            <div className="flex flex-col gap-2 border-t-2 border-slate-200 pt-5 mt-2">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-bold text-slate-800">Jam Masuk (Parmasuk Pukul)</Label>
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
                    className="h-12 text-sm border-2 border-slate-400 flex-1"
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
