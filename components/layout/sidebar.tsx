'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Plus,
  User,
  Users,
  LogOut,
} from 'lucide-react'

import { createEdisiBaru } from '@/app/actions/edisi'
import { signOut } from '@/app/actions/auth'

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
]

const masterDataItems = [
  {
    label: 'Data Pelayan Gereja',
    href: '/master-data/pelayan',
    icon: User,
  },
  {
    label: 'Data Jemaat',
    href: '/master-data/jemaat',
    icon: Users,
  },
]

function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
}) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15 }}
    >
      <Link
        href={href}
        className={`flex items-center gap-3 py-3 px-4 text-lg font-medium rounded-sm transition-colors duration-150 ${
          isActive
            ? 'bg-[#C9F9D3] text-[#185735] font-semibold border-l-4 border-[#185735]'
            : 'text-slate-700 hover:bg-slate-100 border-l-4 border-transparent'
        }`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span>{label}</span>
      </Link>
    </motion.div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 bg-white border-r-2 border-slate-200 flex flex-col min-h-screen overflow-hidden">
      {/* Header Sidebar */}
      <div
        className="flex items-center gap-3 p-3.5 border-b border-[#124228] select-none"
        style={{ backgroundColor: '#185735' }}
      >
        <div className="w-11 h-11 bg-white p-1 rounded-full overflow-hidden shadow-sm flex items-center justify-center shrink-0">
          <Image
            src="/logo-gkps.png"
            alt="Logo GKPS"
            width={38}
            height={38}
            className="shrink-0"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-white font-extrabold text-sm tracking-wide">
            GKPS
          </span>
          <span className="text-emerald-100 text-sm font-normal leading-tight block truncate opacity-90">
            Pamatang Simalungun
          </span>
        </div>
      </div>

      {/* Konten Menu */}
      <nav className="flex-1 flex flex-col py-4 overflow-y-auto overflow-x-hidden">
        {/* Grup: MENU UTAMA */}
        <div className="mb-4 flex flex-col gap-1">
          <p className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400 select-none mb-1 block">
            Menu Utama
          </p>

          {/* Dashboard */}
          {menuItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}

          {/* Buat Warta Baru — form Server Action */}
          <motion.div
            whileHover={{ x: 2 }}
            transition={{ duration: 0.15 }}
          >
            <form action={createEdisiBaru}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 py-3 px-4 text-lg font-medium text-slate-700 hover:bg-slate-100 border-l-4 border-transparent transition-colors duration-150 rounded-sm"
              >
                <Plus className="w-5 h-5 shrink-0" />
                <span>Buat Warta Baru</span>
              </button>
            </form>
          </motion.div>
        </div>

        {/* Grup: MASTER DATA */}
        <div className="mb-4 flex flex-col gap-1">
          <p className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400 select-none mb-1 block">
            Master Data
          </p>

          {masterDataItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname.startsWith(item.href)}
            />
          ))}
        </div>
      </nav>

      {/* Keluar — bagian bawah sidebar */}
      <div className="border-t-2 border-slate-200 py-3">
        <motion.div
          whileHover={{ x: 2 }}
          transition={{ duration: 0.15 }}
        >
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 py-3 px-4 text-lg font-medium text-slate-700 hover:bg-slate-100 border-l-4 border-transparent transition-colors duration-150 rounded-sm"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Keluar</span>
            </button>
          </form>
        </motion.div>
      </div>
    </aside>
  )
}
