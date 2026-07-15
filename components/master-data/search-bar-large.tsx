'use client'

import { useEffect, useState, useRef } from 'react'
import { Search } from 'lucide-react'

interface SearchBarLargeProps {
  placeholder: string
  defaultValue?: string
  onSearch: (value: string) => void
}

export default function SearchBarLarge({
  placeholder,
  defaultValue = '',
  onSearch,
}: SearchBarLargeProps) {
  const [value, setValue] = useState(defaultValue)
  const isFirstRender = useRef(true)

  const onSearchRef = useRef(onSearch)

  useEffect(() => {
    onSearchRef.current = onSearch
  }, [onSearch])

  useEffect(() => {
    // Kita abaikan render pertama agar tidak memicu onSearch saat komponen baru dimuat
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Set debounce timer
    const timeout = setTimeout(() => {
      onSearchRef.current(value)
    }, 300)

    // Bersihkan timer jika value berubah sebelum 300ms
    return () => clearTimeout(timeout)
  }, [value])

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 text-lg border-2 border-slate-400 focus:border-slate-700 rounded-lg px-4 pl-12 text-slate-900 outline-none transition-colors duration-150"
      />
    </div>
  )
}
