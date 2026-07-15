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
}

export default function PelayanSelect({
  label,
  value,
  onChange,
  placeholder = '— Pilih Pelayan —',
}: PelayanSelectProps) {
  const [list, setList] = useState<PelayanItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function fetchPelayan() {
      try {
        const data = await listPelayanAktif()
        if (mounted) {
          setList(data)
        }
      } catch (err) {
        console.error('Failed to fetch active pelayan list:', err)
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

  const handleValueChange = (val: string) => {
    if (val === 'NONE') {
      onChange(null)
    } else {
      onChange(val)
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-lg font-bold text-slate-800">
        {label}
      </Label>
      <Select
        value={selectValue}
        onValueChange={handleValueChange}
        disabled={loading}
      >
        <SelectTrigger className="w-full h-12 text-lg border-2 border-slate-400 bg-white rounded-lg px-3 py-2 text-slate-900 font-medium">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="border-2 border-slate-300 max-h-60">
          <SelectItem value="NONE" className="text-lg py-2">
            {placeholder}
          </SelectItem>
          {list.map((item) => {
            const displayName = item.gelar
              ? `${item.gelar} ${item.nama_pelayan}`
              : item.nama_pelayan

            return (
              <SelectItem key={item.id} value={item.id} className="text-lg py-2 font-medium">
                {displayName}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
