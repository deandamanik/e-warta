'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Pencil,
  UserX,
  UserCheck,
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
import JemaatFormModal from '@/components/master-data/jemaat-form-modal'
import { toggleActiveJemaat } from '@/app/actions/jemaat'

interface JemaatData {
  id: string
  nama_keluarga: string
  sektor: string
  is_active: boolean
}

interface JemaatTableProps {
  data: JemaatData[]
}

export default function JemaatTable({ data }: JemaatTableProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<JemaatData | null>(null)

  const openDeleteModal = (item: JemaatData) => {
    setItemToDelete(item)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      await toggleActiveJemaat(itemToDelete.id, false)
    }
  }

  const handleRestore = async (id: string) => {
    await toggleActiveJemaat(id, true)
  }

  return (
    <div className="bg-white border-2 border-slate-300 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-100">
            <TableRow className="border-b-2 border-slate-300">
              <TableHead className="w-[60px] text-center font-bold text-slate-800 text-base">No.</TableHead>
              <TableHead className="w-full font-bold text-slate-800 text-base">Nama Kepala Keluarga</TableHead>
              <TableHead className="w-[150px] font-bold text-slate-800 text-base">Sektor</TableHead>
              <TableHead className="w-[150px] font-bold text-slate-800 text-base">Status</TableHead>
              <TableHead className="w-[220px] text-right font-bold text-slate-800 text-base pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500 text-lg">
                  Tidak ada data jemaat/keluarga ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const isAktif = row.is_active

                return (
                  <TableRow 
                    key={row.id} 
                    className={`border-b-2 border-slate-100 hover:bg-slate-50/80 transition-colors ${
                      !isAktif ? 'opacity-60 bg-slate-50' : ''
                    }`}
                  >
                    <TableCell className="text-center font-medium text-slate-600 text-base">
                      {index + 1}
                    </TableCell>
                    
                    <TableCell className="font-bold text-slate-900 text-lg">
                      {row.nama_keluarga}
                    </TableCell>
                    
                    <TableCell>
                      <span className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium border-2 border-slate-200 rounded-full text-slate-700 bg-white">
                        Sektor {row.sektor}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      {isAktif ? (
                        <span className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-full bg-[#C9F9D3] text-[#185735]">
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-full bg-slate-200 text-slate-700">
                          <XCircle className="w-4 h-4 mr-1.5" />
                          Nonaktif
                        </span>
                      )}
                    </TableCell>
                    
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-3">
                        <JemaatFormModal
                          mode="edit"
                          initialData={{
                            id: row.id,
                            nama_keluarga: row.nama_keluarga,
                            sektor: row.sektor
                          }}
                          trigger={
                            <div
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:bg-accent hover:text-accent-foreground border-2 border-slate-300 text-slate-700 hover:text-[#185735] hover:border-[#185735] h-10 px-3 cursor-pointer"
                              title="Ubah Data"
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              <span className="font-semibold text-base">Ubah</span>
                            </div>
                          }
                        />
                        
                        {isAktif ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="border-2 border-red-300 hover:border-red-600 h-10 px-3"
                            title="Nonaktifkan"
                            onClick={() => openDeleteModal(row)}
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            <span className="font-semibold text-base">Nonaktifkan</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleActiveJemaat(row.id, true)}
                            className="border-2 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-600 h-10 px-3"
                            title="Aktifkan Kembali"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            <span className="font-semibold text-base">Aktifkan Kembali</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Nonaktifkan Keluarga Jemaat"
        description={
          itemToDelete
            ? `Apakah Anda yakin ingin menonaktifkan keluarga "${itemToDelete.nama_keluarga}"? Data ini tidak dihapus secara permanen dari database demi menjaga integritas riwayat Partonggoan dan Perpuluhan lama, namun akan disembunyikan dari pilihan pengisian form baru.`
            : ''
        }
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
