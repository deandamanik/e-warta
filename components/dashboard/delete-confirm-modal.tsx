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

        <div className="bg-red-50 border-2 border-red-300 p-4 rounded-lg mb-8">
          <p className="text-base text-red-800 flex items-start font-medium">
            <AlertTriangle className="w-5 h-5 mr-2 shrink-0 text-red-600 mt-0.5" />
            <span>{description}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            variant="outline"
            className="py-3 px-6 text-lg h-auto border-2 border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
          
          <motion.div whileTap={{ scale: 0.97 }} className="flex-1 sm:flex-none">
            <Button
              className="w-full py-3 px-6 text-lg h-auto bg-red-600 text-white hover:bg-red-700 font-semibold"
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
