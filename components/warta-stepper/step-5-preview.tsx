'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import WartaPrintLayout from '@/components/print/warta-print-layout'
import { WartaDraftState } from '@/lib/types/warta-draft'
import { listPelayanAktif } from '@/app/actions/pelayan'
import { listJemaatAktif } from '@/app/actions/jemaat'

interface Step5PreviewProps {
  state: WartaDraftState
  dispatch: React.Dispatch<any>
}

export default function Step5Preview({ state, dispatch }: Step5PreviewProps) {
  const [pelayanLookup, setPelayanLookup] = useState<Record<string, string>>({})
  const [keluargaLookup, setKeluargaLookup] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadLookups() {
      try {
        const [pelayanList, jemaatList] = await Promise.all([
          listPelayanAktif(),
          listJemaatAktif()
        ])

        if (mounted) {
          const pLookup: Record<string, string> = {}
          pelayanList.forEach((p: any) => {
            pLookup[p.id] = p.gelar ? `${p.gelar} ${p.nama_pelayan}` : p.nama_pelayan
          })
          setPelayanLookup(pLookup)

          const kLookup: Record<string, string> = {}
          jemaatList.forEach((j: any) => {
            kLookup[j.id] = j.nama_keluarga
          })
          setKeluargaLookup(kLookup)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to load lookups for preview', err)
        if (mounted) setLoading(false)
      }
    }
    loadLookups()
    return () => { mounted = false }
  }, [])

  return (
    <div className="flex flex-col gap-6 w-full">
      <motion.div 
        whileHover={{ scale: 1.002 }}
        className="border-2 border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col w-full"
      >
        <div className="bg-slate-100 border-b-2 border-slate-300 px-6 py-4 flex flex-col gap-1">
          <div className="flex items-center">
            <Info className="w-6 h-6 mr-3 text-slate-700" />
            <h3 className="text-xl font-bold text-slate-800">Preview Warta Jemaat</h3>
          </div>
          <p className="text-slate-600 font-medium ml-9">Pratinjau A4 sebelum mencetak</p>
        </div>

        <div className="p-6 bg-slate-50">
          <div className="mb-6 flex items-start p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <Info className="w-5 h-5 text-blue-700 mr-3 mt-0.5 shrink-0" />
            <p className="text-base text-slate-700 font-medium leading-relaxed">
              Tinjau kembali data di bawah ini sebelum menyimpan. Anda masih bisa kembali ke langkah sebelumnya untuk melakukan koreksi.
            </p>
          </div>

          {/* The A4 Print Preview Container */}
          <div className="relative w-full overflow-x-auto overflow-y-auto max-h-[800px] border-2 border-slate-400 shadow-lg rounded-md bg-slate-300 p-8">
            <div className="mx-auto bg-white shadow-sm transition-opacity duration-300" style={{ width: '210mm', minHeight: '297mm', opacity: loading ? 0.5 : 1 }}>
              <WartaPrintLayout 
                data={state} 
                pelayanLookup={pelayanLookup} 
                keluargaLookup={keluargaLookup} 
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
