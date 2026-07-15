'use client'

import { BookOpen, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { createEdisiBaru } from '@/app/actions/edisi'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-dashed border-slate-300 rounded-xl bg-white">
      <BookOpen className="w-16 h-16 text-slate-400 mb-6" strokeWidth={1.5} />
      <p className="text-lg text-slate-700 font-medium mb-8 max-w-sm">
        Belum ada warta yang dibuat. Mulai dengan menekan tombol di bawah ini.
      </p>
      
      <form action={createEdisiBaru}>
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 py-4 px-8 text-lg font-semibold bg-[#185735] text-white rounded-lg hover:bg-[#0f3d24] transition-colors duration-150"
        >
          <Plus className="w-5 h-5" />
          Buat Warta Baru
        </motion.button>
      </form>
    </div>
  )
}
