import { Suspense } from 'react'
import { Users, Loader2 } from 'lucide-react'
import { listJemaat } from '@/app/actions/jemaat'
import JemaatTable from '@/components/master-data/jemaat-table'
import JemaatSearchFilter from '@/components/master-data/jemaat-search-filter'
import CreateJemaatButton from '@/components/master-data/create-jemaat-button'

// Semua proses async (await) dipindahkan ke sini, bukan di Page
async function JemaatTableWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | undefined
}) {
  const params = await searchParams
  const q = typeof params?.q === 'string' ? params.q : undefined
  const sektor = typeof params?.sektor === 'string' ? params.sektor : undefined
  const data = await listJemaat(q, sektor)
  return <JemaatTable data={data} />
}

// Komponen Page TIDAK async — return layout statis + Suspense saja
export default function JemaatPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 w-full">
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

      {/* Tabel Data (Streaming — tidak memblokir transisi halaman) */}
      <Suspense fallback={
        <div className="flex justify-center p-8 bg-white border-2 border-slate-300 rounded-xl shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      }>
        <JemaatTableWrapper searchParams={props.searchParams} />
      </Suspense>
    </div>
  )
}
