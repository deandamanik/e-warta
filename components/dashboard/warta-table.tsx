'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
  Printer,
} from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import DeleteConfirmModal from '@/components/dashboard/delete-confirm-modal'
import EditModuleModal from '@/components/dashboard/edit-module-modal'
import { deleteEdisi } from '@/app/actions/edisi'

// Mendefinisikan struktur data sesuai yang direturn oleh listEdisi
interface WartaData {
  id: string
  tanggal_ibadah: string
  warta: { goran_minggu: string | null } | null
  tingting: { is_lengkap: boolean } | null
}

interface WartaTableProps {
  data: WartaData[]
  totalCount: number
  currentPage: number
}

const PAGE_SIZE = 10

export default function WartaTable({ data, totalCount, currentPage }: WartaTableProps) {
  const router = useRouter()
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<WartaData | null>(null)
  
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<string | null>(null)

  const openDeleteModal = (item: WartaData) => {
    setItemToDelete(item)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      await deleteEdisi(itemToDelete.id)
      setDeleteModalOpen(false)
      setItemToDelete(null)
      // Memaksa refresh route untuk mendapatkan data terbaru setelah penghapusan
      router.refresh()
    }
  }

  const openEditModal = (edisiId: string) => {
    setItemToEdit(edisiId)
    setEditModalOpen(true)
  }

  const navigateToPage = (page: number) => {
    router.push(`/dashboard?page=${page}`)
  }

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl shadow-sm flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-b-2 border-slate-200">
              <TableHead className="w-16 text-center font-bold text-slate-700">No.</TableHead>
              <TableHead className="font-bold text-slate-700">Tanggal Ibadah</TableHead>
              <TableHead className="font-bold text-slate-700">Goran Minggu</TableHead>
              <TableHead className="font-bold text-slate-700">Status Kelengkapan</TableHead>
              <TableHead className="text-right font-bold text-slate-700 pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => {
              const rowNumber = (currentPage - 1) * PAGE_SIZE + index + 1
              const dateObj = new Date(row.tanggal_ibadah)
              const dateFormatted = format(dateObj, 'dd MMMM yyyy', { locale: id })
              const goranMinggu = row.warta?.goran_minggu
              const isLengkap = row.tingting?.is_lengkap ?? false

              return (
                <TableRow key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-center font-medium text-slate-600">
                    {rowNumber}
                  </TableCell>
                  
                  <TableCell className="font-semibold text-slate-900">
                    {dateFormatted}
                  </TableCell>
                  
                  <TableCell>
                    {goranMinggu ? (
                      <span className="text-slate-900 font-medium">{goranMinggu}</span>
                    ) : (
                      <span className="text-slate-400 italic">(belum diisi)</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {isLengkap ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0 py-1 px-3">
                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                        Lengkap
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-0 py-1 px-3">
                        <Clock className="w-4 h-4 mr-1.5 text-slate-500" />
                        Belum Lengkap
                      </Badge>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-slate-200 text-slate-700 hover:text-[#185735] hover:border-[#185735]"
                        onClick={() => openEditModal(row.id)}
                        title="Edit Modul Warta"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      
                      {/* Tombol Print (Disabled, ruang lingkup File 5) */}
                      <div title="Tersedia setelah data warta diisi">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="border-2 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-slate-200 text-slate-700 hover:text-red-600 hover:border-red-600 hover:bg-red-50"
                        onClick={() => openDeleteModal(row)}
                        title="Hapus Edisi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Kontrol Paginasi Bernomor */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t-2 border-slate-200 bg-slate-50 rounded-b-xl">
          <p className="text-sm text-slate-500 font-medium">
            Menampilkan {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, totalCount)} dari {totalCount} data
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => navigateToPage(currentPage - 1)}
              className="border-2 border-slate-300 font-medium text-slate-700"
            >
              Sebelumnya
            </Button>
            
            <div className="hidden sm:flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={currentPage === p ? 'default' : 'outline'}
                  onClick={() => navigateToPage(p)}
                  className={`border-2 ${
                    currentPage === p
                      ? 'bg-[#185735] text-white border-[#185735] hover:bg-[#0f3d24]'
                      : 'border-slate-300 font-medium hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {p}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => navigateToPage(currentPage + 1)}
              className="border-2 border-slate-300 font-medium text-slate-700"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Hapus Warta Jemaat"
        description={
          itemToDelete
            ? `Apakah Anda yakin ingin menghapus arsip warta untuk ibadah tanggal ${format(new Date(itemToDelete.tanggal_ibadah), 'dd MMMM yyyy', { locale: id })}? Seluruh data terkait (Goran Minggu, Tingting, dll) akan terhapus permanen.`
            : ''
        }
        onConfirm={handleDeleteConfirm}
      />

      <EditModuleModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        edisiId={itemToEdit ?? ''}
      />
    </div>
  )
}
