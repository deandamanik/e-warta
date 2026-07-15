'use client'

import { UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import JemaatFormModal from '@/components/master-data/jemaat-form-modal'

export default function CreateJemaatButton() {
  return (
    <JemaatFormModal
      mode="create"
      trigger={
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 py-3 px-6 text-base font-semibold bg-[#185735] text-white rounded-xl shadow-sm hover:shadow-md hover:bg-[#0f3d24] transition-all duration-150 border-2 border-transparent cursor-pointer"
        >
          <UserPlus className="w-5 h-5 shrink-0" />
          Tambah Keluarga Baru
        </motion.div>
      }
    />
  )
}
