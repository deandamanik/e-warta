'use client'

import React from 'react'

interface StepperNavProps {
  currentStep: number
  onStepClick: (step: number) => void
}

const steps = [
  { step: 1, label: 'Jadwal' },
  { step: 2, label: 'Kehadiran' },
  { step: 3, label: 'Partonggoan' },
  { step: 4, label: 'Pengumuman' },
  { step: 5, label: 'Preview' },
]

export default function StepperNav({ currentStep, onStepClick }: StepperNavProps) {
  return (
    <div className="w-full flex items-center justify-between mb-8 relative">
      {steps.map((s, index) => {
        const isCompleted = s.step < currentStep
        const isActive = s.step === currentStep
        const isUpcoming = s.step > currentStep

        let circleClass = 'w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold cursor-pointer transition-colors relative z-10'
        
        if (isCompleted) {
          circleClass += ' bg-[#185735] text-white border-2 border-[#185735]'
        } else if (isActive) {
          circleClass += ' bg-[#C9F9D3] text-[#185735] border-2 border-[#185735]'
        } else {
          circleClass += ' bg-slate-200 text-slate-500 border-2 border-slate-200'
        }

        // Determine the line color that comes AFTER this step (if not the last step)
        const hasNextLine = index < steps.length - 1
        const lineClass = isCompleted 
          ? 'absolute top-5 left-1/2 w-full border-t-2 border-[#185735] -z-0' 
          : 'absolute top-5 left-1/2 w-full border-t-2 border-slate-200 -z-0'

        return (
          <div key={s.step} className="flex-1 relative flex flex-col items-center">
            {/* The Line connecting to the next step */}
            {hasNextLine && (
              <div className={lineClass} />
            )}

            <div 
              className={circleClass} 
              onClick={() => onStepClick(s.step)}
              title={`Ke langkah ${s.step}: ${s.label}`}
            >
              {s.step}
            </div>
            
            <div className="mt-2 text-base font-medium text-slate-700 text-center">
              {s.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
