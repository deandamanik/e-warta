import { Loader2 } from 'lucide-react'

export default function JemaatLoading() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 p-16 text-slate-400">
      <Loader2 className="w-10 h-10 animate-spin text-[#185735]" />
      <p className="text-base font-medium animate-pulse">Memuat data jemaat...</p>
    </div>
  )
}
