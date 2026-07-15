import { listEdisi } from '@/app/actions/edisi'
import EmptyState from '@/components/dashboard/empty-state'
import WartaTable from '@/components/dashboard/warta-table'
import CreateWartaButton from '@/components/dashboard/create-warta-button'

export default async function DashboardPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Dalam Next.js 15, searchParams adalah Promise
  const searchParams = await props.searchParams
  const pageParam = searchParams?.page
  const page = typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1
  
  const { data, totalCount } = await listEdisi(page)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Arsip Warta Jemaat</h2>
          <p className="text-base text-slate-600 mt-1">
            Kelola data warta jemaat mingguan GKPS Pamatang Simalungun.
          </p>
        </div>
        
        {/* Tampilkan tombol Create di pojok kanan atas hanya jika ada data.
            Jika tidak ada data, tombol sudah tersedia besar di dalam EmptyState. */}
        {data.length > 0 && (
          <CreateWartaButton />
        )}
      </div>

      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <WartaTable data={data} totalCount={totalCount} currentPage={page} />
      )}
    </div>
  )
}
