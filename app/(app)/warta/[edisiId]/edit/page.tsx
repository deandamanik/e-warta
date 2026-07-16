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
    <div className="w-full p-4 md:p-6 lg:p-8 flex flex-col gap-6">


      {/* STEPPER SHELL */}
      <WartaStepperShell edisiId={edisiId} initialState={initialData.draft} />
    </div>
  )
}
