'use client'

import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { createEdisiBaru } from '@/app/actions/edisi'

export default function CreateWartaButton() {
  return (
    <form action={createEdisiBaru}>
      <motion.button
        type="submit"
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-2 py-3 px-6 text-base font-semibold bg-[#185735] text-white rounded-xl shadow-sm hover:shadow-md hover:bg-[#0f3d24] transition-all duration-150"
      >
        <Plus className="w-5 h-5 shrink-0" />
        Buat Warta Baru
      </motion.button>
    </form>
  )
}
