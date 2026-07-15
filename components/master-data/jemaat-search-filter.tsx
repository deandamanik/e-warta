'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import SearchBarLarge from '@/components/master-data/search-bar-large'
import { SEKTOR_LIST } from '@/lib/constants'

export default function JemaatSearchFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const defaultQuery = searchParams.get('q') ?? ''
  const currentSektor = searchParams.get('sektor') ?? ''

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center w-full">
      <div className="flex-grow w-full">
        <SearchBarLarge
          placeholder="Cari nama keluarga..."
          defaultValue={defaultQuery}
          onSearch={(val) => updateParams('q', val)}
        />
      </div>
      <div className="w-full md:w-64 shrink-0">
        <select
          value={currentSektor}
          onChange={(e) => updateParams('sektor', e.target.value)}
          className="w-full h-12 text-lg border-2 border-slate-400 focus:border-slate-700 rounded-md px-4 bg-white text-slate-900 outline-none transition-colors duration-150"
        >
          <option value="">Semua Sektor</option>
          {SEKTOR_LIST.map((s) => (
            <option key={s} value={s}>
              Sektor {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
