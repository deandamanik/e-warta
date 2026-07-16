'use client'

import React, { useEffect, useState } from 'react'
import { listPelayanAktif } from '@/app/actions/pelayan'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface PelayanItem {
  id: string
  nama_pelayan: string
  gelar: string | null
}

interface PelayanSelectProps {
  label: string
  value: string | null
  onChange: (id: string | null) => void
  placeholder?: string
  roleFilter?: 'par-ambilan' | 'sipangidangi' | 'par-organ' | 'all'
}

let cachedPelayanList: PelayanItem[] | null = null;
let fetchPromise: Promise<any[]> | null = null;

const formatNama = (p: PelayanItem) => {
  const gelar = p.gelar?.trim();
  return gelar ? `${gelar} ${p.nama_pelayan}` : p.nama_pelayan;
};

export default function PelayanSelect({
  label,
  value,
  onChange,
  placeholder = '— Pilih Pelayan —',
  roleFilter = 'all',
}: PelayanSelectProps) {
  const [list, setList] = useState<PelayanItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function fetchPelayan() {
      if (cachedPelayanList) {
        if (mounted) {
          setList(cachedPelayanList)
          setLoading(false)
        }
        return
      }

      if (!fetchPromise) {
        fetchPromise = listPelayanAktif()
      }

      try {
        const data = await fetchPromise
        cachedPelayanList = data
        if (mounted) {
          setList(data)
        }
      } catch (err) {
        console.error('Failed to fetch active pelayan list:', err)
        fetchPromise = null
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }
    fetchPelayan()
    return () => {
      mounted = false
    }
  }, [])

  const selectValue = value || 'NONE'

  let displayValue: string | undefined = undefined
  if (selectValue === 'NONE') {
    displayValue = placeholder
  } else {
    const selectedItem = list.find((item) => item.id === selectValue)
    if (selectedItem) {
      displayValue = formatNama(selectedItem)
    } else {
      displayValue = loading ? 'Memuat...' : selectValue
    }
  }

  const filteredOptions = list.filter((p) => {
    if (roleFilter === 'all') return true;

    const rawGelar = (p.gelar || '').toLowerCase();
    const gelar = rawGelar.replace(/[\.\s]/g, '');
    const nama = (p.nama_pelayan || '').toLowerCase();

    if (roleFilter === 'par-ambilan') {
      const allowedGelars = ['pdt', 'st', 'sy', 'cst', 'csy', 'pw'];
      return gelar !== '' && allowedGelars.includes(gelar);
    }
    
    if (roleFilter === 'sipangidangi') {
      return nama.includes('majelis') || nama.includes('sektor') || nama.includes('seksi') ||
             rawGelar.includes('majelis') || rawGelar.includes('sektor') || rawGelar.includes('seksi');
    }

    if (roleFilter === 'par-organ') {
      return !nama.includes('majelis') && !nama.includes('sektor') && !nama.includes('seksi') &&
             !rawGelar.includes('majelis') && !rawGelar.includes('sektor') && !rawGelar.includes('seksi');
    }

    return true;
  });

  const handleValueChange = (val: string | null) => {
    if (!val || val === 'NONE') {
      onChange(null)
    } else {
      onChange(val)
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-sm font-bold text-slate-800">
        {label}
      </Label>
      <Select
        value={selectValue}
        onValueChange={handleValueChange}
        disabled={loading}
      >
        <SelectTrigger className="w-full !h-12 text-sm border-2 border-slate-400 bg-white rounded-md px-3 py-2 text-slate-900 font-medium">
          <SelectValue placeholder={placeholder}>
            {displayValue}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="start" side="bottom" sideOffset={4} className="max-h-[300px] overflow-y-auto">
          <SelectItem value="NONE" className="text-sm py-2">
            {placeholder}
          </SelectItem>
          {filteredOptions.map((item) => (
            <SelectItem key={item.id} value={item.id} className="text-sm font-medium py-2">
              {formatNama(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
