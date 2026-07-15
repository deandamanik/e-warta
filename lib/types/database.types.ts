export interface EdisiMinggu {
  id: string
  tanggal_ibadah: string
  created_at: string
  updated_at: string
}

export interface Warta {
  id: string
  edisi_minggu_id: string
  goran_minggu: string | null
  created_at: string
  updated_at: string
}

export interface Tingting {
  id: string
  edisi_minggu_id: string
  is_lengkap: boolean
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      edisi_minggu: {
        Row: EdisiMinggu
        Insert: Omit<EdisiMinggu, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<EdisiMinggu, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<EdisiMinggu>
      }
      warta: {
        Row: Warta
        Insert: Omit<Warta, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Warta, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Warta>
      }
      tingting: {
        Row: Tingting
        Insert: Omit<Tingting, 'id' | 'created_at' | 'updated_at' | 'is_lengkap'> & Partial<Pick<Tingting, 'id' | 'created_at' | 'updated_at' | 'is_lengkap'>>
        Update: Partial<Tingting>
      }
    }
  }
}
