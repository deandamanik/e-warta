'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Bold, List, ListOrdered, Megaphone } from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { WartaDraftState } from '@/lib/types/warta-draft'

interface Step4PengumumanProps {
  state: WartaDraftState
  dispatch: React.Dispatch<any>
}

export default function Step4Pengumuman({ state, dispatch }: Step4PengumumanProps) {
  const isUpdating = useRef(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: state.pengumumanHtml,
    editorProps: {
      attributes: {
        // We use arbitrary tailwind selectors to ensure lists render properly
        // since tailwind's preflight resets list styles by default.
        class: 'min-h-[300px] p-4 text-base focus:outline-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-1 [&_p]:mb-2',
      },
    },
    onUpdate: ({ editor }) => {
      isUpdating.current = true
      dispatch({ type: 'SET_FIELD', field: 'pengumumanHtml', value: editor.getHTML() })
    },
  })

  // Sinkronisasi jika draft di-load (tetapi jangan re-set jika sedang diedit agar kursor tidak lompat)
  useEffect(() => {
    if (editor && typeof state.pengumumanHtml === 'string' && !isUpdating.current) {
       if (editor.getHTML() !== state.pengumumanHtml) {
         // Saat reset form (pengumumanHtml === ''), editor defaultnya me-return '<p></p>'
         if (state.pengumumanHtml === '' && editor.getHTML() === '<p></p>') {
           // Sudah ekuivalen kosong, biarkan
         } else {
           editor.commands.setContent(state.pengumumanHtml)
         }
       }
    }
    isUpdating.current = false
  }, [state.pengumumanHtml, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <motion.div 
        className="border-2 border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col w-full"
      >
        <div className="bg-slate-100 border-b-2 border-slate-300 px-6 py-4 flex flex-col gap-1">
          <div className="flex items-center">
            <Megaphone className="w-6 h-6 mr-3 text-slate-700" />
            <h3 className="text-xl font-bold text-slate-800">Namasa Pakon Nasihol Sipamasaon</h3>
          </div>
          <p className="text-slate-600 font-medium ml-9">Pengumuman & Pemberitahuan Jemaat</p>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap pb-2 border-b-2 border-slate-200">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`flex items-center h-10 px-4 rounded-md border-2 font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                editor.isActive('bold')
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <Bold className="w-5 h-5 mr-2" />
              Tebal
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`flex items-center h-10 px-4 rounded-md border-2 font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                editor.isActive('bulletList')
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <List className="w-5 h-5 mr-2" />
              Poin
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`flex items-center h-10 px-4 rounded-md border-2 font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                editor.isActive('orderedList')
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <ListOrdered className="w-5 h-5 mr-2" />
              Daftar Bernomor
            </motion.button>
          </div>

          <div className="border-2 border-slate-400 rounded-lg overflow-hidden bg-white shadow-inner">
            <EditorContent editor={editor} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
