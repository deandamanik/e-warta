'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Info, Printer } from 'lucide-react'
import WartaPrintLayout from '@/components/print/warta-print-layout'
import { WartaDraftState } from '@/lib/types/warta-draft'
import { listPelayanAktif } from '@/app/actions/pelayan'
import { listJemaatAktif } from '@/app/actions/jemaat'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

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

  useEffect(() => {
    const originalTitle = document.title
    if (state.tanggalIbadah) {
      try {
        const tgl = new Date(state.tanggalIbadah)
        if (!isNaN(tgl.getTime())) {
          const formattedDate = format(tgl, 'dd MMMM yyyy', { locale: id })
          document.title = `Warta - Halaman Depan - ${formattedDate}`
        } else {
          document.title = 'Warta - Halaman Depan'
        }
      } catch (e) {
        document.title = 'Warta - Halaman Depan'
      }
    } else {
      document.title = 'Warta - Halaman Depan'
    }

    return () => {
      document.title = originalTitle
    }
  }, [state.tanggalIbadah])

  return (
    <div className="flex flex-col gap-6 w-full">
      <motion.div 
        className="border-2 border-slate-300 rounded-xl bg-white shadow-sm flex flex-col w-full"
      >
        <div className="bg-slate-100 border-b-2 border-slate-300 px-6 py-4 flex justify-between items-center print:hidden">
          <div className="flex flex-col gap-1">
            <div className="flex items-center">
              <Info className="w-6 h-6 mr-3 text-slate-700" />
              <h3 className="text-xl font-bold text-slate-800">Preview Warta Jemaat</h3>
            </div>
            <p className="text-slate-600 font-medium ml-9">Pratinjau A4 sebelum mencetak</p>
          </div>
          <Button onClick={() => window.print()} className="h-10 px-6 font-bold">
            <Printer className="w-4 h-4 mr-2" />
            Cetak Warta
          </Button>
        </div>

        <div className="w-full overflow-x-auto flex justify-center bg-transparent py-6">
          {/* The A4 Print Preview Container */}
          <div 
            className="w-max transition-opacity duration-300 print:fixed print:inset-0 print:bg-white print:z-[9999] print:block print:w-full print:h-full print:overflow-visible" 
            style={{ opacity: loading ? 0.5 : 1 }}
          >
            <WartaPrintLayout 
              data={state} 
              pelayanLookup={pelayanLookup}
              keluargaLookup={keluargaLookup} 
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
