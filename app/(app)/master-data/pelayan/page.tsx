import { User } from 'lucide-react'
import { listPelayan } from '@/app/actions/pelayan'
import PelayanTable from '@/components/master-data/pelayan-table'
import MasterDataSearch from '@/components/master-data/master-data-search'
import CreatePelayanButton from '@/components/master-data/create-pelayan-button'

export default async function PelayanPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const q = typeof searchParams?.q === 'string' ? searchParams.q : undefined

  // Ambil data server-side
  const data = await listPelayan(q)

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-6xl mx-auto w-full">
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

      {/* Tabel Data */}
      <PelayanTable data={data} />
    </div>
  )
}
