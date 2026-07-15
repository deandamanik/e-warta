'use client'

interface WartaTableProps {
  data: any[]
  totalCount: number
  currentPage: number
}

export default function WartaTable({ data, totalCount, currentPage }: WartaTableProps) {
  return (
    <div className="bg-white p-6 border-2 border-slate-200 rounded-xl shadow-sm">
      <p className="text-slate-600 text-lg font-medium">
        Warta Table — akan diimplementasikan di Bagian 4.13
      </p>
      <p className="text-slate-500 mt-2">
        Total data: {totalCount} | Halaman: {currentPage}
      </p>
    </div>
  )
}
