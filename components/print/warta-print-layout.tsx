import React from 'react'
import Image from 'next/image'
import DOMPurify from 'isomorphic-dompurify'
import { WartaDraftState } from '@/lib/types/warta-draft'

interface WartaPrintLayoutProps {
  data: WartaDraftState
  // Lookup maps passed from parent so this component stays presentational (no fetching)
  pelayanLookup?: Record<string, string>    // id -> "{gelar} {nama}"
  keluargaLookup?: Record<string, string>   // id -> "nama_keluarga"
}

function LookupName(lookup: Record<string, string> | undefined, id: string | null): string {
  if (!id || !lookup) return '—'
  return lookup[id] ?? '—'
}

export default function WartaPrintLayout({ data, pelayanLookup = {}, keluargaLookup = {} }: WartaPrintLayoutProps) {
  const safePengumuman = DOMPurify.sanitize(data.pengumumanHtml ?? '')

  return (
    <div className="w-[210mm] min-h-[297mm] mx-auto bg-white p-8 font-sans text-slate-900">
      {/* ============================================================ */}
      {/* KOP SURAT                                                     */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between w-full border-b-2 border-slate-700 pb-3 mb-6">
        {/* Pojok KIRI: Logo resmi GKPS */}
        <div className="flex-shrink-0">
          <Image src="/logo-gkps.png" alt="Logo GKPS" width={64} height={64} />
        </div>

        {/* TENGAH: Teks identitas gereja (hardcoded/terkunci, BR-04) */}
        <div className="flex-1 text-center">
          <p className="font-bold text-base">WARTA JEMAAT</p>
          <p className="font-bold text-base">GKPS PAMATANG SIMALUNGUN</p>
          <p className="text-sm">RESORT SIANTAR III</p>
          <p className="text-xs">[Alamat Gereja — isi placeholder tetap]</p>
        </div>

        {/* Pojok KANAN: Logo tema tahunan GKPS */}
        <div className="flex-shrink-0">
          <Image src="/logo-tema-gkps.png" alt="Logo Tema GKPS" width={64} height={64} />
        </div>
      </div>

      {/* ============================================================ */}
      {/* KONTEN UTAMA: 3 KOLOM                                        */}
      {/* ============================================================ */}
      <div className="grid grid-cols-3 gap-6">

        {/* =================== KOLOM KIRI =================== */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bold text-sm border-b-2 border-slate-700 pb-1 mb-2 uppercase">
              I. Ibadah Minggu Berjalan
            </p>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2 w-1/3">Goran Minggu</td>
                  <td className="py-0.5 font-bold">{data.goranMinggu || '—'}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Model Kebaktian</td>
                  <td className="py-0.5">{data.modelKebaktian || '—'}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Warna Liturgi</td>
                  <td className="py-0.5">{data.warnaLiturgi || '—'}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Ambilan</td>
                  <td className="py-0.5">{data.ambilan || '—'}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Sibasaon</td>
                  <td className="py-0.5">{data.sibasaon || '—'}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Par-Ambilan 1</td>
                  <td className="py-0.5">{LookupName(pelayanLookup, data.parAmbilan1Id)}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Par-Ambilan 2</td>
                  <td className="py-0.5">{LookupName(pelayanLookup, data.parAmbilan2Id)}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Sipangidangi Pagi</td>
                  <td className="py-0.5">{LookupName(pelayanLookup, data.sipangidangiPagiId)}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Sipangidangi Siang</td>
                  <td className="py-0.5">{LookupName(pelayanLookup, data.sipangidangiSiangId)}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Par-Organ Pagi</td>
                  <td className="py-0.5">{LookupName(pelayanLookup, data.parOrganPagiId)}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Par-Organ Siang</td>
                  <td className="py-0.5">{LookupName(pelayanLookup, data.parOrganSiangId)}</td>
                </tr>
                {data.parmasukPukul.length > 0 && (
                  <tr>
                    <td className="py-0.5 font-semibold text-slate-600 pr-2">Parmasuk Pukul</td>
                    <td className="py-0.5">{data.parmasukPukul.join(', ')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div>
            <p className="font-bold text-sm border-b-2 border-slate-700 pb-1 mb-2 uppercase">
              II. Ringkasan Minggu Depan
            </p>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2 w-1/3">Model Kebaktian</td>
                  <td className="py-0.5">{data.nextModelKebaktian || '—'}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Par-Ambilan 1</td>
                  <td className="py-0.5">{LookupName(pelayanLookup, data.nextParAmbilan1Id)}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Par-Ambilan 2</td>
                  <td className="py-0.5">{LookupName(pelayanLookup, data.nextParAmbilan2Id)}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Sipangidangi Pagi</td>
                  <td className="py-0.5">{LookupName(pelayanLookup, data.nextSipangidangiPagiId)}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Sipangidangi Siang</td>
                  <td className="py-0.5">{LookupName(pelayanLookup, data.nextSipangidangiSiangId)}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Par-Organ Pagi</td>
                  <td className="py-0.5">{LookupName(pelayanLookup, data.nextParOrganPagiId)}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-slate-600 pr-2">Par-Organ Siang</td>
                  <td className="py-0.5">{LookupName(pelayanLookup, data.nextParOrganSiangId)}</td>
                </tr>
                {data.nextParmasukPukul.length > 0 && (
                  <tr>
                    <td className="py-0.5 font-semibold text-slate-600 pr-2">Parmasuk Pukul</td>
                    <td className="py-0.5">{data.nextParmasukPukul.join(', ')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Nomor Doding */}
          {data.dodingItems.length > 0 && (
            <div>
              <p className="font-bold text-sm border-b-2 border-slate-700 pb-1 mb-2 uppercase">
                Nomor Doding
              </p>
              <div className="flex flex-col gap-1">
                {data.dodingItems.map((item) => (
                  <div key={item.localId} className="flex items-center gap-2 text-xs">
                    {/* KRITIS BR-03: label "Hal No." TERKUNCI, bukan input */}
                    <span className="font-semibold text-slate-700 whitespace-nowrap">Hal No.</span>
                    <span className="font-bold">{item.nomorLagu || '—'}</span>
                    {item.notasiBait && (
                      <span className="text-slate-500">({item.notasiBait})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =================== KOLOM TENGAH =================== */}
        <div className="flex flex-col gap-4">
          {/* Tabel Kehadiran */}
          <div>
            <p className="font-bold text-sm border-b-2 border-slate-700 pb-1 mb-2 uppercase">
              Kehadiran Jemaat
            </p>
            <table className="w-full text-xs border-collapse border-2 border-slate-400">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-400 px-2 py-1 text-left font-bold">Tanggal</th>
                  <th className="border border-slate-400 px-2 py-1 text-left font-bold">Uraian</th>
                  <th className="border border-slate-400 px-2 py-1 text-center font-bold">Lk</th>
                  <th className="border border-slate-400 px-2 py-1 text-center font-bold">Pr</th>
                  <th className="border border-slate-400 px-2 py-1 text-center font-bold">Jlh</th>
                </tr>
              </thead>
              <tbody>
                {data.kehadiranItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="border border-slate-300 px-2 py-2 text-center text-slate-400 italic">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  data.kehadiranItems.map((item) => {
                    const jlh = (Number(item.lk) || 0) + (Number(item.pr) || 0)
                    return (
                      <tr key={item.localId}>
                        <td className="border border-slate-300 px-2 py-1">{item.tanggal || '—'}</td>
                        <td className="border border-slate-300 px-2 py-1">{item.uraian || '—'}</td>
                        <td className="border border-slate-300 px-2 py-1 text-center">{item.lk}</td>
                        <td className="border border-slate-300 px-2 py-1 text-center">{item.pr}</td>
                        <td className="border border-slate-300 px-2 py-1 text-center font-bold">{jlh}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Tabel Kehadiran Partonggoan */}
          <div>
            <p className="font-bold text-sm border-b-2 border-slate-700 pb-1 mb-2 uppercase">
              Kehadiran Partonggoan
            </p>
            <table className="w-full text-xs border-collapse border-2 border-slate-400">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-400 px-2 py-1 text-left font-bold">Sektor</th>
                  <th className="border border-slate-400 px-2 py-1 text-left font-bold">Ianan/Rumah</th>
                  <th className="border border-slate-400 px-2 py-1 text-center font-bold">Lk</th>
                  <th className="border border-slate-400 px-2 py-1 text-center font-bold">Pr</th>
                  <th className="border border-slate-400 px-2 py-1 text-center font-bold">Jlh</th>
                </tr>
              </thead>
              <tbody>
                {data.partonggoanKehadiran.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="border border-slate-300 px-2 py-2 text-center text-slate-400 italic">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  data.partonggoanKehadiran.map((item) => {
                    const jlh = (Number(item.lk) || 0) + (Number(item.pr) || 0)
                    return (
                      <tr key={item.localId}>
                        <td className="border border-slate-300 px-2 py-1 font-bold">{item.sektor}</td>
                        <td className="border border-slate-300 px-2 py-1">{LookupName(keluargaLookup, item.keluargaId)}</td>
                        <td className="border border-slate-300 px-2 py-1 text-center">{item.lk}</td>
                        <td className="border border-slate-300 px-2 py-1 text-center">{item.pr}</td>
                        <td className="border border-slate-300 px-2 py-1 text-center font-bold">{jlh}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Tabel Jadwal Ianan & Sipartugas */}
          <div>
            <p className="font-bold text-sm border-b-2 border-slate-700 pb-1 mb-2 uppercase">
              Jadwal Ianan & Sipartugas
            </p>
            <table className="w-full text-xs border-collapse border-2 border-slate-400">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-400 px-2 py-1 text-left font-bold">Sektor</th>
                  <th className="border border-slate-400 px-2 py-1 text-left font-bold">Ianan/Rumah</th>
                  <th className="border border-slate-400 px-2 py-1 text-left font-bold">Par-Ambilan</th>
                  <th className="border border-slate-400 px-2 py-1 text-left font-bold">Par-Agenda</th>
                </tr>
              </thead>
              <tbody>
                {data.partonggoanJadwal.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="border border-slate-300 px-2 py-2 text-center text-slate-400 italic">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  data.partonggoanJadwal.map((item) => (
                    <tr key={item.localId}>
                      <td className="border border-slate-300 px-2 py-1 font-bold">{item.sektor}</td>
                      <td className="border border-slate-300 px-2 py-1">{LookupName(keluargaLookup, item.keluargaId)}</td>
                      <td className="border border-slate-300 px-2 py-1">{LookupName(pelayanLookup, item.parAmbilanId)}</td>
                      <td className="border border-slate-300 px-2 py-1">{LookupName(pelayanLookup, item.parAgendaId)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =================== KOLOM KANAN =================== */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bold text-sm border-b-2 border-slate-700 pb-1 mb-2 uppercase">
              Namasa Pakon Nasihol Sipamasaon
            </p>
            {safePengumuman ? (
              <div
                className="prose prose-sm max-w-none text-xs text-slate-800 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-0.5 [&_p]:mb-1 [&_strong]:font-bold"
                dangerouslySetInnerHTML={{ __html: safePengumuman }}
              />
            ) : (
              <p className="text-xs text-slate-400 italic">Belum ada pengumuman.</p>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FOOTER                                                        */}
      {/* ============================================================ */}
      <div className="mt-8 pt-3 border-t-2 border-slate-300 text-center">
        <p className="italic text-base text-slate-600">Marsiurupan</p>
      </div>
    </div>
  )
}
