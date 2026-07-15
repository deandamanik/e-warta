import { Users } from 'lucide-react'
import { listJemaat } from '@/app/actions/jemaat'
import JemaatTable from '@/components/master-data/jemaat-table'
import JemaatSearchFilter from '@/components/master-data/jemaat-search-filter'
import CreateJemaatButton from '@/components/master-data/create-jemaat-button'

export default async function JemaatPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const q = typeof searchParams?.q === 'string' ? searchParams.q : undefined
  const sektor = typeof searchParams?.sektor === 'string' ? searchParams.sektor : undefined

  // Ambil data server-side
  const data = await listJemaat(q, sektor)

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-6xl mx-auto w-full">
      {/* Header & Aksi Utama */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 border-2 border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-[#185735] p-3 rounded-xl text-white shadow-sm flex-shrink-0">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Jemaat & Keluarga</h1>
            <p className="text-base text-slate-600 mt-1">
              Kelola master data keluarga dan sektor jemaat GKPS Pamatang Simalungun.
            </p>
          </div>
        </div>

        <CreateJemaatButton />
      </div>

      {/* Area Pencarian dan Filter */}
      <div className="w-full bg-white p-4 border-2 border-slate-200 rounded-xl shadow-sm">
        <JemaatSearchFilter />
      </div>

      {/* Tabel Data */}
      <JemaatTable data={data} />
    </div>
  )
}
