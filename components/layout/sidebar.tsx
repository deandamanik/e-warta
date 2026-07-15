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
    <aside className="w-64 shrink-0 bg-white border-r-2 border-slate-200 flex flex-col min-h-screen">
      {/* Header Sidebar */}
      <div
        className="flex items-center gap-2 px-4 py-5"
        style={{ backgroundColor: '#185735' }}
      >
        <Image
          src="/logo-gkps.png"
          alt="Logo GKPS"
          width={36}
          height={36}
          className="shrink-0"
        />
        <span className="text-white font-semibold text-base leading-tight">
          GKPS &middot; e-WARTA
        </span>
      </div>

      {/* Konten Menu */}
      <nav className="flex-1 flex flex-col py-4 overflow-y-auto">
        {/* Grup: MENU UTAMA */}
        <div className="mb-2">
          <p className="px-4 py-2 text-sm font-medium uppercase tracking-wider text-slate-500 select-none">
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
        <div className="mb-2">
          <p className="px-4 py-2 text-sm font-medium uppercase tracking-wider text-slate-500 select-none">
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
