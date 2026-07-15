'use client'

import { useState, useTransition } from 'react'
import { Save } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { createJemaat, updateJemaat } from '@/app/actions/jemaat'
import { SEKTOR_LIST } from '@/lib/constants'

interface JemaatFormModalProps {
  mode: 'create' | 'edit'
  initialData?: { id: string; nama_keluarga: string; sektor: string }
  trigger: React.ReactNode
}

export default function JemaatFormModal({
  mode,
  initialData,
  trigger,
}: JemaatFormModalProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [sektor, setSektor] = useState<string>(initialData?.sektor ?? '')

  function resetState() {
    setErrorMessage(null)
    if (mode === 'create') {
      setSektor('')
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetState()
    setOpen(nextOpen)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createJemaat(formData)
        } else if (mode === 'edit' && initialData) {
          await updateJemaat(initialData.id, formData)
        }
        setOpen(false)
        resetState()
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.'
        )
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-slate-900">
            {mode === 'create' ? 'Tambah Data Jemaat / Keluarga' : 'Edit Data Jemaat / Keluarga'}
          </DialogTitle>
          <DialogDescription className="text-base text-slate-600">
            {mode === 'create'
              ? 'Isi data keluarga jemaat baru yang akan ditambahkan ke sistem.'
              : 'Perbarui data keluarga jemaat yang sudah ada.'}
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="mb-4 bg-red-50 border-2 border-red-400 text-red-800 text-base p-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Field: Nama Kepala Keluarga */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="nama_keluarga" className="text-lg font-medium text-slate-900">
              Nama Kepala Keluarga
            </Label>
            <input
              id="nama_keluarga"
              name="nama_keluarga"
              type="text"
              required
              defaultValue={initialData?.nama_keluarga ?? ''}
              placeholder="Kel. Ir. Berlindo Saragih"
              className="h-11 w-full border-2 border-slate-400 focus:border-slate-700 rounded-lg px-4 text-base text-slate-900 outline-none transition-colors duration-150"
            />
          </div>

          {/* Field: Sektor */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="sektor" className="text-lg font-medium text-slate-900">
              Sektor
            </Label>
            <select
              id="sektor"
              name="sektor"
              required
              value={sektor}
              onChange={(e) => setSektor(e.target.value)}
              className="h-11 w-full border-2 border-slate-400 focus:border-slate-700 rounded-lg px-4 text-base text-slate-900 outline-none transition-colors duration-150 bg-white"
            >
              <option value="" disabled>-- Pilih Sektor --</option>
              {SEKTOR_LIST.map((s) => (
                <option key={s} value={s}>
                  Sektor {s}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Submit */}
          <motion.button
            type="submit"
            disabled={isPending}
            whileTap={{ scale: 0.97 }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#185735] px-6 py-3 text-base font-semibold text-white transition-colors duration-150 hover:bg-[#0f3d24] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isPending ? 'Menyimpan...' : 'Simpan Data Jemaat'}
          </motion.button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
