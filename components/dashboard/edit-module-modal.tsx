'use client'

import { Newspaper, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface EditModuleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  edisiId: string
}

export default function EditModuleModal({
  open,
  onOpenChange,
  edisiId,
}: EditModuleModalProps) {
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-slate-900 text-center">
            Pilih Modul yang Ingin Diedit
          </DialogTitle>
          <DialogDescription className="hidden">
            Pilih modul warta jemaat atau tingting parduiton.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Kartu Edit Warta Jemaat */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onOpenChange(false)
              router.push(`/warta/${edisiId}/edit`)
            }}
            className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-300 rounded-xl hover:border-[#185735] hover:shadow-md transition-all text-center gap-4"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <Newspaper className="w-8 h-8 text-[#185735]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Edit Warta Jemaat
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-1">
                (Halaman Depan)
              </p>
            </div>
          </motion.button>

          {/* Kartu Edit Tingting Parduiton */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onOpenChange(false)
              router.push(`/warta/${edisiId}/tingting`)
            }}
            className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-300 rounded-xl hover:border-[#185735] hover:shadow-md transition-all text-center gap-4"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-[#185735]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Edit Tingting Parduiton
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-1">
                (Halaman Belakang)
              </p>
            </div>
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
