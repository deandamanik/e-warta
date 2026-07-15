'use client'

import { AlertTriangle, Trash2, X } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => Promise<void>
}

export default function DeleteConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-slate-900">
            {title}
          </DialogTitle>
          <DialogDescription className="hidden">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex items-start gap-3 p-4 bg-red-50 border-2 border-red-400 rounded-lg mb-4">
          <AlertTriangle className="w-6 h-6 shrink-0 text-red-600 mt-0.5" />
          <p className="text-left text-sm text-red-800 leading-relaxed flex-1 font-medium">
            {description}
          </p>
        </div>

        <div className="flex w-full gap-3">
          <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
            <Button
              variant="outline"
              className="w-full py-2.5 px-5 text-base h-11 border-2 border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold flex items-center justify-center rounded-lg"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
          </motion.div>
          
          <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
            <Button
              className="w-full py-2.5 px-5 text-base h-11 bg-red-600 text-white hover:bg-red-700 font-semibold flex items-center justify-center rounded-lg"
              onClick={async () => {
                await onConfirm()
                onOpenChange(false)
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Ya, Hapus Permanen
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
