'use client'

import React, { useReducer, useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react'

import { WartaDraftState, DodingItemDraft, KehadiranItemDraft, PartonggoanKehadiranDraft, PartonggoanJadwalDraft } from '@/lib/types/warta-draft'
import { simpanWartaFinal } from '@/app/actions/warta'
import StepperNav from './stepper-nav'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import Step1JadwalPelayan from './step-1-jadwal-pelayan'
import Step2Kehadiran from './step-2-kehadiran'
import Step3Partonggoan from './step-3-partonggoan'

// ============================================================
// REDUCER TYPES & DEFINITIONS
// ============================================================

type Action =
  | { type: 'SET_FIELD'; field: keyof WartaDraftState; value: any }
  | { type: 'GOTO_STEP'; step: 1 | 2 | 3 | 4 | 5 }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'ADD_DODING_ITEM'; item: DodingItemDraft }
  | { type: 'UPDATE_DODING_ITEM'; index: number; item: DodingItemDraft }
  | { type: 'REMOVE_DODING_ITEM'; index: number }
  | { type: 'ADD_KEHADIRAN_ITEM'; item: KehadiranItemDraft }
  | { type: 'UPDATE_KEHADIRAN_ITEM'; index: number; item: KehadiranItemDraft }
  | { type: 'REMOVE_KEHADIRAN_ITEM'; index: number }
  | { type: 'ADD_PARTONGGOAN_KEHADIRAN'; item: PartonggoanKehadiranDraft }
  | { type: 'UPDATE_PARTONGGOAN_KEHADIRAN'; index: number; item: PartonggoanKehadiranDraft }
  | { type: 'REMOVE_PARTONGGOAN_KEHADIRAN'; index: number }
  | { type: 'ADD_PARTONGGOAN_JADWAL'; item: PartonggoanJadwalDraft }
  | { type: 'UPDATE_PARTONGGOAN_JADWAL'; index: number; item: PartonggoanJadwalDraft }
  | { type: 'REMOVE_PARTONGGOAN_JADWAL'; index: number }
  | { type: 'LOAD_DRAFT'; draft: WartaDraftState }

function wartaDraftReducer(state: WartaDraftState, action: Action): WartaDraftState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'GOTO_STEP':
      return { ...state, currentStep: action.step }
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 5) as WartaDraftState['currentStep'] }
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) as WartaDraftState['currentStep'] }
    
    // Arrays manipulation
    case 'ADD_DODING_ITEM':
      return { ...state, dodingItems: [...state.dodingItems, action.item] }
    case 'UPDATE_DODING_ITEM': {
      const newArr = [...state.dodingItems]
      newArr[action.index] = action.item
      return { ...state, dodingItems: newArr }
    }
    case 'REMOVE_DODING_ITEM':
      return { ...state, dodingItems: state.dodingItems.filter((_, i) => i !== action.index) }
    
    case 'ADD_KEHADIRAN_ITEM':
      return { ...state, kehadiranItems: [...state.kehadiranItems, action.item] }
    case 'UPDATE_KEHADIRAN_ITEM': {
      const newArr = [...state.kehadiranItems]
      newArr[action.index] = action.item
      return { ...state, kehadiranItems: newArr }
    }
    case 'REMOVE_KEHADIRAN_ITEM':
      return { ...state, kehadiranItems: state.kehadiranItems.filter((_, i) => i !== action.index) }

    case 'ADD_PARTONGGOAN_KEHADIRAN':
      return { ...state, partonggoanKehadiran: [...state.partonggoanKehadiran, action.item] }
    case 'UPDATE_PARTONGGOAN_KEHADIRAN': {
      const newArr = [...state.partonggoanKehadiran]
      newArr[action.index] = action.item
      return { ...state, partonggoanKehadiran: newArr }
    }
    case 'REMOVE_PARTONGGOAN_KEHADIRAN':
      return { ...state, partonggoanKehadiran: state.partonggoanKehadiran.filter((_, i) => i !== action.index) }

    case 'ADD_PARTONGGOAN_JADWAL':
      return { ...state, partonggoanJadwal: [...state.partonggoanJadwal, action.item] }
    case 'UPDATE_PARTONGGOAN_JADWAL': {
      const newArr = [...state.partonggoanJadwal]
      newArr[action.index] = action.item
      return { ...state, partonggoanJadwal: newArr }
    }
    case 'REMOVE_PARTONGGOAN_JADWAL':
      return { ...state, partonggoanJadwal: state.partonggoanJadwal.filter((_, i) => i !== action.index) }
    
    case 'LOAD_DRAFT':
      return action.draft

    default:
      return state
  }
}

// ============================================================
// COMPONENT
// ============================================================

interface WartaStepperShellProps {
  initialState: WartaDraftState
  edisiId: string
}

export default function WartaStepperShell({ initialState, edisiId }: WartaStepperShellProps) {
  const [state, dispatch] = useReducer(wartaDraftReducer, initialState)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [showDraftDialog, setShowDraftDialog] = useState(false)
  const [savedDraft, setSavedDraft] = useState<WartaDraftState | null>(null)
  
  const draftKey = `warta-draft-${edisiId}`
  const initialLoadDone = useRef(false)

  // 1. Mount effect to check localStorage for existing draft
  useEffect(() => {
    if (initialLoadDone.current) return
    initialLoadDone.current = true

    const localStr = localStorage.getItem(draftKey)
    if (localStr) {
      try {
        const parsed = JSON.parse(localStr) as WartaDraftState
        // We could compare parsed with initialState to see if it's "newer",
        // but since we only save if it changes, just checking existence is a good indicator.
        if (parsed && typeof parsed === 'object' && 'currentStep' in parsed) {
          setSavedDraft(parsed)
          setShowDraftDialog(true)
        }
      } catch (e) {
        console.error("Failed to parse localStorage draft", e)
      }
    }
  }, [draftKey])

  // 2. Effect to debounce save to localStorage when state changes
  useEffect(() => {
    // Skip saving if we are currently prompting about draft restoration
    if (showDraftDialog) return

    const timer = setTimeout(() => {
      localStorage.setItem(draftKey, JSON.stringify(state))
    }, 500)

    return () => clearTimeout(timer)
  }, [state, draftKey, showDraftDialog])

  const handleRestoreDraft = () => {
    if (savedDraft) {
      dispatch({ type: 'LOAD_DRAFT', draft: savedDraft })
    }
    setShowDraftDialog(false)
  }

  const handleDiscardDraft = () => {
    setShowDraftDialog(false)
    localStorage.removeItem(draftKey)
  }

  const validateStep = (targetStep: number): boolean => {
    setErrorMsg('')
    
    // Only validate if we are moving forward
    if (targetStep <= state.currentStep) return true

    if (state.currentStep === 1) {
      if (!state.goranMinggu || state.goranMinggu.trim() === '') {
        setErrorMsg('Goran Minggu tidak boleh kosong')
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (validateStep(state.currentStep + 1)) {
      dispatch({ type: 'NEXT_STEP' })
    }
  }

  const handlePrev = () => {
    // Do not validate when going back
    setErrorMsg('')
    dispatch({ type: 'PREV_STEP' })
  }

  const handleGotoStep = (step: number) => {
    if (validateStep(step)) {
      dispatch({ type: 'GOTO_STEP', step: step as 1|2|3|4|5 })
    }
  }

  const handleSaveFinal = async () => {
    try {
      setIsSaving(true)
      setErrorMsg('')
      await simpanWartaFinal(edisiId, state)
      // If success, clean localstorage
      localStorage.removeItem(draftKey)
      // The server action redirects, so we might not even need to set isSaving false,
      // but just in case:
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan.')
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-6">
      
      {/* Draft Recovery Dialog */}
      <Dialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Lanjutkan Draft?</DialogTitle>
            <DialogDescription className="text-base text-slate-600 pt-2">
              Kami menemukan draft isian warta yang belum tersimpan di browser Anda. Apakah Anda ingin melanjutkannya?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={handleDiscardDraft} className="border-2 border-slate-300">
              Buang Draft
            </Button>
            <Button onClick={handleRestoreDraft} className="bg-[#185735] hover:bg-[#124228] text-white">
              Ya, Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navigation Top */}
      <StepperNav currentStep={state.currentStep} onStepClick={handleGotoStep} />

      {/* Step Render */}
      <div className="bg-white border-2 border-slate-200 rounded-xl shadow-sm p-6 mb-6 min-h-[400px]">
        {state.currentStep === 1 && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b-2 border-slate-200 pb-2">Langkah 1: Jadwal & Pelayan</h2>
            <Step1JadwalPelayan state={state} dispatch={dispatch} />
          </div>
        )}
        {state.currentStep === 2 && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b-2 border-slate-200 pb-2">Langkah 2: Kehadiran & Keuangan</h2>
            <Step2Kehadiran state={state} dispatch={dispatch} />
          </div>
        )}
        {state.currentStep === 3 && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b-2 border-slate-200 pb-2">Langkah 3: Partonggoan</h2>
            <Step3Partonggoan state={state} dispatch={dispatch} />
          </div>
        )}
        {state.currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Langkah 4: Pengumuman</h2>
            <p className="text-slate-600 mb-8">Placeholder untuk form Step 4</p>
          </div>
        )}
        {state.currentStep === 5 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Langkah 5: Preview & Simpan</h2>
            <p className="text-slate-600 mb-8">Placeholder untuk preview keseluruhan warta.</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="mb-4 text-red-700 text-base font-semibold bg-red-50 p-4 border-2 border-red-200 rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between border-t-2 border-slate-200 pt-6">
        {state.currentStep < 5 ? (
          <>
            <motion.div whileTap={{ scale: state.currentStep > 1 ? 0.97 : 1 }}>
              <Button
                variant="outline"
                size="lg"
                disabled={state.currentStep === 1}
                onClick={handlePrev}
                className="text-lg px-6 h-12 border-2 border-slate-300 text-slate-700 font-semibold"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Langkah Sebelumnya
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                onClick={handleNext}
                className="text-lg px-6 h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
              >
                Langkah Berikutnya
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrev}
                disabled={isSaving}
                className="text-lg px-6 h-12 border-2 border-slate-300 text-slate-700 font-semibold"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Kembali Edit
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: isSaving ? 1 : 0.97 }}>
              <Button
                size="lg"
                onClick={handleSaveFinal}
                disabled={isSaving}
                className="text-lg px-8 h-12 bg-[#185735] hover:bg-[#124228] text-white font-semibold"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Simpan Warta
                  </>
                )}
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
