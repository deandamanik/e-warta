export interface DodingItemDraft {
  localId: string        // uuid client-side sementara sebelum disimpan
  nomorLagu: string
  notasiBait: string
}

export interface KehadiranItemDraft {
  localId: string
  tanggal: string | null
  uraian: string
  lk: number
  pr: number
}

export interface PartonggoanKehadiranDraft {
  localId: string
  sektor: 'I' | 'II' | 'III' | 'IV' | 'V'
  keluargaId: string | null
  lk: number
  pr: number
}

export interface PartonggoanJadwalDraft {
  localId: string
  sektor: 'I' | 'II' | 'III' | 'IV' | 'V'
  keluargaId: string | null
  parAmbilanId: string | null
  parAgendaId: string | null
}

export interface WartaDraftState {
  currentStep: 1 | 2 | 3 | 4 | 5
  tanggalIbadah?: string | null
  // Step 1
  goranMinggu: string
  tema_minggu?: string
  modelKebaktian: string
  warnaLiturgi: string
  ambilan: string
  sibasaon: string
  parAmbilan1Id: string | null
  parAmbilan2Id: string | null
  sipangidangiPagiId: string | null
  sipangidangiSiangId: string | null
  parOrganPagiId: string | null
  parOrganSiangId: string | null
  parmasukPukul: string[]
  nextModelKebaktian: string
  nextParAmbilan1Id: string | null
  nextParAmbilan2Id: string | null
  nextSipangidangiPagiId: string | null
  nextSipangidangiSiangId: string | null
  nextParOrganPagiId: string | null
  nextParOrganSiangId: string | null
  nextParmasukPukul: string[]
  dodingItems: DodingItemDraft[]
  // Step 2
  kehadiranItems: KehadiranItemDraft[]
  // Step 3
  partonggoanKehadiran: PartonggoanKehadiranDraft[]
  partonggoanJadwal: PartonggoanJadwalDraft[]
  // Step 4
  pengumumanHtml: string
}
