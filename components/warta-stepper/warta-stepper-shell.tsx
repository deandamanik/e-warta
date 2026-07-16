'use client'

import React, { useReducer, useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Save, Loader2, BookOpen } from 'lucide-react'

import { WartaDraftState, DodingItemDraft, KehadiranItemDraft, PartonggoanKehadiranDraft, PartonggoanJadwalDraft } from '@/lib/types/warta-draft'
import { simpanWartaFinal, simpanDraftWarta, hapusAtauResetWarta } from '@/app/actions/warta'
import StepperNav from './stepper-nav'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

import Step1JadwalPelayan from './step-1-jadwal-pelayan'
import Step2Kehadiran from './step-2-kehadiran'
import Step3Partonggoan from './step-3-partonggoan'
import Step4Pengumuman from './step-4-pengumuman'
import Step5Preview from './step-5-preview'

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
  | { type: 'RESET_FORM' }

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
      return { ...state, dodingItems: [...(state.dodingItems || []), action.item] }
    case 'UPDATE_DODING_ITEM': {
      const newArr = [...(state.dodingItems || [])]
      newArr[action.index] = action.item
      return { ...state, dodingItems: newArr }
    }
    case 'REMOVE_DODING_ITEM':
      return { ...state, dodingItems: (state.dodingItems || []).filter((_, i) => i !== action.index) }
    
    case 'ADD_KEHADIRAN_ITEM':
      return { ...state, kehadiranItems: [...(state.kehadiranItems || []), action.item] }
    case 'UPDATE_KEHADIRAN_ITEM': {
      const newArr = [...(state.kehadiranItems || [])]
      newArr[action.index] = action.item
      return { ...state, kehadiranItems: newArr }
    }
    case 'REMOVE_KEHADIRAN_ITEM':
      return { ...state, kehadiranItems: (state.kehadiranItems || []).filter((_, i) => i !== action.index) }

    case 'ADD_PARTONGGOAN_KEHADIRAN':
      return { ...state, partonggoanKehadiran: [...(state.partonggoanKehadiran || []), action.item] }
    case 'UPDATE_PARTONGGOAN_KEHADIRAN': {
      const newArr = [...(state.partonggoanKehadiran || [])]
      newArr[action.index] = action.item
      return { ...state, partonggoanKehadiran: newArr }
    }
    case 'REMOVE_PARTONGGOAN_KEHADIRAN':
      return { ...state, partonggoanKehadiran: (state.partonggoanKehadiran || []).filter((_, i) => i !== action.index) }

    case 'ADD_PARTONGGOAN_JADWAL':
      return { ...state, partonggoanJadwal: [...(state.partonggoanJadwal || []), action.item] }
    case 'UPDATE_PARTONGGOAN_JADWAL': {
      const newArr = [...(state.partonggoanJadwal || [])]
      newArr[action.index] = action.item
      return { ...state, partonggoanJadwal: newArr }
    }
    case 'REMOVE_PARTONGGOAN_JADWAL':
      return { ...state, partonggoanJadwal: (state.partonggoanJadwal || []).filter((_, i) => i !== action.index) }
    
    case 'LOAD_DRAFT':
      return action.draft
      
    case 'RESET_FORM':
      return {
        currentStep: 1,
        tanggalIbadah: state.tanggalIbadah,
        goranMinggu: '',
        tema_minggu: '',
        modelKebaktian: '',
        warnaLiturgi: '',
        ambilan: '',
        sibasaon: '',
        parAmbilan1Id: null,
        parAmbilan2Id: null,
        sipangidangiPagiId: null,
        sipangidangiSiangId: null,
        parOrganPagiId: null,
        parOrganSiangId: null,
        parmasukPukul: [],
        nextModelKebaktian: '',
        nextParAmbilan1Id: null,
        nextParAmbilan2Id: null,
        nextSipangidangiPagiId: null,
        nextSipangidangiSiangId: null,
        nextParOrganPagiId: null,
        nextParOrganSiangId: null,
        nextParmasukPukul: [],
        dodingItems: [],
        kehadiranItems: [],
        partonggoanKehadiran: [],
        partonggoanJadwal: [],
        pengumumanHtml: '',
      }

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
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  
  const handleResetForm = async () => {
    setIsResetDialogOpen(false)
    try {
      await hapusAtauResetWarta(edisiId)
      dispatch({ type: 'RESET_FORM' })
      setResetKey(prev => prev + 1)
      toast.success("Data warta di database telah dikosongkan.")
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat mereset data.')
    }
  }

  const handleSimpanDraftManual = async () => {
    try {
      setIsSavingDraft(true)
      await simpanDraftWarta(edisiId, state)
      setIsSavingDraft(false)
      toast.success("Data berhasil disimpan ke database.", { description: "Data Anda aman." })
    } catch (err: any) {
      setIsSavingDraft(false)
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan draft.')
    }
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
      // The server action redirects, so we might not even need to set isSaving false,
      // but just in case:
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan.')
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full flex flex-col space-y-6">
      
      {/* HEADER PAGE */}
      <div className="flex justify-between items-center w-full border-b-4 border-slate-800 pb-4 mb-4">
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
        
        <div className="flex items-center gap-3">
          <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
            <AlertDialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-red-300 bg-background hover:bg-red-50 text-red-600 hover:text-red-700 h-10 px-4">
              Reset Form
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Kosongkan Form?</AlertDialogTitle>
                <AlertDialogDescription>
                  Seluruh data yang sudah Anda isi pada draf ini akan dihapus permanen.
                  <br /><br />
                  <span className="font-semibold text-red-600">
                    PERINGATAN: Tindakan ini akan menghapus data secara permanen dari database.
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetForm} className="bg-red-600 hover:bg-red-700 text-white">
                  Ya, Lanjutkan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button onClick={handleSimpanDraftManual} disabled={isSavingDraft} className="font-bold h-10 px-4">
            {isSavingDraft ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Draft"
            )}
          </Button>
        </div>
      </div>

      {/* Navigation Top */}
      <StepperNav currentStep={state.currentStep} onStepClick={handleGotoStep} />

      {/* Step Render */}
      <div key={resetKey} className="w-full bg-white border-2 border-slate-200 rounded-xl shadow-sm p-6 mb-6 min-h-[400px]">
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
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b-2 border-slate-200 pb-2">Langkah 4: Pengumuman</h2>
            <Step4Pengumuman state={state} dispatch={dispatch} />
          </div>
        )}
        {state.currentStep === 5 && (
          <div className="animate-in fade-in duration-300">
            <Step5Preview state={state} dispatch={dispatch} />
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
