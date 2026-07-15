import React from 'react'
import { getWartaDraft } from '@/app/actions/warta'
import WartaStepperShell from '@/components/warta-stepper/warta-stepper-shell'
import { BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Edit Warta | e-Warta',
}

interface PageProps {
  params: {
    edisiId: string
  }
}

export default async function WartaEditPage({ params }: PageProps) {
  // If using Next.js 15, params is a Promise and must be awaited. 
  // We'll await it here to be safe and compatible with newer App Router changes.
  // Ignore typescript warning if it thinks it's an object in older TS setups.
  const { edisiId } = await Promise.resolve(params)

  const initialData = await getWartaDraft(edisiId)

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* HEADER PAGE */}
      <div className="flex items-center justify-between border-b-4 border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 border-2 border-slate-900 shadow-md">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Edit Warta Jemaat
            </h1>
            <p className="text-slate-600 font-medium text-lg mt-1">
              Pengisian Data Tata Ibadah & Pelayanan
            </p>
          </div>
        </div>
      </div>

      {/* STEPPER SHELL */}
      <WartaStepperShell edisiId={edisiId} initialState={initialData} />
    </div>
  )
}
