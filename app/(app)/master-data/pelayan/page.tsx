import { Suspense } from 'react'
import { User, Loader2 } from 'lucide-react'
import { listPelayan } from '@/app/actions/pelayan'
import PelayanTable from '@/components/master-data/pelayan-table'
import MasterDataSearch from '@/components/master-data/master-data-search'
import CreatePelayanButton from '@/components/master-data/create-pelayan-button'

// Semua proses async (await) dipindahkan ke sini, bukan di Page
async function PelayanTableWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | undefined
}) {
  const params = await searchParams
  const q = typeof params?.q === 'string' ? params.q : undefined
  const data = await listPelayan(q)
  return <PelayanTable data={data} />
}

// Komponen Page TIDAK async — return layout statis + Suspense saja
export default function PelayanPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 w-full">
      {/* Header & Aksi Utama */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 border-2 border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-[#185735] p-3 rounded-xl text-white shadow-sm flex-shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Pelayan Gereja</h1>
            <p className="text-base text-slate-600 mt-1">
              Kelola master data pelayan (Pendeta, Sintua, Syamas, dll.) yang digunakan pada form e-Warta.
            </p>
          </div>
        </div>

        <CreatePelayanButton />
      </div>

      {/* Area Pencarian */}
      <div className="w-full bg-white p-4 border-2 border-slate-200 rounded-xl shadow-sm">
        <MasterDataSearch placeholder="Cari nama pelayan gereja..." />
      </div>

      {/* Tabel Data (Streaming — tidak memblokir transisi halaman) */}
      <Suspense fallback={
        <div className="flex justify-center p-8 bg-white border-2 border-slate-300 rounded-xl shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      }>
        <PelayanTableWrapper searchParams={props.searchParams} />
      </Suspense>
    </div>
  )
}
