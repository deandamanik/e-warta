import { Loader2 } from 'lucide-react'

export default function MasterDataLoading() {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4 text-slate-500 p-8">
      <Loader2 className="w-12 h-12 animate-spin text-[#185735]" />
      <p className="text-lg font-medium animate-pulse">Memuat data...</p>
    </div>
  )
}
