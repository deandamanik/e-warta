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
import { createPelayan, updatePelayan } from '@/app/actions/pelayan'

interface PelayanFormModalProps {
  mode: 'create' | 'edit'
  initialData?: { id: string; nama_pelayan: string; gelar: string | null }
  trigger: React.ReactNode
}

const GELAR_PRESETS = [
  'Pdt.',
  'Pdt. Em.',
  'St.',
  'C.St.',
  'Sy.',
  'Majelis Sektor',
  'Seksi',
]

export default function PelayanFormModal({
  mode,
  initialData,
  trigger,
}: PelayanFormModalProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // State untuk gelar: nilai Select dropdown dan input teks jika "Lainnya..." dipilih
  const [gelarSelect, setGelarSelect] = useState<string>(() => {
    const val = initialData?.gelar ?? ''
    if (!val) return ''
    if (GELAR_PRESETS.includes(val)) return val
    return '__lainnya__'
  })
  const [gelarCustom, setGelarCustom] = useState<string>(() => {
    const val = initialData?.gelar ?? ''
    if (!val || GELAR_PRESETS.includes(val)) return ''
    return val
  })

  const resolvedGelar =
    gelarSelect === '__lainnya__' ? gelarCustom.trim() : gelarSelect

  function resetState() {
    setErrorMessage(null)
    if (mode === 'create') {
      setGelarSelect('')
      setGelarCustom('')
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

    // Injeksi nilai gelar yang telah diresolved ke FormData
    formData.set('gelar', resolvedGelar)

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createPelayan(formData)
        } else if (mode === 'edit' && initialData) {
          await updatePelayan(initialData.id, formData)
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
            {mode === 'create' ? 'Tambah Pelayan Gereja' : 'Edit Pelayan Gereja'}
          </DialogTitle>
          <DialogDescription className="text-base text-slate-600">
            {mode === 'create'
              ? 'Isi data pelayan baru yang akan ditambahkan ke sistem.'
              : 'Perbarui data pelayan yang sudah ada.'}
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="mb-4 bg-red-50 border-2 border-red-400 text-red-800 text-base p-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Field: Nama Pelayan */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="nama_pelayan" className="text-lg font-medium text-slate-900">
              Nama Pelayan
            </Label>
            <input
              id="nama_pelayan"
              name="nama_pelayan"
              type="text"
              required
              defaultValue={initialData?.nama_pelayan ?? ''}
              placeholder="contoh: Marliana Saragih"
              className="h-11 w-full border-2 border-slate-400 focus:border-slate-700 rounded-lg px-4 text-base text-slate-900 outline-none transition-colors duration-150"
            />
          </div>

          {/* Field: Gelar */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="gelar_select" className="text-lg font-medium text-slate-900">
              Gelar <span className="text-slate-500 font-normal text-base">(opsional)</span>
            </Label>
            <select
              id="gelar_select"
              value={gelarSelect}
              onChange={(e) => setGelarSelect(e.target.value)}
              className="h-11 w-full border-2 border-slate-400 focus:border-slate-700 rounded-lg px-4 text-base text-slate-900 outline-none transition-colors duration-150 bg-white"
            >
              <option value="">-- Tanpa Gelar --</option>
              {GELAR_PRESETS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
              <option value="__lainnya__">Lainnya...</option>
            </select>

            {/* Input tambahan muncul hanya jika "Lainnya..." dipilih */}
            {gelarSelect === '__lainnya__' && (
              <input
                type="text"
                value={gelarCustom}
                onChange={(e) => setGelarCustom(e.target.value)}
                placeholder="Tulis gelar secara manual..."
                className="h-11 w-full border-2 border-slate-400 focus:border-slate-700 rounded-lg px-4 text-base text-slate-900 outline-none transition-colors duration-150 mt-1"
              />
            )}
          </div>

          {/* Tombol Submit */}
          <motion.button
            type="submit"
            disabled={isPending}
            whileTap={{ scale: 0.97 }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#185735] px-6 py-3 text-base font-semibold text-white transition-colors duration-150 hover:bg-[#0f3d24] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isPending ? 'Menyimpan...' : 'Simpan Data Pelayan'}
          </motion.button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
