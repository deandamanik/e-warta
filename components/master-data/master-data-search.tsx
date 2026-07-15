'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import SearchBarLarge from '@/components/master-data/search-bar-large'

interface MasterDataSearchProps {
  placeholder: string
}

export default function MasterDataSearch({ placeholder }: MasterDataSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const defaultQuery = searchParams.get('q') ?? ''

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <SearchBarLarge
      placeholder={placeholder}
      defaultValue={defaultQuery}
      onSearch={handleSearch}
    />
  )
}
