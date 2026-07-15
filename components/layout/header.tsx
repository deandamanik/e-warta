'use client'

import { usePathname } from 'next/navigation'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

function getBreadcrumb(pathname: string): string {
  if (pathname === '/dashboard') {
    return 'Dashboard / Arsip Warta'
  }
  if (pathname.startsWith('/master-data/pelayan')) {
    return 'Master Data / Data Pelayan Gereja'
  }
  if (pathname.startsWith('/master-data/jemaat')) {
    return 'Master Data / Data Jemaat'
  }
  if (pathname.includes('/edit')) {
    return 'Warta / Edit Warta Jemaat'
  }
  if (pathname.includes('/tingting')) {
    return 'Warta / Edit Tingting Parduiton'
  }
  return 'Dashboard'
}

export default function Header() {
  const pathname = usePathname()
  const breadcrumb = getBreadcrumb(pathname)
  const todayFormatted = format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })

  return (
    <header className="h-16 bg-white border-b-2 border-slate-200 flex items-center justify-between px-6 md:px-8 shrink-0">
      {/* Breadcrumb sederhana */}
      <h1 className="text-xl font-semibold text-slate-900">
        {breadcrumb}
      </h1>

      {/* Tanggal hari ini */}
      <p className="text-base text-slate-600 font-medium">
        {todayFormatted}
      </p>
    </header>
  )
}
