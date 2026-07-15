'use client'

import { useState } from 'react'
import Image from 'next/image'
import { LogIn } from 'lucide-react'
import { motion } from 'framer-motion'
import { signIn } from '@/app/actions/auth'

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setErrorMessage(null)

    const result = await signIn(formData)

    if (result?.error) {
      setErrorMessage(result.error)
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          {/* Logo & Judul Gereja */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/logo-gkps.png"
              alt="Logo GKPS"
              width={80}
              height={80}
              className="mb-4"
              priority
            />
            <h1 className="text-xl font-semibold text-slate-900 text-center leading-tight">
              GKPS PAMATANG SIMALUNGUN
            </h1>
            <p className="text-base font-medium text-slate-600 text-center mt-1">
              Resort Siantar III &mdash; Sistem e-Warta
            </p>
          </div>

          {/* Pesan Error */}
          {errorMessage && (
            <div className="mb-6 bg-red-50 border-2 border-red-400 text-red-800 text-base p-3 rounded">
              {errorMessage}
            </div>
          )}

          {/* Form Login */}
          <form action={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-lg font-medium text-slate-900"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="border-2 border-slate-400 focus:border-slate-700 rounded-lg px-4 py-3 text-base text-slate-900 outline-none transition-colors duration-150"
                placeholder="admin@gkps.id"
              />
            </div>

            {/* Kata Sandi */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-lg font-medium text-slate-900"
              >
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="border-2 border-slate-400 focus:border-slate-700 rounded-lg px-4 py-3 text-base text-slate-900 outline-none transition-colors duration-150"
                placeholder="••••••••"
              />
            </div>

            {/* Tombol Submit */}
            <motion.button
              type="submit"
              disabled={isPending}
              whileTap={{ scale: 0.97 }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#185735] px-8 py-4 text-lg font-semibold text-white transition-colors duration-150 hover:bg-[#0f3d24] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <LogIn className="w-5 h-5" />
              {isPending ? 'Memproses...' : 'Masuk ke Sistem'}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  )
}
